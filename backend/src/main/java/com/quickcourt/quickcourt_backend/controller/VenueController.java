package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.dto.VenueRequest;
import com.quickcourt.quickcourt_backend.dto.VenueResponse;
import com.quickcourt.quickcourt_backend.service.VenueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VenueController {

    private final VenueService venueService;

    @org.springframework.security.access.prepost.PreAuthorize("#ownerId == authentication.principal.id or hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<VenueResponse> createVenue(
            @Valid @RequestBody VenueRequest request,
            @RequestParam Long ownerId) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(venueService.createVenue(request, ownerId));
    }

    @GetMapping
    public ResponseEntity<Page<VenueResponse>> getVenues(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);

        return ResponseEntity.ok(
                venueService.getApprovedVenues(pageable)
        );
    }

    @GetMapping("/search")
    public ResponseEntity<Page<VenueResponse>> searchVenues(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);

        return ResponseEntity.ok(
                venueService.searchVenues(name, pageable)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<VenueResponse> getVenue(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                venueService.getVenue(id)
        );
    }

    @org.springframework.security.access.prepost.PreAuthorize("#ownerId == authentication.principal.id or hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<VenueResponse> updateVenue(
            @PathVariable Long id,
            @Valid @RequestBody VenueRequest request,
            @RequestParam Long ownerId) {

        return ResponseEntity.ok(
                venueService.updateVenue(id, request, ownerId)
        );
    }

    @org.springframework.security.access.prepost.PreAuthorize("#ownerId == authentication.principal.id or hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVenue(
            @PathVariable Long id,
            @RequestParam Long ownerId) {

        venueService.deleteVenue(id, ownerId);

        return ResponseEntity.noContent().build();
    }
}