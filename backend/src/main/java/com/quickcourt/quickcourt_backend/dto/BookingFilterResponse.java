package com.quickcourt.quickcourt_backend.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingFilterResponse {

    private List<BookingResponse> bookings;
    private long totalBookings;
    private long confirmedBookings;
    private long cancelledBookings;
    private long completedBookings;
}