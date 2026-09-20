package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.AdminDashboardResponse;
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

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final VenueRepository venueRepository;
    private final CourtRepository courtRepository;

    public AdminDashboardResponse getDashboard(Long adminId) {
        validateAdmin(adminId);

        long totalUsers = userRepository.findAll()
                .stream()
                .filter(user -> user.getRole() == User.Role.PLAYER)
                .count();

        long totalFacilityOwners = userRepository.findAll()
                .stream()
                .filter(user -> user.getRole() == User.Role.FACILITY_OWNER)
                .count();

        long totalBookings = bookingRepository.count();

        long confirmedBookings = bookingRepository.countByStatus(
                Booking.BookingStatus.CONFIRMED
        );

        long cancelledBookings = bookingRepository.countByStatus(
                Booking.BookingStatus.CANCELLED
        );

        long completedBookings = bookingRepository.countByStatus(
                Booking.BookingStatus.COMPLETED
        );

        long totalVenues = venueRepository.count();

        long pendingVenues = venueRepository
                .findByApprovalStatus(Venue.ApprovalStatus.PENDING)
                .size();

        long approvedVenues = venueRepository
                .findByApprovalStatus(Venue.ApprovalStatus.APPROVED)
                .size();

        long rejectedVenues = venueRepository
                .findByApprovalStatus(Venue.ApprovalStatus.REJECTED)
                .size();

        long activeCourts = courtRepository.findAll()
                .stream()
                .filter(Court::getActive)
                .count();

        double totalEarnings = bookingRepository.findAll()
                .stream()
                .filter(booking -> booking.getStatus() != Booking.BookingStatus.CANCELLED)
                .filter(booking ->
                        booking.getPaymentStatus() == Booking.PaymentStatus.SUCCESS)
                .mapToDouble(Booking::getTotalPrice)
                .sum();

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalFacilityOwners(totalFacilityOwners)
                .totalBookings(totalBookings)
                .confirmedBookings(confirmedBookings)
                .cancelledBookings(cancelledBookings)
                .completedBookings(completedBookings)
                .totalVenues(totalVenues)
                .pendingVenues(pendingVenues)
                .approvedVenues(approvedVenues)
                .rejectedVenues(rejectedVenues)
                .activeCourts(activeCourts)
                .totalEarnings(totalEarnings)
                .build();
    }

    private void validateAdmin(Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Admin access required");
        }
    }
}