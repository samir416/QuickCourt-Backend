package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.dto.AdminUserResponse;
import com.quickcourt.quickcourt_backend.service.AdminUserFilterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users/filter")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AdminUserFilterController {

    private final AdminUserFilterService adminUserFilterService;

    @GetMapping
    public ResponseEntity<List<AdminUserResponse>> filterUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status) {

        List<AdminUserResponse> users =
                adminUserFilterService.filterUsers(search, role, status);

        return ResponseEntity.ok(users);
    }
}