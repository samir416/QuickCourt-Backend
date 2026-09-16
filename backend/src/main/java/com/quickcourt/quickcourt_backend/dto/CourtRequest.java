package com.quickcourt.quickcourt_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourtRequest {

    @NotNull(message = "Venue ID is required")
    private Long venueId;

    @NotBlank(message = "Court name is required")
    private String name;

    @NotBlank(message = "Sport is required")
    private String sport;

    @NotNull(message = "Price per hour is required")
    @Positive(message = "Price must be greater than zero")
    private Double pricePerHour;

    @NotBlank(message = "Opening time is required")
    private String openingTime;

    @NotBlank(message = "Closing time is required")
    private String closingTime;
}