package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.TimeSlotRequest;
import com.quickcourt.quickcourt_backend.dto.TimeSlotResponse;
import com.quickcourt.quickcourt_backend.entity.Court;
import com.quickcourt.quickcourt_backend.entity.TimeSlot;
import com.quickcourt.quickcourt_backend.entity.User;
import com.quickcourt.quickcourt_backend.repository.CourtRepository;
import com.quickcourt.quickcourt_backend.repository.TimeSlotRepository;
import com.quickcourt.quickcourt_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;
    private final CourtRepository courtRepository;
    private final UserRepository userRepository;

    public TimeSlotResponse createSlot(
            TimeSlotRequest request,
            Long ownerId) {

        User owner = getOwner(ownerId);

        Court court = courtRepository.findById(request.getCourtId())
                .orElseThrow(() -> new RuntimeException("Court not found"));

        validateOwner(court, owner);
        validateSlot(request.getSlotDate(), request.getStartTime(), request.getEndTime());

        if (timeSlotRepository.existsByCourtIdAndSlotDateAndStartTime(
                court.getId(),
                request.getSlotDate(),
                request.getStartTime())) {
            throw new RuntimeException("Time slot already exists");
        }

        TimeSlot.SlotStatus status =
                request.getBlockReason() == null ||
                request.getBlockReason().isBlank()
                        ? TimeSlot.SlotStatus.AVAILABLE
                        : TimeSlot.SlotStatus.BLOCKED;

        TimeSlot slot = TimeSlot.builder()
                .court(court)
                .slotDate(request.getSlotDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(status)
                .blockReason(request.getBlockReason())
                .build();

        return mapToResponse(timeSlotRepository.save(slot));
    }

    @Transactional(readOnly = true)
    public List<TimeSlotResponse> getSlots(
            Long courtId,
            LocalDate date) {

        if (!courtRepository.existsById(courtId)) {
            throw new RuntimeException("Court not found");
        }

        return timeSlotRepository
                .findByCourtIdAndSlotDateOrderByStartTimeAsc(courtId, date)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TimeSlotResponse> getAvailableSlots(
            Long courtId,
            LocalDate date) {

        if (!courtRepository.existsById(courtId)) {
            throw new RuntimeException("Court not found");
        }

        return timeSlotRepository
                .findByCourtIdAndSlotDateAndStatusOrderByStartTimeAsc(
                        courtId,
                        date,
                        TimeSlot.SlotStatus.AVAILABLE
                )
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public TimeSlotResponse blockSlot(
            Long slotId,
            String reason,
            Long ownerId) {

        User owner = getOwner(ownerId);

        TimeSlot slot = timeSlotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Time slot not found"));

        validateOwner(slot.getCourt(), owner);

        if (reason == null || reason.isBlank()) {
            throw new RuntimeException("Block reason is required");
        }

        slot.setStatus(TimeSlot.SlotStatus.BLOCKED);
        slot.setBlockReason(reason);

        return mapToResponse(timeSlotRepository.save(slot));
    }

    public TimeSlotResponse unblockSlot(
            Long slotId,
            Long ownerId) {

        User owner = getOwner(ownerId);

        TimeSlot slot = timeSlotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Time slot not found"));

        validateOwner(slot.getCourt(), owner);

        slot.setStatus(TimeSlot.SlotStatus.AVAILABLE);
        slot.setBlockReason(null);

        return mapToResponse(timeSlotRepository.save(slot));
    }

    public void deleteSlot(
            Long slotId,
            Long ownerId) {

        User owner = getOwner(ownerId);

        TimeSlot slot = timeSlotRepository.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Time slot not found"));

        validateOwner(slot.getCourt(), owner);

        timeSlotRepository.delete(slot);
    }

    private User getOwner(Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        if (owner.getRole() != User.Role.FACILITY_OWNER) {
            throw new RuntimeException("Only facility owners can manage time slots");
        }

        return owner;
    }

    private void validateOwner(Court court, User owner) {
        if (!court.getVenue().getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException(
                    "You are not authorized to manage this court"
            );
        }
    }

    private void validateSlot(
            LocalDate date,
            LocalTime startTime,
            LocalTime endTime) {

        if (date.isBefore(LocalDate.now())) {
            throw new RuntimeException("Slot date cannot be in the past");
        }

        if (!endTime.isAfter(startTime)) {
            throw new RuntimeException(
                    "End time must be after start time"
            );
        }
    }

    private TimeSlotResponse mapToResponse(TimeSlot slot) {
        Court court = slot.getCourt();

        return TimeSlotResponse.builder()
                .id(slot.getId())
                .courtId(court.getId())
                .courtName(court.getName())
                .venueId(court.getVenue().getId())
                .venueName(court.getVenue().getName())
                .slotDate(slot.getSlotDate())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .status(slot.getStatus().name())
                .blockReason(slot.getBlockReason())
                .build();
    }
}