package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.AuthRequest;
import com.quickcourt.quickcourt_backend.dto.AuthResponse;
import com.quickcourt.quickcourt_backend.dto.LoginRequest;
import com.quickcourt.quickcourt_backend.entity.User;
import com.quickcourt.quickcourt_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;

    public AuthResponse register(AuthRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        User.Role role = parseRole(request.getRole());

        User user = User.builder()
                .name(request.getName())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .emailVerified(false)
                .active(true)
                .build();

        User savedUser = userRepository.save(user);

        otpService.generateOtp(savedUser.getEmail());

        return AuthResponse.builder()
                .userId(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().name())
                .message("Registration successful. OTP generated successfully")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!user.getActive()) {
            throw new RuntimeException("Account is inactive");
        }

        if (!user.getEmailVerified()) {
            throw new RuntimeException("Please verify your email before login");
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }

        return AuthResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .message("Login successful")
                .build();
    }

    private User.Role parseRole(String role) {
        if (role == null || role.isBlank()) {
            return User.Role.PLAYER;
        }

        try {
            return User.Role.valueOf(
                    role.trim().toUpperCase()
            );
        } catch (IllegalArgumentException exception) {
            throw new RuntimeException("Invalid role");
        }
    }
}