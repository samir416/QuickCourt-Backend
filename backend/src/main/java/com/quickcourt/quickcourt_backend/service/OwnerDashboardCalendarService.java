package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.BookingResponse;
import com.quickcourt.quickcourt_backend.dto.OwnerDashboardCalendarResponse;
import com.quickcourt.quickcourt_backend.entity.Booking;
import com.quickcourt.quickcourt_backend.entity.User;
import com.quickcourt.quickcourt_backend.entity.Venue;
import com.quickcourt.quickcourt_backend.repository.BookingRepository;
import com.quickcourt.quickcourt_backend.repository.UserRepository;
import com.quickcourt.quickcourt_backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OwnerDashboardCalendarService {

    private final BookingRepository bookingRepository;
    private final VenueRepository venueRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<OwnerDashboardCalendarResponse> getCalendar(
            Long ownerId,
            LocalDate startDate,
            LocalDate endDate) {

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        List<Venue> venues = venueRepository.findByOwner(owner);

        List<Booking> allBookings = new ArrayList<>();

        for (Venue venue : venues) {
            allBookings.addAll(
                    bookingRepository
                            .findByCourtVenueIdOrderByBookingDateDescStartTimeDesc(
                                    venue.getId()
                            )
            );
        }

        List<OwnerDashboardCalendarResponse> calendar = new ArrayList<>();

        LocalDate currentDate = startDate;

        while (!currentDate.isAfter(endDate)) {

            LocalDate date = currentDate;

            List<BookingResponse> bookings = allBookings.stream()
                    .filter(booking -> booking.getStatus() == Booking.BookingStatus.CONFIRMED)
                    .filter(booking ->
                            booking.getBookingDate() != null
                                    && booking.getBookingDate().equals(date))
                    .map(this::mapToResponse)
                    .toList();

            calendar.add(
                    OwnerDashboardCalendarResponse.builder()
                            .date(date)
                            .bookings(bookings)
                            .build()
            );

            currentDate = currentDate.plusDays(1);
        }

        return calendar;
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