package com.quickcourt.quickcourt_backend.repository;

import com.quickcourt.quickcourt_backend.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    List<TimeSlot> findByCourtIdAndSlotDateOrderByStartTimeAsc(
            Long courtId,
            LocalDate slotDate
    );

    List<TimeSlot> findByCourtIdAndSlotDateAndStatusOrderByStartTimeAsc(
            Long courtId,
            LocalDate slotDate,
            TimeSlot.SlotStatus status
    );

    Optional<TimeSlot> findByCourtIdAndSlotDateAndStartTime(
            Long courtId,
            LocalDate slotDate,
            LocalTime startTime
    );

    boolean existsByCourtIdAndSlotDateAndStartTime(
            Long courtId,
            LocalDate slotDate,
            LocalTime startTime
    );

    void deleteByCourtIdAndSlotDate(Long courtId, LocalDate slotDate);
}