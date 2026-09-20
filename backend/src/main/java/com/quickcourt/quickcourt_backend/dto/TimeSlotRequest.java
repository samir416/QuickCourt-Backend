package com.quickcourt.quickcourt_backend.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeSlotRequest {

    @NotNull(message = "Court ID is required")
    private Long courtId;

    @NotNull(message = "Slot date is required")
    @JsonAlias({"date", "slotDate"})
    private LocalDate slotDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    private LocalTime endTime;

    private String blockReason;

    public LocalTime getEndTime() {
        if (endTime == null && startTime != null) {
            return startTime.plusHours(1);
        }
        return endTime;
    }
}