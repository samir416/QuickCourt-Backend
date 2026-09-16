package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.dto.VenueResponse;
import com.quickcourt.quickcourt_backend.service.VenueFilterService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/venues/filter")
@RequiredArgsConstructor
@CrossOrigin("*")
public class VenueFilterController {

    private final VenueFilterService venueFilterService;

    @GetMapping
    public ResponseEntity<Page<VenueResponse>> filterVenues(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sport,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String venueType,
            @RequestParam(required = false) Double minRating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                venueFilterService.filterVenues(
                        search,
                        sport,
                        minPrice,
                        maxPrice,
                        venueType,
                        minRating,
                        page,
                        size
                )
        );
    }
}