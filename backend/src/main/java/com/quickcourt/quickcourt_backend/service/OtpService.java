package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.OtpResponse;
import com.quickcourt.quickcourt_backend.entity.OtpVerification;
import com.quickcourt.quickcourt_backend.entity.User;
import com.quickcourt.quickcourt_backend.repository.OtpVerificationRepository;
import com.quickcourt.quickcourt_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpVerificationRepository otpVerificationRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String mailFrom;

    @Transactional
    public OtpResponse generateOtp(String email, String type) {
        String normalizedEmail = email.toLowerCase().trim();

        userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

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

        // Send actual email
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom);
            message.setTo(normalizedEmail);
            String subject = "RESET_PASSWORD".equalsIgnoreCase(type) ? 
                    "QuickCourt - Password Reset OTP" : "QuickCourt - Email Verification OTP";
            message.setSubject(subject);
            message.setText("QuickCourt\n\nYour verification OTP is:\n\n" + otp + "\n\nThis OTP is valid for 5 minutes.\n\nDo not share this OTP with anyone.");
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("SMTP Email Delivery Failed: " + e.getMessage());
            // Throw exception to roll back transaction and notify frontend
            throw new RuntimeException("Unable to send OTP. Please try again.");
        }

        return OtpResponse.builder()
                .success(true)
                .message("OTP generated and sent successfully")
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
