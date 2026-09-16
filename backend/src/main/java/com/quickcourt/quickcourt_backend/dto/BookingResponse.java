package com.quickcourt.quickcourt_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {

    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long venueId;
    private String venueName;
    private Long courtId;
    private String courtName;
    private String sport;
    private LocalDate bookingDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer durationHours;
    private Double pricePerHour;
    private Double totalPrice;
    private String status;
    private String paymentStatus;
    private String paymentReference;
}