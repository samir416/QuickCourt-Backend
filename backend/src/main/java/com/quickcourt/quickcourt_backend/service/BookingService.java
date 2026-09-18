package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.BookingRequest;
import com.quickcourt.quickcourt_backend.dto.BookingResponse;
import com.quickcourt.quickcourt_backend.entity.Booking;
import com.quickcourt.quickcourt_backend.entity.Court;
import com.quickcourt.quickcourt_backend.entity.TimeSlot;
import com.quickcourt.quickcourt_backend.entity.User;
import com.quickcourt.quickcourt_backend.repository.BookingRepository;
import com.quickcourt.quickcourt_backend.repository.CourtRepository;
import com.quickcourt.quickcourt_backend.repository.TimeSlotRepository;
import com.quickcourt.quickcourt_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final CourtRepository courtRepository;
    private final TimeSlotRepository timeSlotRepository;

    public BookingResponse createBooking(BookingRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new RuntimeException("User account is inactive");
        }

        Court court = courtRepository.findById(request.getCourtId())
                .orElseThrow(() -> new RuntimeException("Court not found"));

        if (!Boolean.TRUE.equals(court.getActive())) {
            throw new RuntimeException("Court is not available");
        }

        LocalDate bookingDate = request.getBookingDate();
        LocalTime startTime = request.getStartTime();
        Integer durationHours = request.getDurationHours();

        if (bookingDate.isBefore(LocalDate.now())) {
            throw new RuntimeException("Booking date cannot be in the past");
        }

        if (durationHours == null || durationHours <= 0) {
            throw new RuntimeException("Duration must be greater than zero");
        }

        LocalTime endTime = startTime.plusHours(durationHours);

        validateOperatingHours(court, startTime, endTime);
        validateBookingTime(bookingDate, startTime);
        validateBlockedSlots(
                court.getId(),
                bookingDate,
                startTime,
                endTime
        );
        validateAvailability(
                court.getId(),
                bookingDate,
                startTime,
                endTime
        );

        double totalPrice = court.getPricePerHour() * durationHours;

        Booking booking = Booking.builder()
                .user(user)
                .court(court)
                .bookingDate(bookingDate)
                .startTime(startTime)
                .durationHours(durationHours)
                .endTime(endTime)
                .totalPrice(totalPrice)
                .status(Booking.BookingStatus.PENDING)
                .paymentStatus(Booking.PaymentStatus.PENDING)
                .build();

        return mapToResponse(bookingRepository.save(booking));
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

        if (!courtRepository.existsById(courtId)) {
            throw new RuntimeException("Court not found");
        }

        return bookingRepository
                .findByCourtIdAndBookingDate(courtId, bookingDate)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public BookingResponse cancelBooking(Long bookingId, Long userId) {
        Booking booking = getBookingEntity(bookingId);

        if (!booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to cancel this booking");
        }

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }

        if (booking.getStatus() == Booking.BookingStatus.COMPLETED) {
            throw new RuntimeException("Completed booking cannot be cancelled");
        }

        LocalDateTime bookingStart = LocalDateTime.of(
                booking.getBookingDate(),
                booking.getStartTime()
        );

        if (!bookingStart.isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Past or ongoing booking cannot be cancelled");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);

        return mapToResponse(bookingRepository.save(booking));
    }

    public BookingResponse completeBooking(Long bookingId) {
        Booking booking = getBookingEntity(bookingId);

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new RuntimeException("Cancelled booking cannot be completed");
        }

        LocalDateTime bookingEnd = LocalDateTime.of(
                booking.getBookingDate(),
                booking.getEndTime()
        );

        if (bookingEnd.isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Booking has not been completed yet");
        }

        booking.setStatus(Booking.BookingStatus.COMPLETED);

        return mapToResponse(bookingRepository.save(booking));
    }

    public BookingResponse simulatePayment(Long bookingId) {
        Booking booking = getBookingEntity(bookingId);

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new RuntimeException("Cancelled booking cannot be paid");
        }

        if (booking.getPaymentStatus() == Booking.PaymentStatus.SUCCESS) {
            return mapToResponse(booking);
        }

        booking.setPaymentStatus(Booking.PaymentStatus.SUCCESS);
        booking.setPaymentReference(
                "QC-" + UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase()
        );
        booking.setStatus(Booking.BookingStatus.CONFIRMED);

        return mapToResponse(bookingRepository.save(booking));
    }

    private Booking getBookingEntity(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    private void validateOperatingHours(
            Court court,
            LocalTime startTime,
            LocalTime endTime) {

        LocalTime openingTime = parseTime(court.getOpeningTime());
        LocalTime closingTime = parseTime(court.getClosingTime());

        if (startTime.isBefore(openingTime)) {
            throw new RuntimeException("Booking starts before court opening time");
        }

        if (endTime.isAfter(closingTime)) {
            throw new RuntimeException("Booking ends after court closing time");
        }
    }

    private void validateBookingTime(
            LocalDate bookingDate,
            LocalTime startTime) {

        LocalDate today = LocalDate.now();

        if (bookingDate.equals(today)
                && !startTime.isAfter(LocalTime.now())) {
            throw new RuntimeException("Booking time must be in the future");
        }
    }

    private void validateBlockedSlots(
            Long courtId,
            LocalDate bookingDate,
            LocalTime requestedStart,
            LocalTime requestedEnd) {

        List<TimeSlot> blockedSlots =
                timeSlotRepository
                        .findByCourtIdAndSlotDateAndStatusOrderByStartTimeAsc(
                                courtId,
                                bookingDate,
                                TimeSlot.SlotStatus.BLOCKED
                        );

        boolean blocked = blockedSlots.stream()
                .anyMatch(slot ->
                        requestedStart.isBefore(slot.getEndTime())
                                && requestedEnd.isAfter(slot.getStartTime())
                );

        if (blocked) {
            throw new RuntimeException(
                    "Selected time slot is blocked for maintenance"
            );
        }
    }

    private void validateAvailability(
            Long courtId,
            LocalDate bookingDate,
            LocalTime requestedStart,
            LocalTime requestedEnd) {

        List<Booking> bookings = bookingRepository
                .findByCourtIdAndBookingDate(courtId, bookingDate);

        boolean conflict = bookings.stream()
                .filter(booking ->
                        booking.getStatus()
                                != Booking.BookingStatus.CANCELLED)
                .anyMatch(booking ->
                        requestedStart.isBefore(booking.getEndTime())
                                && requestedEnd.isAfter(booking.getStartTime())
                );

        if (conflict) {
            throw new RuntimeException(
                    "Selected time slot is already booked"
            );
        }
    }

    private LocalTime parseTime(String time) {
        try {
            return LocalTime.parse(time);
        } catch (Exception exception) {
            throw new RuntimeException(
                    "Invalid court operating time format. Use HH:mm:ss or HH:mm"
            );
        }
    }

    private BookingResponse mapToResponse(Booking booking) {
        User user = booking.getUser();
        Court court = booking.getCourt();

        return BookingResponse.builder()
                .id(booking.getId())
                .userId(user.getId())
                .userName(user.getName())
                .userEmail(user.getEmail())
                .venueId(court.getVenue().getId())
                .venueName(court.getVenue().getName())
                .courtId(court.getId())
                .courtName(court.getName())
                .sport(court.getSport())
                .bookingDate(booking.getBookingDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .durationHours(booking.getDurationHours())
                .pricePerHour(court.getPricePerHour())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus().name())
                .paymentStatus(booking.getPaymentStatus().name())
                .paymentReference(booking.getPaymentReference())
                .build();
    }
}