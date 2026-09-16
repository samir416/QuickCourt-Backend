package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.dto.CourtRequest;
import com.quickcourt.quickcourt_backend.dto.CourtResponse;
import com.quickcourt.quickcourt_backend.service.CourtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CourtController {

    private final CourtService courtService;

    @PostMapping
    public ResponseEntity<CourtResponse> createCourt(
            @Valid @RequestBody CourtRequest request,
            @RequestParam Long ownerId) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(courtService.createCourt(request, ownerId));
    }

    @GetMapping("/venue/{venueId}")
    public ResponseEntity<List<CourtResponse>> getCourtsByVenue(
            @PathVariable Long venueId) {

        return ResponseEntity.ok(
                courtService.getCourtsByVenue(venueId)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourtResponse> getCourt(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                courtService.getCourt(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourtResponse> updateCourt(
            @PathVariable Long id,
            @Valid @RequestBody CourtRequest request,
            @RequestParam Long ownerId) {

        return ResponseEntity.ok(
                courtService.updateCourt(id, request, ownerId)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourt(
            @PathVariable Long id,
            @RequestParam Long ownerId) {

        courtService.deleteCourt(id, ownerId);

        return ResponseEntity.noContent().build();
    }
}