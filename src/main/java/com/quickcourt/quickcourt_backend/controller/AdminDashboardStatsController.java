package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.dto.AdminDashboardStatsResponse;
import com.quickcourt.quickcourt_backend.service.AdminDashboardStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AdminDashboardStatsController {

    private final AdminDashboardStatsService adminDashboardStatsService;

    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStatsResponse> getStats() {
        return ResponseEntity.ok(
                adminDashboardStatsService.getStats()
        );
    }
}