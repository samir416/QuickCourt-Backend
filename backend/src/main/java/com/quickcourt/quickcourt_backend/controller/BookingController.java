package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.dto.BookingRequest;
import com.quickcourt.quickcourt_backend.dto.BookingResponse;
import com.quickcourt.quickcourt_backend.dto.PaymentRequest;
import com.quickcourt.quickcourt_backend.entity.User;
import com.quickcourt.quickcourt_backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;
    private final com.quickcourt.quickcourt_backend.repository.UserRepository userRepository;

    private User getAuthenticatedUser(User authenticatedUser) {
        if (authenticatedUser != null) {
            return authenticatedUser;
        }
        org.springframework.security.core.Authentication auth =
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            Object principal = auth.getPrincipal();
            if (principal instanceof User) {
                return (User) principal;
            } else if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                return userRepository.findByEmail(((org.springframework.security.core.userdetails.UserDetails) principal).getUsername()).orElse(null);
            } else if (principal instanceof String && !"anonymousUser".equals(principal)) {
                return userRepository.findByEmail((String) principal).orElse(null);
            }
        }
        return null;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal User authenticatedUser) {

        User currentUser = getAuthenticatedUser(authenticatedUser);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("message", "User is not authenticated. Please log in again."));
        }

        // Always associate the booking with the authenticated user
        request.setUserId(currentUser.getId());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(bookingService.createBooking(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
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

    @PreAuthorize("hasRole('FACILITY_OWNER') or hasRole('ADMIN')")
    @GetMapping("/venue/{venueId}")
    public ResponseEntity<List<BookingResponse>> getVenueBookings(
            @PathVariable Long venueId) {

        return ResponseEntity.ok(
                bookingService.getVenueBookings(venueId)
        );
    }

    @PreAuthorize("hasRole('FACILITY_OWNER') or hasRole('ADMIN')")
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

    @PreAuthorize("hasRole('FACILITY_OWNER') or hasRole('ADMIN')")
    @PutMapping("/{id}/complete")
    public ResponseEntity<BookingResponse> completeBooking(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                bookingService.completeBooking(id)
        );
    }

    @PostMapping("/payment")
    public ResponseEntity<?> simulatePayment(
            @Valid @RequestBody PaymentRequest request,
            @AuthenticationPrincipal User authenticatedUser) {

        User currentUser = getAuthenticatedUser(authenticatedUser);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("message", "User is not authenticated. Please log in again."));
        }

        if (request.getBookingId() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("message", "Booking ID is required"));
        }

        BookingResponse booking =
                bookingService.getBooking(request.getBookingId());

        if (booking == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(java.util.Map.of("message", "Booking not found"));
        }

        boolean isOwner = booking.getUserId() != null && booking.getUserId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == User.Role.ADMIN;
        if (!isOwner && !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(java.util.Map.of("message", "You can only pay for your own bookings"));
        }

        return ResponseEntity.ok(
                bookingService.simulatePayment(
                        request.getBookingId()
                )
        );
    }
}