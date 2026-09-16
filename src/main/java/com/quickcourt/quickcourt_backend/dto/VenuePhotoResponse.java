package com.quickcourt.quickcourt_backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VenuePhotoResponse {

    private Long id;
    private Long venueId;
    private String imageUrl;
    private String caption;
    private LocalDateTime createdAt;
}