package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.OwnerDashboardResponse;
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
import java.util.List;

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
}