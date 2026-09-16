package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.AdminDashboardTrendResponse;
import com.quickcourt.quickcourt_backend.entity.Booking;
import com.quickcourt.quickcourt_backend.entity.User;
import com.quickcourt.quickcourt_backend.repository.BookingRepository;
import com.quickcourt.quickcourt_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminDashboardTrendService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    @Transactional(readOnly = true)
    public List<AdminDashboardTrendResponse> getMonthlyTrends() {

        List<User> users = userRepository.findAll();
        List<Booking> bookings = bookingRepository.findAll();

        YearMonth currentMonth = YearMonth.now();

        List<AdminDashboardTrendResponse> trends = new ArrayList<>();

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("MMM yyyy");

        for (int i = 5; i >= 0; i--) {

            YearMonth month = currentMonth.minusMonths(i);

            long userCount = users.stream()
                    .filter(user -> user.getCreatedAt() != null)
                    .filter(user ->
                            YearMonth.from(user.getCreatedAt())
                                    .equals(month))
                    .count();

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
                    AdminDashboardTrendResponse.builder()
                            .period(month.format(formatter))
                            .users(userCount)
                            .bookings(bookingCount)
                            .earnings(earnings)
                            .build()
            );
        }

        return trends;
    }
}