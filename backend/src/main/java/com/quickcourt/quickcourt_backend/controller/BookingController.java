package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.dto.BookingRequest;
import com.quickcourt.quickcourt_backend.dto.BookingResponse;
import com.quickcourt.quickcourt_backend.dto.PaymentRequest;
import com.quickcourt.quickcourt_backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(bookingService.createBooking(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBooking(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                bookingService.getBooking(id)
        );
    }

    @PreAuthorize("#userId == authentication.principal.id or hasRole('ADMIN')")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponse>> getUserBookings(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                bookingService.getUserBookings(userId)
        );
    }

    @GetMapping("/venue/{venueId}")
    public ResponseEntity<List<BookingResponse>> getVenueBookings(
            @PathVariable Long venueId) {

        return ResponseEntity.ok(
                bookingService.getVenueBookings(venueId)
        );
    }

    @GetMapping("/court/{courtId}")
    public ResponseEntity<List<BookingResponse>> getCourtBookings(
            @PathVariable Long courtId,
            @RequestParam LocalDate bookingDate) {

        return ResponseEntity.ok(
                bookingService.getCourtBookings(
                        courtId,
                        bookingDate
                )
        );
    }

    @PreAuthorize("#userId == authentication.principal.id or hasRole('ADMIN')")
    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long id,
            @RequestParam Long userId) {

        return ResponseEntity.ok(
                bookingService.cancelBooking(id, userId)
        );
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<BookingResponse> completeBooking(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                bookingService.completeBooking(id)
        );
    }

    @PostMapping("/payment")
    public ResponseEntity<BookingResponse> simulatePayment(
            @Valid @RequestBody PaymentRequest request) {

        return ResponseEntity.ok(
                bookingService.simulatePayment(
                        request.getBookingId()
                )
        );
    }
}