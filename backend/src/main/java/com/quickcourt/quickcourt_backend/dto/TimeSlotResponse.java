package com.quickcourt.quickcourt_backend.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeSlotResponse {

    private Long id;
    private Long courtId;
    private String courtName;
    private Long venueId;
    private String venueName;
    private LocalDate slotDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status;
    private String blockReason;

    public boolean isAvailable() {
        return "AVAILABLE".equals(this.status);
    }
}