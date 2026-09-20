package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.dto.ProfileResponse;
import com.quickcourt.quickcourt_backend.dto.ProfileUpdateRequest;
import com.quickcourt.quickcourt_backend.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfileController {

    private final ProfileService profileService;

    @PreAuthorize("#userId == authentication.principal.id or hasRole('ADMIN')")
    @GetMapping("/{userId}")
    public ResponseEntity<ProfileResponse> getProfile(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                profileService.getProfile(userId)
        );
    }

    @PreAuthorize("#userId == authentication.principal.id or hasRole('ADMIN')")
    @PutMapping("/{userId}")
    public ResponseEntity<ProfileResponse> updateProfile(
            @PathVariable Long userId,
            @Valid @RequestBody ProfileUpdateRequest request) {

        return ResponseEntity.ok(
                profileService.updateProfile(userId, request)
        );
    }

    @PostMapping(value = "/upload", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadSignupImage(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Please select a valid image file"));
        }

        try {
            java.nio.file.Path profileDir = java.nio.file.Paths.get("uploads", "profiles");
            if (!java.nio.file.Files.exists(profileDir)) {
                java.nio.file.Files.createDirectories(profileDir);
            }

            String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "profile.jpg";
            String extension = "";
            int extIndex = originalName.lastIndexOf('.');
            if (extIndex > 0) {
                extension = originalName.substring(extIndex);
            }
            String filename = "signup_" + java.util.UUID.randomUUID().toString().substring(0, 8) + extension;
            java.nio.file.Path targetPath = profileDir.resolve(filename);
            java.nio.file.Files.copy(file.getInputStream(), targetPath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = "/api/profile/image/" + filename;
            return ResponseEntity.ok(java.util.Map.of("imageUrl", imageUrl));
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("message", "Failed to upload image: " + e.getMessage()));
        }
    }

    @PreAuthorize("#userId == authentication.principal.id or hasRole('ADMIN')")
    @PostMapping(value = "/{userId}/image", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadProfileImage(
            @PathVariable Long userId,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Please select a valid image file"));
        }

        try {
            java.nio.file.Path profileDir = java.nio.file.Paths.get("uploads", "profiles");
            if (!java.nio.file.Files.exists(profileDir)) {
                java.nio.file.Files.createDirectories(profileDir);
            }

            String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "profile.jpg";
            String extension = "";
            int extIndex = originalName.lastIndexOf('.');
            if (extIndex > 0) {
                extension = originalName.substring(extIndex);
            }
            String filename = "user_" + userId + "_" + java.util.UUID.randomUUID().toString().substring(0, 8) + extension;
            java.nio.file.Path targetPath = profileDir.resolve(filename);
            java.nio.file.Files.copy(file.getInputStream(), targetPath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = "/api/profile/image/" + filename;
            return ResponseEntity.ok(profileService.updateProfileImage(userId, imageUrl));
        } catch (Exception e) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(java.util.Map.of("message", "Failed to upload image: " + e.getMessage()));
        }
    }

    @PreAuthorize("#userId == authentication.principal.id or hasRole('ADMIN')")
    @DeleteMapping("/{userId}/image")
    public ResponseEntity<ProfileResponse> deleteProfileImage(@PathVariable Long userId) {
        return ResponseEntity.ok(profileService.deleteProfileImage(userId));
    }

    @GetMapping("/image/{filename:.+}")
    public ResponseEntity<org.springframework.core.io.Resource> getProfileImage(@PathVariable String filename) {
        try {
            java.nio.file.Path file = java.nio.file.Paths.get("uploads", "profiles").resolve(filename);
            org.springframework.core.io.Resource resource = new org.springframework.core.io.UrlResource(file.toUri());
            if (resource.exists() && resource.isReadable()) {
                String contentType = java.nio.file.Files.probeContentType(file);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
                return ResponseEntity.ok()
                        .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                        .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}