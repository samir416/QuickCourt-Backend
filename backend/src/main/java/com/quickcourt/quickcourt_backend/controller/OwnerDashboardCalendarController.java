package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.dto.OwnerDashboardCalendarResponse;
import com.quickcourt.quickcourt_backend.service.OwnerDashboardCalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/owner/dashboard")
@RequiredArgsConstructor
@CrossOrigin("*")
public class OwnerDashboardCalendarController {

    private final OwnerDashboardCalendarService ownerDashboardCalendarService;

    @GetMapping("/{ownerId}/calendar")
    public ResponseEntity<List<OwnerDashboardCalendarResponse>> getCalendar(
            @PathVariable Long ownerId,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate) {

        return ResponseEntity.ok(
                ownerDashboardCalendarService.getCalendar(
                        ownerId,
                        startDate,
                        endDate
                )
        );
    }
}