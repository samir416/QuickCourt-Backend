package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.AdminDashboardTrendResponse;
import com.quickcourt.quickcourt_backend.dto.AdminFacilityApprovalTrendResponse;
import com.quickcourt.quickcourt_backend.dto.AdminMostActiveSportResponse;
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
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminDashboardTrendService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final VenueRepository venueRepository;

    @Transactional(readOnly = true)
    public List<AdminDashboardTrendResponse> getMonthlyTrends() {

        List<User> users = userRepository.findAll();
        List<Booking> bookings = bookingRepository.findAll();

        YearMonth currentMonth = YearMonth.now();

        List<AdminDashboardTrendResponse> trends = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");

        for (int i = 5; i >= 0; i--) {

            YearMonth month = currentMonth.minusMonths(i);

            long userCount = users.stream()
                    .filter(user -> user.getCreatedAt() != null)
                    .filter(user -> YearMonth.from(user.getCreatedAt())
                            .equals(month))
                    .count();

            long bookingCount = bookings.stream()
                    .filter(booking -> booking.getStatus() != Booking.BookingStatus.CANCELLED)
                    .filter(booking -> booking.getBookingDate() != null)
                    .filter(booking -> YearMonth.from(booking.getBookingDate())
                            .equals(month))
                    .count();

            double earnings = bookings.stream()
                    .filter(booking -> booking.getStatus() != Booking.BookingStatus.CANCELLED)
                    .filter(booking -> booking.getBookingDate() != null)
                    .filter(booking -> YearMonth.from(booking.getBookingDate())
                            .equals(month))
                    .filter(booking -> booking.getPaymentStatus() == Booking.PaymentStatus.SUCCESS)
                    .mapToDouble(booking -> booking.getTotalPrice() == null
                            ? 0.0
                            : booking.getTotalPrice())
                    .sum();

            trends.add(
                    AdminDashboardTrendResponse.builder()
                            .period(month.format(formatter))
                            .users(userCount)
                            .bookings(bookingCount)
                            .earnings(earnings)
                            .build());
        }

        return trends;
    }

    @Transactional(readOnly = true)
    public List<AdminFacilityApprovalTrendResponse> getFacilityApprovalTrend() {

        List<Venue> venues = venueRepository.findAll();

        YearMonth currentMonth = YearMonth.now();

        List<AdminFacilityApprovalTrendResponse> trends = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");

        for (int i = 5; i >= 0; i--) {

            YearMonth month = currentMonth.minusMonths(i);

            long pending = venues.stream()
                    .filter(venue -> venue.getCreatedAt() != null)
                    .filter(venue -> YearMonth.from(venue.getCreatedAt())
                            .equals(month))
                    .filter(venue -> venue.getApprovalStatus() == Venue.ApprovalStatus.PENDING)
                    .count();

            long approved = venues.stream()
                    .filter(venue -> venue.getCreatedAt() != null)
                    .filter(venue -> YearMonth.from(venue.getCreatedAt())
                            .equals(month))
                    .filter(venue -> venue.getApprovalStatus() == Venue.ApprovalStatus.APPROVED)
                    .count();

            long rejected = venues.stream()
                    .filter(venue -> venue.getCreatedAt() != null)
                    .filter(venue -> YearMonth.from(venue.getCreatedAt())
                            .equals(month))
                    .filter(venue -> venue.getApprovalStatus() == Venue.ApprovalStatus.REJECTED)
                    .count();

            trends.add(
                    AdminFacilityApprovalTrendResponse.builder()
                            .period(month.format(formatter))
                            .pending(pending)
                            .approved(approved)
                            .rejected(rejected)
                            .build());
        }

        return trends;
    }

    @Transactional(readOnly = true)
    public List<AdminMostActiveSportResponse> getMostActiveSports() {

        List<Booking> bookings = bookingRepository.findAll();

        Map<String, Long> sportCounts = new HashMap<>();

        bookings.stream()
                .filter(booking -> booking.getStatus() != Booking.BookingStatus.CANCELLED)
                .filter(booking -> booking.getCourt() != null)
                .map(booking -> booking.getCourt().getSport())
                .filter(sport -> sport != null && !sport.isBlank())
                .map(String::trim)
                .forEach(sport -> sportCounts.merge(sport, 1L, Long::sum));

        return sportCounts.entrySet()
                .stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(entry -> AdminMostActiveSportResponse.builder()
                        .sport(entry.getKey())
                        .bookingCount(entry.getValue())
                        .build())
                .toList();
    }
}