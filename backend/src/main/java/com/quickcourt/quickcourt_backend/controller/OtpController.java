package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.dto.OtpRequest;
import com.quickcourt.quickcourt_backend.dto.OtpResponse;
import com.quickcourt.quickcourt_backend.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/otp")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OtpController {

    private final OtpService otpService;

    @PostMapping("/send")
    public ResponseEntity<OtpResponse> sendOtp(
            @RequestBody @Valid OtpRequest request) {

        return ResponseEntity.ok(
                otpService.generateOtp(request.getEmail())
        );
    }

    @PostMapping("/verify")
    public ResponseEntity<OtpResponse> verifyOtp(
            @RequestBody @Valid OtpRequest request) {

        return ResponseEntity.ok(
                otpService.verifyOtp(
                        request.getEmail(),
                        request.getOtp()
                )
        );
    }
}