package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.BookingFilterResponse;
import com.quickcourt.quickcourt_backend.dto.BookingResponse;
import com.quickcourt.quickcourt_backend.entity.Booking;
import com.quickcourt.quickcourt_backend.repository.BookingRepository;
import com.quickcourt.quickcourt_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingFilterService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public BookingFilterResponse getUserBookingSummary(
            Long userId,
            String status) {

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }

        List<Booking> allBookings =
                bookingRepository.findByUserIdOrderByBookingDateDescStartTimeDesc(userId);

        List<Booking> filteredBookings;

        if (status == null || status.isBlank() || status.equalsIgnoreCase("ALL")) {
            filteredBookings = allBookings;
        } else {
            Booking.BookingStatus bookingStatus;

            try {
                bookingStatus = Booking.BookingStatus.valueOf(
                        status.trim().toUpperCase()
                );
            } catch (IllegalArgumentException exception) {
                throw new RuntimeException("Invalid booking status");
            }

            filteredBookings = allBookings.stream()
                    .filter(booking -> booking.getStatus() == bookingStatus)
                    .toList();
        }

        List<BookingResponse> responses = filteredBookings.stream()
                .map(this::mapToResponse)
                .toList();

        long confirmed = allBookings.stream()
                .filter(booking ->
                        booking.getStatus() == Booking.BookingStatus.CONFIRMED)
                .count();

        long cancelled = allBookings.stream()
                .filter(booking ->
                        booking.getStatus() == Booking.BookingStatus.CANCELLED)
                .count();

        long completed = allBookings.stream()
                .filter(booking ->
                        booking.getStatus() == Booking.BookingStatus.COMPLETED)
                .count();

        return BookingFilterResponse.builder()
                .bookings(responses)
                .totalBookings(allBookings.size())
                .confirmedBookings(confirmed)
                .cancelledBookings(cancelled)
                .completedBookings(completed)
                .build();
    }

    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getName())
                .userEmail(booking.getUser().getEmail())
                .venueId(booking.getCourt().getVenue().getId())
                .venueName(booking.getCourt().getVenue().getName())
                .courtId(booking.getCourt().getId())
                .courtName(booking.getCourt().getName())
                .sport(booking.getCourt().getSport())
                .bookingDate(booking.getBookingDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .durationHours(booking.getDurationHours())
                .pricePerHour(booking.getCourt().getPricePerHour())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus().name())
                .paymentStatus(booking.getPaymentStatus().name())
                .paymentReference(booking.getPaymentReference())
                .build();
    }
}