package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.dto.BookingFilterResponse;
import com.quickcourt.quickcourt_backend.service.BookingFilterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings/filter")
@RequiredArgsConstructor
@CrossOrigin("*")
public class BookingFilterController {

    private final BookingFilterService bookingFilterService;

    @GetMapping("/{userId}")
    public ResponseEntity<BookingFilterResponse> filterBookings(
            @PathVariable Long userId,
            @RequestParam(required = false) String status) {

        return ResponseEntity.ok(
                bookingFilterService.getUserBookingSummary(userId, status)
        );
    }
}