package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.ProfileResponse;
import com.quickcourt.quickcourt_backend.dto.ProfileUpdateRequest;
import com.quickcourt.quickcourt_backend.entity.User;
import com.quickcourt.quickcourt_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfileService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(Long userId) {
        User user = getUser(userId);
        return mapToResponse(user);
    }

    public ProfileResponse updateProfile(
            Long userId,
            ProfileUpdateRequest request) {

        User user = getUser(userId);

        String email = request.getEmail().toLowerCase().trim();

        userRepository.findByEmail(email)
                .filter(existingUser -> !existingUser.getId().equals(userId))
                .ifPresent(existingUser -> {
                    throw new RuntimeException("Email is already in use");
                });

        if (!user.getEmail().equalsIgnoreCase(email)) {
            user.setEmailVerified(false);
        }

        user.setName(request.getName().trim());
        user.setEmail(email);

        return mapToResponse(userRepository.save(user));
    }

    private User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private ProfileResponse mapToResponse(User user) {
        return ProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .emailVerified(user.getEmailVerified())
                .active(user.getActive())
                .build();
    }
}