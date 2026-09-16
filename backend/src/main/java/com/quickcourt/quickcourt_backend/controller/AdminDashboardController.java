package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.dto.AdminDashboardResponse;
import com.quickcourt.quickcourt_backend.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping
    public ResponseEntity<AdminDashboardResponse> getDashboard(
            @RequestParam Long adminId) {

        return ResponseEntity.ok(
                adminDashboardService.getDashboard(adminId)
        );
    }
}