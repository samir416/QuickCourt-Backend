package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.dto.ReviewRequest;
import com.quickcourt.quickcourt_backend.dto.ReviewResponse;
import com.quickcourt.quickcourt_backend.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @Valid @RequestBody ReviewRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(reviewService.createReview(request));
    }

    @GetMapping("/venue/{venueId}")
    public ResponseEntity<List<ReviewResponse>> getVenueReviews(
            @PathVariable Long venueId) {

        return ResponseEntity.ok(
                reviewService.getVenueReviews(venueId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewRequest request) {

        return ResponseEntity.ok(
                reviewService.updateReview(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id,
            @RequestParam Long userId) {

        reviewService.deleteReview(id, userId);

        return ResponseEntity.noContent().build();
    }
}