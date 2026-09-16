package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.dto.AdminDashboardTrendResponse;
import com.quickcourt.quickcourt_backend.dto.AdminFacilityApprovalTrendResponse;
import com.quickcourt.quickcourt_backend.dto.AdminMostActiveSportResponse;
import com.quickcourt.quickcourt_backend.service.AdminDashboardTrendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AdminDashboardTrendController {

    private final AdminDashboardTrendService adminDashboardTrendService;

    @GetMapping("/trends")
    public ResponseEntity<List<AdminDashboardTrendResponse>> getMonthlyTrends() {
        return ResponseEntity.ok(
                adminDashboardTrendService.getMonthlyTrends()
        );
    }

    @GetMapping("/approval-trend")
    public ResponseEntity<List<AdminFacilityApprovalTrendResponse>> getFacilityApprovalTrend() {
        return ResponseEntity.ok(
                adminDashboardTrendService.getFacilityApprovalTrend()
        );
    }

    @GetMapping("/most-active-sports")
    public ResponseEntity<List<AdminMostActiveSportResponse>> getMostActiveSports() {
        return ResponseEntity.ok(
                adminDashboardTrendService.getMostActiveSports()
        );
    }
}