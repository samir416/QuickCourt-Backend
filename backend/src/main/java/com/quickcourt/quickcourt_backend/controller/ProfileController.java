package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.dto.ProfileResponse;
import com.quickcourt.quickcourt_backend.dto.ProfileUpdateRequest;
import com.quickcourt.quickcourt_backend.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/{userId}")
    public ResponseEntity<ProfileResponse> getProfile(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                profileService.getProfile(userId)
        );
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ProfileResponse> updateProfile(
            @PathVariable Long userId,
            @Valid @RequestBody ProfileUpdateRequest request) {

        return ResponseEntity.ok(
                profileService.updateProfile(userId, request)
        );
    }
}