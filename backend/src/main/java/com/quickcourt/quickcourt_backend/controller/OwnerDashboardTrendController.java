package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.dto.OwnerDashboardTrendResponse;
import com.quickcourt.quickcourt_backend.service.OwnerDashboardTrendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owner/dashboard")
@RequiredArgsConstructor
@CrossOrigin("*")
public class OwnerDashboardTrendController {

    private final OwnerDashboardTrendService ownerDashboardTrendService;

    @GetMapping("/{ownerId}/trends")
    public ResponseEntity<List<OwnerDashboardTrendResponse>> getMonthlyTrends(
            @PathVariable Long ownerId) {

        return ResponseEntity.ok(
                ownerDashboardTrendService.getMonthlyTrends(ownerId)
        );
    }
}