package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.AuthRequest;
import com.quickcourt.quickcourt_backend.dto.AuthResponse;
import com.quickcourt.quickcourt_backend.dto.LoginRequest;
import com.quickcourt.quickcourt_backend.entity.User;
import com.quickcourt.quickcourt_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.quickcourt.quickcourt_backend.security.JwtService;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final JwtService jwtService;

    public AuthResponse register(AuthRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        User.Role role = parseRole(request.getRole());

        User existingUser = userRepository.findByEmail(email).orElse(null);
        if (existingUser != null) {
            if (existingUser.getEmailVerified()) {
                throw new RuntimeException("Email already registered");
            } else {
                existingUser.setName(request.getName());
                existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
                existingUser.setRole(role);
                userRepository.save(existingUser);
                
                otpService.generateOtp(existingUser.getEmail(), "VERIFICATION");
                
                return AuthResponse.builder()
                        .userId(existingUser.getId())
                        .name(existingUser.getName())
                        .email(existingUser.getEmail())
                        .role(existingUser.getRole().name())
                        .message("Email is already registered but not verified. A new verification OTP has been sent.")
                        .build();
            }
        }

        User user = User.builder()
                .name(request.getName())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .emailVerified(false)
                .active(true)
                .build();

        User savedUser = userRepository.save(user);

        otpService.generateOtp(savedUser.getEmail(), "VERIFICATION");

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

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.getEmailVerified()) {
            throw new RuntimeException("Please verify your email before login");
        }
        
        String jwtToken = jwtService.generateToken(user, user.getId(), user.getRole().name());

        return AuthResponse.builder()
                .token(jwtToken)
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
    
    public AuthResponse resetPassword(String email, String otp, String newPassword) {
        otpService.verifyOtp(email, otp);
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return AuthResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .message("Password reset successfully")
                .build();
    }
}
