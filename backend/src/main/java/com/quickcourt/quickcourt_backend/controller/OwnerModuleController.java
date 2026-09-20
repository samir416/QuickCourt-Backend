package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.dto.BookingResponse;
import com.quickcourt.quickcourt_backend.dto.CourtResponse;
import com.quickcourt.quickcourt_backend.dto.VenueResponse;
import com.quickcourt.quickcourt_backend.entity.Booking;
import com.quickcourt.quickcourt_backend.entity.Court;
import com.quickcourt.quickcourt_backend.entity.User;
import com.quickcourt.quickcourt_backend.entity.Venue;
import com.quickcourt.quickcourt_backend.repository.BookingRepository;
import com.quickcourt.quickcourt_backend.repository.CourtRepository;
import com.quickcourt.quickcourt_backend.repository.UserRepository;
import com.quickcourt.quickcourt_backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/owner")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OwnerModuleController {

    private final UserRepository userRepository;
    private final VenueRepository venueRepository;
    private final CourtRepository courtRepository;
    private final BookingRepository bookingRepository;

    @org.springframework.security.access.prepost.PreAuthorize("#ownerId == authentication.principal.id or hasRole('ADMIN')")
    @GetMapping("/{ownerId}/venues")
    public ResponseEntity<List<VenueResponse>> getOwnerVenues(@PathVariable Long ownerId) {
        User owner = userRepository.findById(ownerId).orElseThrow(() -> new RuntimeException("Owner not found"));
        List<Venue> venues = venueRepository.findByOwner(owner).stream().filter(v -> Boolean.TRUE.equals(v.getActive())).collect(Collectors.toList());
        return ResponseEntity.ok(venues.stream().map(this::mapVenue).collect(Collectors.toList()));
    }

    @org.springframework.security.access.prepost.PreAuthorize("#ownerId == authentication.principal.id or hasRole('ADMIN')")
    @GetMapping("/{ownerId}/courts")
    public ResponseEntity<List<CourtResponse>> getOwnerCourts(@PathVariable Long ownerId) {
        User owner = userRepository.findById(ownerId).orElseThrow(() -> new RuntimeException("Owner not found"));
        List<Venue> venues = venueRepository.findByOwner(owner).stream().filter(v -> Boolean.TRUE.equals(v.getActive())).collect(Collectors.toList());
        List<CourtResponse> courts = new ArrayList<>();
        for (Venue v : venues) {
            courts.addAll(courtRepository.findByVenueIdAndActiveTrue(v.getId()).stream().map(c -> mapCourt(c, v)).collect(Collectors.toList()));
        }
        return ResponseEntity.ok(courts);
    }

    @org.springframework.security.access.prepost.PreAuthorize("#ownerId == authentication.principal.id or hasRole('ADMIN')")
    @GetMapping("/{ownerId}/bookings")
    public ResponseEntity<List<BookingResponse>> getOwnerBookings(@PathVariable Long ownerId) {
        User owner = userRepository.findById(ownerId).orElseThrow(() -> new RuntimeException("Owner not found"));
        List<Venue> venues = venueRepository.findByOwner(owner).stream().filter(v -> Boolean.TRUE.equals(v.getActive())).collect(Collectors.toList());
        List<BookingResponse> bookings = new ArrayList<>();
        for (Venue v : venues) {
            bookings.addAll(bookingRepository.findByCourtVenueIdOrderByBookingDateDescStartTimeDesc(v.getId())
                .stream().map(this::mapBooking).collect(Collectors.toList()));
        }
        return ResponseEntity.ok(bookings);
    }

    private VenueResponse mapVenue(Venue venue) {
        return VenueResponse.builder()
                .id(venue.getId())
                .ownerId(venue.getOwner().getId())
                .ownerName(venue.getOwner().getName())
                .name(venue.getName())
                .description(venue.getDescription())
                .address(venue.getAddress())
                .city(venue.getCity())
                .state(venue.getState())
                .pincode(venue.getPincode())
                .venueType(venue.getVenueType())
                .sports(venue.getSports())
                .amenities(venue.getAmenities())
                .startingPrice(venue.getStartingPrice())
                .approvalStatus(venue.getApprovalStatus() != null ? venue.getApprovalStatus().name() : null)
                .active(venue.getActive())
                .build();
    }

    private CourtResponse mapCourt(Court court, Venue venue) {
        return CourtResponse.builder()
                .id(court.getId())
                .venueId(venue.getId())
                .venueName(venue.getName())
                .name(court.getName())
                .sport(court.getSport())
                .pricePerHour(court.getPricePerHour())
                .openingTime(court.getOpeningTime())
                .closingTime(court.getClosingTime())
                .active(court.getActive())
                .build();
    }

    private BookingResponse mapBooking(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getName())
                .userEmail(booking.getUser().getEmail())
                .courtId(booking.getCourt().getId())
                .courtName(booking.getCourt().getName())
                .venueId(booking.getCourt().getVenue().getId())
                .venueName(booking.getCourt().getVenue().getName())
                .sport(booking.getCourt().getSport())
                .bookingDate(booking.getBookingDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .durationHours(booking.getDurationHours())
                .pricePerHour(booking.getCourt().getPricePerHour())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus().name())
                .paymentStatus(booking.getPaymentStatus().name())
                .paymentReference(booking.getPaymentReference())
                .build();
    }
}
