package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.dto.VenuePhotoRequest;
import com.quickcourt.quickcourt_backend.dto.VenuePhotoResponse;
import com.quickcourt.quickcourt_backend.service.VenuePhotoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venue-photos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VenuePhotoController {

    private final VenuePhotoService venuePhotoService;

    @PostMapping
    public ResponseEntity<VenuePhotoResponse> addPhoto(
            @Valid @RequestBody VenuePhotoRequest request,
            @RequestParam Long ownerId) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(venuePhotoService.addPhoto(request, ownerId));
    }

    @GetMapping("/venue/{venueId}")
    public ResponseEntity<List<VenuePhotoResponse>> getVenuePhotos(
            @PathVariable Long venueId) {

        return ResponseEntity.ok(
                venuePhotoService.getVenuePhotos(venueId)
        );
    }

    @DeleteMapping("/{photoId}")
    public ResponseEntity<Void> deletePhoto(
            @PathVariable Long photoId,
            @RequestParam Long ownerId) {

        venuePhotoService.deletePhoto(photoId, ownerId);

        return ResponseEntity.noContent().build();
    }
}