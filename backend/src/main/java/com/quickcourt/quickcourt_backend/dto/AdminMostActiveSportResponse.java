package com.quickcourt.quickcourt_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminMostActiveSportResponse {

    private String sport;
    private long bookingCount;
}