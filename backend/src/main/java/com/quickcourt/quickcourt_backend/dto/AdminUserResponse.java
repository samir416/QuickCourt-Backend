package com.quickcourt.quickcourt_backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    private Boolean emailVerified;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}