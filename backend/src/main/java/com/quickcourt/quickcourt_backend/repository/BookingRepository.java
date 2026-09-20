package com.quickcourt.quickcourt_backend.repository;

import com.quickcourt.quickcourt_backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByBookingDateDescStartTimeDesc(Long userId);

    List<Booking> findByCourtIdAndBookingDate(Long courtId, LocalDate bookingDate);

    List<Booking> findByCourtIdAndBookingDateAndStatus(
            Long courtId,
            LocalDate bookingDate,
            Booking.BookingStatus status
    );

    List<Booking> findByUserIdAndStatus(
            Long userId,
            Booking.BookingStatus status
    );

    List<Booking> findByCourtVenueIdOrderByBookingDateDescStartTimeDesc(Long venueId);

    boolean existsByCourtIdAndBookingDateAndStartTimeAndStatusNot(
            Long courtId,
            LocalDate bookingDate,
            LocalTime startTime,
            Booking.BookingStatus status
    );

    long countByStatus(Booking.BookingStatus status);

    long countByCourtVenueId(Long venueId);

    boolean existsByCourtIdAndBookingDateGreaterThanEqualAndStatusIn(
            Long courtId,
            LocalDate bookingDate,
            List<Booking.BookingStatus> statuses
    );
}