package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.OtpResponse;
import com.quickcourt.quickcourt_backend.entity.OtpVerification;
import com.quickcourt.quickcourt_backend.entity.User;
import com.quickcourt.quickcourt_backend.repository.OtpVerificationRepository;
import com.quickcourt.quickcourt_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpVerificationRepository otpVerificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public OtpResponse generateOtp(String email) {
        String normalizedEmail = email.toLowerCase().trim();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getEmailVerified()) {
            return OtpResponse.builder()
                    .success(true)
                    .message("Email is already verified")
                    .build();
        }

        String otp = String.valueOf(
                ThreadLocalRandom.current().nextInt(100000, 1000000)
        );

        otpVerificationRepository.deleteByEmail(normalizedEmail);

        OtpVerification verification = OtpVerification.builder()
                .email(normalizedEmail)
                .otp(otp)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .verified(false)
                .build();

        otpVerificationRepository.save(verification);

        System.out.println(
                "QuickCourt OTP for " + normalizedEmail + ": " + otp
        );

        return OtpResponse.builder()
                .success(true)
                .message("OTP generated successfully")
                .build();
    }

    @Transactional
    public OtpResponse verifyOtp(String email, String otp) {
        String normalizedEmail = email.toLowerCase().trim();

        OtpVerification verification = otpVerificationRepository
                .findTopByEmailOrderByCreatedAtDesc(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired");
        }

        if (verification.getVerified()) {
            throw new RuntimeException("OTP already verified");
        }

        if (!verification.getOtp().equals(otp.trim())) {
            throw new RuntimeException("Invalid OTP");
        }

        verification.setVerified(true);
        otpVerificationRepository.save(verification);

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEmailVerified(true);
        userRepository.save(user);

        return OtpResponse.builder()
                .success(true)
                .message("Email verified successfully")
                .build();
    }
}