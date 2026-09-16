package com.quickcourt.quickcourt_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VenuePhotoRequest {

    @NotNull(message = "Venue ID is required")
    private Long venueId;

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    private String caption;
}