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
    private final com.quickcourt.quickcourt_backend.repository.BookingRepository bookingRepository;

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

    @Transactional
    public List<TimeSlotResponse> getSlots(
            Long courtId,
            LocalDate date) {

        Court court = courtRepository.findById(courtId)
                .orElseThrow(() -> new RuntimeException("Court not found"));

        LocalTime opening = LocalTime.parse(court.getOpeningTime());
        LocalTime closing = LocalTime.parse(court.getClosingTime());

        List<TimeSlot> existing = timeSlotRepository.findByCourtIdAndSlotDateOrderByStartTimeAsc(courtId, date);

        LocalTime current = opening;
        while (current.isBefore(closing)) {
            LocalTime next = current.plusHours(1);
            LocalTime loopCurrent = current;
            if (existing.stream().noneMatch(s -> s.getStartTime().equals(loopCurrent))) {
                TimeSlot slot = new TimeSlot();
                slot.setCourt(court);
                slot.setSlotDate(date);
                slot.setStartTime(current);
                slot.setEndTime(next);
                slot.setStatus(TimeSlot.SlotStatus.AVAILABLE);
                timeSlotRepository.save(slot);
            }
            current = next;
        }

        List<TimeSlot> allSlots = timeSlotRepository.findByCourtIdAndSlotDateOrderByStartTimeAsc(courtId, date);
        List<com.quickcourt.quickcourt_backend.entity.Booking> bookings = bookingRepository
                .findByCourtIdAndBookingDate(courtId, date).stream()
                .filter(b -> b.getStatus() != com.quickcourt.quickcourt_backend.entity.Booking.BookingStatus.CANCELLED).toList();

        return allSlots.stream().map(slot -> {
            TimeSlotResponse res = mapToResponse(slot);
            for (com.quickcourt.quickcourt_backend.entity.Booking booking : bookings) {
                if (slot.getStartTime().isBefore(booking.getEndTime()) && slot.getEndTime().isAfter(booking.getStartTime())) {
                    res.setStatus("BOOKED");
                    break;
                }
            }
            return res;
        }).collect(java.util.stream.Collectors.toList());
    }



    
    @Transactional(readOnly = true)
    public List<TimeSlotResponse> getAvailableSlots(
            Long courtId,
            LocalDate date) {

        Court court = courtRepository.findById(courtId)
                .orElseThrow(() -> new RuntimeException("Court not found"));

        LocalTime opening = LocalTime.parse(court.getOpeningTime());
        LocalTime closing = LocalTime.parse(court.getClosingTime());

        List<TimeSlot> blockedSlots = timeSlotRepository
                .findByCourtIdAndSlotDateOrderByStartTimeAsc(courtId, date).stream()
                .filter(s -> s.getStatus() == TimeSlot.SlotStatus.BLOCKED).toList();

        List<com.quickcourt.quickcourt_backend.entity.Booking> bookings = bookingRepository
                .findByCourtIdAndBookingDate(courtId, date).stream()
                .filter(b -> b.getStatus() != com.quickcourt.quickcourt_backend.entity.Booking.BookingStatus.CANCELLED).toList();

        java.util.List<TimeSlotResponse> available = new java.util.ArrayList<>();
        LocalTime current = opening;

        while (current.isBefore(closing)) {
            LocalTime next = current.plusHours(1);
            boolean isBlocked = false;

            for (TimeSlot blocked : blockedSlots) {
                if (current.isBefore(blocked.getEndTime()) && next.isAfter(blocked.getStartTime())) {
                    isBlocked = true;
                    break;
                }
            }

            for (com.quickcourt.quickcourt_backend.entity.Booking booking : bookings) {
                if (current.isBefore(booking.getEndTime()) && next.isAfter(booking.getStartTime())) {
                    isBlocked = true;
                    break;
                }
            }

            if (date.equals(LocalDate.now()) && current.isBefore(LocalTime.now())) {
                isBlocked = true;
            }

            if (!isBlocked) {
                TimeSlotResponse res = new TimeSlotResponse();
                res.setId((long) (current.getHour() * 100));
                res.setCourtId(courtId);
                res.setSlotDate(date);
                res.setStartTime(current);
                res.setEndTime(next);
                res.setStatus("AVAILABLE");
                available.add(res);
            }

            current = next;
        }

        return available;
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