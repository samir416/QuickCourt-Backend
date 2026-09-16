package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.AdminUserResponse;
import com.quickcourt.quickcourt_backend.entity.User;
import com.quickcourt.quickcourt_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserFilterService {

    private final UserRepository userRepository;

    public List<AdminUserResponse> filterUsers(
            String search,
            String role,
            String status) {

        List<User> users = userRepository.findAll();

        return users.stream()
                .filter(user -> matchesSearch(user, search))
                .filter(user -> matchesRole(user, role))
                .filter(user -> matchesStatus(user, status))
                .map(this::toResponse)
                .toList();
    }

    private boolean matchesSearch(User user, String search) {
        if (search == null || search.isBlank()) {
            return true;
        }

        String value = search.trim().toLowerCase();

        return contains(user.getName(), value)
                || contains(user.getEmail(), value);
    }

    private boolean matchesRole(User user, String role) {
        if (role == null || role.isBlank()
                || role.equalsIgnoreCase("ALL")) {
            return true;
        }

        return user.getRole() != null
                && user.getRole().name().equalsIgnoreCase(role.trim());
    }

    private boolean matchesStatus(User user, String status) {
        if (status == null || status.isBlank()
                || status.equalsIgnoreCase("ALL")) {
            return true;
        }

        boolean active = user.getActive() != null && user.getActive();

        if (status.equalsIgnoreCase("ACTIVE")) {
            return active;
        }

        if (status.equalsIgnoreCase("BANNED")
                || status.equalsIgnoreCase("INACTIVE")) {
            return !active;
        }

        return true;
    }

    private boolean contains(String value, String search) {
        return value != null
                && value.toLowerCase().contains(search);
    }

    private AdminUserResponse toResponse(User user) {
        return AdminUserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .emailVerified(user.getEmailVerified())
                .active(user.getActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}