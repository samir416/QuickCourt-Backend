package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.OwnerDashboardTrendResponse;
import com.quickcourt.quickcourt_backend.entity.Booking;
import com.quickcourt.quickcourt_backend.entity.User;
import com.quickcourt.quickcourt_backend.entity.Venue;
import com.quickcourt.quickcourt_backend.repository.BookingRepository;
import com.quickcourt.quickcourt_backend.repository.UserRepository;
import com.quickcourt.quickcourt_backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OwnerDashboardTrendService {

    private final BookingRepository bookingRepository;
    private final VenueRepository venueRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<OwnerDashboardTrendResponse> getMonthlyTrends(Long ownerId) {

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        List<Venue> venues = venueRepository.findByOwner(owner);

        List<Booking> bookings = new ArrayList<>();

        for (Venue venue : venues) {
            bookings.addAll(
                    bookingRepository
                            .findByCourtVenueIdOrderByBookingDateDescStartTimeDesc(
                                    venue.getId()
                            )
            );
        }

        YearMonth currentMonth = YearMonth.now();

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("MMM yyyy");

        List<OwnerDashboardTrendResponse> trends = new ArrayList<>();

        for (int i = 5; i >= 0; i--) {

            YearMonth month = currentMonth.minusMonths(i);

            long bookingCount = bookings.stream()
                    .filter(booking -> booking.getBookingDate() != null)
                    .filter(booking ->
                            YearMonth.from(booking.getBookingDate())
                                    .equals(month))
                    .count();

            double earnings = bookings.stream()
                    .filter(booking -> booking.getBookingDate() != null)
                    .filter(booking ->
                            YearMonth.from(booking.getBookingDate())
                                    .equals(month))
                    .filter(booking ->
                            booking.getPaymentStatus()
                                    == Booking.PaymentStatus.SUCCESS)
                    .mapToDouble(booking ->
                            booking.getTotalPrice() == null
                                    ? 0.0
                                    : booking.getTotalPrice())
                    .sum();

            trends.add(
                    OwnerDashboardTrendResponse.builder()
                            .period(month.format(formatter))
                            .bookings(bookingCount)
                            .earnings(earnings)
                            .build()
            );
        }

        return trends;
    }
}