package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.OwnerDashboardResponse;
import com.quickcourt.quickcourt_backend.dto.PeakBookingHoursResponse;
import com.quickcourt.quickcourt_backend.entity.Booking;
import com.quickcourt.quickcourt_backend.entity.Court;
import com.quickcourt.quickcourt_backend.entity.User;
import com.quickcourt.quickcourt_backend.entity.Venue;
import com.quickcourt.quickcourt_backend.repository.BookingRepository;
import com.quickcourt.quickcourt_backend.repository.CourtRepository;
import com.quickcourt.quickcourt_backend.repository.UserRepository;
import com.quickcourt.quickcourt_backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OwnerDashboardService {

    private final UserRepository userRepository;
    private final VenueRepository venueRepository;
    private final CourtRepository courtRepository;
    private final BookingRepository bookingRepository;

    public OwnerDashboardResponse getDashboard(Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        if (owner.getRole() != User.Role.FACILITY_OWNER) {
            throw new RuntimeException("Facility owner access required");
        }

        List<Venue> venues = venueRepository.findByOwner(owner);

        long totalVenues = venues.size();

        List<Long> venueIds = venues.stream()
                .map(Venue::getId)
                .toList();

        List<Booking> bookings = venueIds.stream()
                .flatMap(venueId ->
                        bookingRepository
                                .findByCourtVenueIdOrderByBookingDateDescStartTimeDesc(venueId)
                                .stream())
                .distinct()
                .toList();

        long totalBookings = bookings.size();

        long completedBookings = bookings.stream()
                .filter(booking ->
                        booking.getStatus() == Booking.BookingStatus.COMPLETED)
                .count();

        long cancelledBookings = bookings.stream()
                .filter(booking ->
                        booking.getStatus() == Booking.BookingStatus.CANCELLED)
                .count();

        LocalDateTime now = LocalDateTime.now();

        long upcomingBookings = bookings.stream()
                .filter(booking ->
                        booking.getStatus() == Booking.BookingStatus.CONFIRMED)
                .filter(booking ->
                        LocalDateTime.of(
                                booking.getBookingDate(),
                                booking.getStartTime()
                        ).isAfter(now))
                .count();

        long activeCourts = venues.stream()
                .flatMap(venue ->
                        courtRepository
                                .findByVenueIdAndActiveTrue(venue.getId())
                                .stream())
                .count();

        double totalEarnings = bookings.stream()
                .filter(booking ->
                        booking.getPaymentStatus() == Booking.PaymentStatus.SUCCESS)
                .mapToDouble(Booking::getTotalPrice)
                .sum();

        return OwnerDashboardResponse.builder()
                .totalBookings(totalBookings)
                .upcomingBookings(upcomingBookings)
                .completedBookings(completedBookings)
                .cancelledBookings(cancelledBookings)
                .activeCourts(activeCourts)
                .totalVenues(totalVenues)
                .totalEarnings(totalEarnings)
                .build();
    }

    public List<PeakBookingHoursResponse> getPeakBookingHours(Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        if (owner.getRole() != User.Role.FACILITY_OWNER) {
            throw new RuntimeException("Facility owner access required");
        }

        List<Venue> venues = venueRepository.findByOwner(owner);

        List<Long> venueIds = venues.stream()
                .map(Venue::getId)
                .toList();

        List<Booking> bookings = venueIds.stream()
                .flatMap(venueId ->
                        bookingRepository
                                .findByCourtVenueIdOrderByBookingDateDescStartTimeDesc(venueId)
                                .stream())
                .distinct()
                .filter(booking ->
                        booking.getStatus() != Booking.BookingStatus.CANCELLED)
                .toList();

        Map<Integer, Long> bookingCounts = bookings.stream()
                .collect(Collectors.groupingBy(
                        booking -> booking.getStartTime().getHour(),
                        Collectors.counting()
                ));

        List<PeakBookingHoursResponse> response = new ArrayList<>();

        for (int hour = 0; hour < 24; hour++) {
            response.add(
                    PeakBookingHoursResponse.builder()
                            .hour(String.format("%02d:00", hour))
                            .bookingCount(bookingCounts.getOrDefault(
                                    hour,
                                    0L
                            ))
                            .build()
            );
        }

        return response;
    }
}