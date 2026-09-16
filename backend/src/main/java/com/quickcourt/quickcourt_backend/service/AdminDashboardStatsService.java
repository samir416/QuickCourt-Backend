package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.AdminDashboardStatsResponse;
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
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminDashboardStatsService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final CourtRepository courtRepository;
    private final VenueRepository venueRepository;

    @Transactional(readOnly = true)
    public AdminDashboardStatsResponse getStats() {

        List<User> users = userRepository.findAll();
        List<Booking> bookings = bookingRepository.findAll();
        List<Court> courts = courtRepository.findAll();
        List<Venue> venues = venueRepository.findAll();

        long totalUsers = users.size();

        long totalFacilityOwners = users.stream()
                .filter(user -> user.getRole() != null)
                .filter(user ->
                        user.getRole().name()
                                .equalsIgnoreCase("FACILITY_OWNER"))
                .count();

        long activeCourts = courts.stream()
                .filter(court ->
                        court.getActive() != null
                                && court.getActive())
                .count();

        long pendingVenues = venues.stream()
                .filter(venue ->
                        venue.getApprovalStatus()
                                == Venue.ApprovalStatus.PENDING)
                .count();

        long approvedVenues = venues.stream()
                .filter(venue ->
                        venue.getApprovalStatus()
                                == Venue.ApprovalStatus.APPROVED)
                .count();

        long rejectedVenues = venues.stream()
                .filter(venue ->
                        venue.getApprovalStatus()
                                == Venue.ApprovalStatus.REJECTED)
                .count();

        Set<String> sports = new HashSet<>();

        venues.stream()
                .map(Venue::getSports)
                .filter(value -> value != null && !value.isBlank())
                .flatMap(value ->
                        Arrays.stream(value.split(",")))
                .map(String::trim)
                .filter(value -> !value.isBlank())
                .map(String::toLowerCase)
                .forEach(sports::add);

        double totalEarnings = bookings.stream()
                .filter(booking ->
                        booking.getPaymentStatus()
                                == Booking.PaymentStatus.SUCCESS)
                .mapToDouble(booking ->
                        booking.getTotalPrice() == null
                                ? 0.0
                                : booking.getTotalPrice())
                .sum();

        return AdminDashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalFacilityOwners(totalFacilityOwners)
                .totalBookings(bookings.size())
                .activeCourts(activeCourts)
                .totalVenues(venues.size())
                .pendingVenues(pendingVenues)
                .approvedVenues(approvedVenues)
                .rejectedVenues(rejectedVenues)
                .activeSports(sports.size())
                .totalEarnings(totalEarnings)
                .build();
    }
}