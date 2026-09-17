package com.quickcourt.quickcourt_backend.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {
    @NotBlank
    private String email;
    @NotBlank
    private String otp;
    @NotBlank
    private String newPassword;
}
