package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.BookingRequest;
import com.quickcourt.quickcourt_backend.dto.BookingResponse;
import com.quickcourt.quickcourt_backend.entity.Booking;
import com.quickcourt.quickcourt_backend.entity.Court;
import com.quickcourt.quickcourt_backend.entity.User;
import com.quickcourt.quickcourt_backend.repository.BookingRepository;
import com.quickcourt.quickcourt_backend.repository.CourtRepository;
import com.quickcourt.quickcourt_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final CourtRepository courtRepository;

    public BookingResponse createBooking(BookingRequest request) {

        if (request.getUserId() == null) {
            throw new RuntimeException("User ID is required");
        }

        if (request.getCourtId() == null) {
            throw new RuntimeException("Court ID is required");
        }

        if (request.getBookingDate() == null) {
            throw new RuntimeException("Booking date is required");
        }

        if (request.getStartTime() == null) {
            throw new RuntimeException("Start time is required");
        }

        if (request.getDurationHours() == null || request.getDurationHours() <= 0) {
            throw new RuntimeException("Invalid booking duration");
        }

        if (request.getBookingDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Booking date cannot be in the past");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        

        Court court = courtRepository.findById(request.getCourtId())
                .orElseThrow(() -> new RuntimeException("Court not found"));

        

        LocalTime startTime = request.getStartTime();

        LocalTime endTime;

        try {
            endTime = startTime.plusHours(request.getDurationHours());
        } catch (Exception exception) {
            throw new RuntimeException("Invalid booking time");
        }

        LocalTime openingTime = parseTime(court.getOpeningTime());
        LocalTime closingTime = parseTime(court.getClosingTime());

        if (openingTime != null && startTime.isBefore(openingTime)) {
            throw new RuntimeException("Booking starts before court opening time");
        }

        if (closingTime != null && endTime.isAfter(closingTime)) {
            throw new RuntimeException("Booking exceeds court operating hours");
        }

        if (!request.getBookingDate().isAfter(LocalDate.now())
                && request.getBookingDate().equals(LocalDate.now())
                && startTime.isBefore(LocalTime.now())) {
            throw new RuntimeException("Cannot book a past time slot");
        }

        List<Booking> existingBookings =
                bookingRepository.findByCourtIdAndBookingDate(
                        court.getId(),
                        request.getBookingDate()
                );

        for (Booking existing : existingBookings) {

            if (existing.getStatus() == Booking.BookingStatus.CANCELLED) {
                continue;
            }

            LocalTime existingStart = existing.getStartTime();
            LocalTime existingEnd = existing.getEndTime();

            if (existingStart == null || existingEnd == null) {
                continue;
            }

            boolean overlaps =
                    startTime.isBefore(existingEnd)
                            && endTime.isAfter(existingStart);

            if (overlaps) {
                throw new RuntimeException(
                        "This court is already booked for the selected time"
                );
            }
        }

        double pricePerHour = court.getPricePerHour() == null
                ? 0.0
                : court.getPricePerHour();

        double totalPrice =
                pricePerHour * request.getDurationHours();

        Booking booking = Booking.builder()
                .user(user)
                .court(court)
                .bookingDate(request.getBookingDate())
                .startTime(startTime)
                .endTime(endTime)
                .durationHours(request.getDurationHours())
                .totalPrice(totalPrice)
                .status(Booking.BookingStatus.CONFIRMED)
                .paymentStatus(Booking.PaymentStatus.PENDING)
                .build();

        Booking saved = bookingRepository.save(booking);

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public BookingResponse getBooking(Long id) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        return mapToResponse(booking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }

        return bookingRepository
                .findByUserIdOrderByBookingDateDescStartTimeDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getVenueBookings(Long venueId) {

        return bookingRepository
                .findByCourtVenueIdOrderByBookingDateDescStartTimeDesc(venueId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getCourtBookings(
            Long courtId,
            LocalDate bookingDate) {

        return bookingRepository
                .findByCourtIdAndBookingDate(courtId, bookingDate)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public BookingResponse cancelBooking(Long bookingId, Long userId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getUser() == null
                || !booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not allowed to cancel this booking");
        }

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }

        if (booking.getStatus() == Booking.BookingStatus.COMPLETED) {
            throw new RuntimeException("Completed booking cannot be cancelled");
        }

        LocalDate today = LocalDate.now();

        if (booking.getBookingDate().isBefore(today)
                || (booking.getBookingDate().equals(today)
                && booking.getStartTime() != null
                && !booking.getStartTime().isAfter(LocalTime.now()))) {
            throw new RuntimeException("Past booking cannot be cancelled");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);

        Booking saved = bookingRepository.save(booking);

        return mapToResponse(saved);
    }

    public BookingResponse completeBooking(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new RuntimeException("Cancelled booking cannot be completed");
        }

        if (booking.getStatus() == Booking.BookingStatus.COMPLETED) {
            return mapToResponse(booking);
        }

        booking.setStatus(Booking.BookingStatus.COMPLETED);

        return mapToResponse(bookingRepository.save(booking));
    }

    public BookingResponse simulatePayment(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new RuntimeException("Cancelled booking cannot be paid");
        }

        if (booking.getPaymentStatus() == Booking.PaymentStatus.SUCCESS) {
            return mapToResponse(booking);
        }

        String reference =
                "QC-" +
                UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 8)
                        .toUpperCase();

        booking.setPaymentStatus(Booking.PaymentStatus.SUCCESS);
        booking.setPaymentReference(reference);
        booking.setStatus(Booking.BookingStatus.CONFIRMED);

        return mapToResponse(bookingRepository.save(booking));
    }

    private LocalTime parseTime(String value) {

        if (value == null || value.isBlank()) {
            return null;
        }

        String normalized = value.trim();

        try {
            return LocalTime.parse(
                    normalized,
                    DateTimeFormatter.ofPattern("HH:mm")
            );
        } catch (Exception ignored) {
        }

        try {
            return LocalTime.parse(
                    normalized,
                    DateTimeFormatter.ofPattern("H:mm")
            );
        } catch (Exception ignored) {
        }

        try {
            return LocalTime.parse(normalized);
        } catch (Exception ignored) {
            return null;
        }
    }

    private BookingResponse mapToResponse(Booking booking) {

        Court court = booking.getCourt();
        User user = booking.getUser();

        return BookingResponse.builder()
                .id(booking.getId())
                .userId(user != null ? user.getId() : null)
                .userName(user != null ? user.getName() : null)
                .userEmail(user != null ? user.getEmail() : null)
                .venueId(
                        court != null && court.getVenue() != null
                                ? court.getVenue().getId()
                                : null
                )
                .venueName(
                        court != null && court.getVenue() != null
                                ? court.getVenue().getName()
                                : null
                )
                .courtId(court != null ? court.getId() : null)
                .courtName(court != null ? court.getName() : null)
                .sport(court != null ? court.getSport() : null)
                .bookingDate(booking.getBookingDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .durationHours(booking.getDurationHours())
                .pricePerHour(
                        court != null ? court.getPricePerHour() : null
                )
                .totalPrice(booking.getTotalPrice())
                .status(
                        booking.getStatus() != null
                                ? booking.getStatus().name()
                                : null
                )
                .paymentStatus(
                        booking.getPaymentStatus() != null
                                ? booking.getPaymentStatus().name()
                                : null
                )
                .paymentReference(booking.getPaymentReference())
                .build();
    }
}

