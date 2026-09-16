package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.entity.User;
import com.quickcourt.quickcourt_backend.entity.Venue;
import com.quickcourt.quickcourt_backend.repository.UserRepository;
import com.quickcourt.quickcourt_backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private final UserRepository userRepository;
    private final VenueRepository venueRepository;

    public List<Venue> getPendingVenues(Long adminId) {
        validateAdmin(adminId);

        return venueRepository.findByApprovalStatus(
                Venue.ApprovalStatus.PENDING
        );
    }

    public Venue approveVenue(
            Long venueId,
            Long adminId,
            String comment) {

        validateAdmin(adminId);

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        venue.setApprovalStatus(Venue.ApprovalStatus.APPROVED);
        venue.setApprovalComment(comment);

        return venueRepository.save(venue);
    }

    public Venue rejectVenue(
            Long venueId,
            Long adminId,
            String comment) {

        validateAdmin(adminId);

        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        venue.setApprovalStatus(Venue.ApprovalStatus.REJECTED);
        venue.setApprovalComment(comment);

        return venueRepository.save(venue);
    }

    public List<User> getUsers(Long adminId) {
        validateAdmin(adminId);
        return userRepository.findAll();
    }

    public User banUser(Long userId, Long adminId) {
        validateAdmin(adminId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == User.Role.ADMIN) {
            throw new RuntimeException("Admin account cannot be banned");
        }

        user.setActive(false);

        return userRepository.save(user);
    }

    public User unbanUser(Long userId, Long adminId) {
        validateAdmin(adminId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(true);

        return userRepository.save(user);
    }

    private void validateAdmin(Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Admin access required");
        }
    }
}