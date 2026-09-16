package com.quickcourt.quickcourt_backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminRequest {

    @NotNull(message = "Admin ID is required")
    private Long adminId;

    private String comment;
}