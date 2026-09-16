package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.dto.AdminRequest;
import com.quickcourt.quickcourt_backend.entity.User;
import com.quickcourt.quickcourt_backend.entity.Venue;
import com.quickcourt.quickcourt_backend.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/venues/pending")
    public ResponseEntity<List<Venue>> getPendingVenues(
            @RequestParam Long adminId) {

        return ResponseEntity.ok(
                adminService.getPendingVenues(adminId)
        );
    }

    @PutMapping("/venues/{venueId}/approve")
    public ResponseEntity<Venue> approveVenue(
            @PathVariable Long venueId,
            @Valid @RequestBody AdminRequest request) {

        return ResponseEntity.ok(
                adminService.approveVenue(
                        venueId,
                        request.getAdminId(),
                        request.getComment()
                )
        );
    }

    @PutMapping("/venues/{venueId}/reject")
    public ResponseEntity<Venue> rejectVenue(
            @PathVariable Long venueId,
            @Valid @RequestBody AdminRequest request) {

        return ResponseEntity.ok(
                adminService.rejectVenue(
                        venueId,
                        request.getAdminId(),
                        request.getComment()
                )
        );
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers(
            @RequestParam Long adminId) {

        return ResponseEntity.ok(
                adminService.getUsers(adminId)
        );
    }

    @PutMapping("/users/{userId}/ban")
    public ResponseEntity<User> banUser(
            @PathVariable Long userId,
            @RequestParam Long adminId) {

        return ResponseEntity.ok(
                adminService.banUser(userId, adminId)
        );
    }

    @PutMapping("/users/{userId}/unban")
    public ResponseEntity<User> unbanUser(
            @PathVariable Long userId,
            @RequestParam Long adminId) {

        return ResponseEntity.ok(
                adminService.unbanUser(userId, adminId)
        );
    }
}