package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.dto.OwnerDashboardResponse;
import com.quickcourt.quickcourt_backend.service.OwnerDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/owner/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OwnerDashboardController {

    private final OwnerDashboardService ownerDashboardService;

    @GetMapping
    public ResponseEntity<OwnerDashboardResponse> getDashboard(
            @RequestParam Long ownerId) {

        return ResponseEntity.ok(
                ownerDashboardService.getDashboard(ownerId)
        );
    }
}