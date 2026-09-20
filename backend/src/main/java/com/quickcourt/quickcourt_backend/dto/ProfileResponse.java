package com.quickcourt.quickcourt_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    private Boolean emailVerified;
    private Boolean active;
    private String profileImage;
}