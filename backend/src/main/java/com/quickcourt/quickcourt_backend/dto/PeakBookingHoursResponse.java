package com.quickcourt.quickcourt_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PeakBookingHoursResponse {

    private String hour;
    private long bookingCount;
}