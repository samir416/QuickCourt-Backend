package com.quickcourt.quickcourt_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourtResponse {

    private Long id;
    private Long venueId;
    private String venueName;
    private String name;
    private String sport;
    private Double pricePerHour;
    private String openingTime;
    private String closingTime;
    private Boolean active;
}