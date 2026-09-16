package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.dto.TimeSlotRequest;
import com.quickcourt.quickcourt_backend.dto.TimeSlotResponse;
import com.quickcourt.quickcourt_backend.service.TimeSlotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/time-slots")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TimeSlotController {

    private final TimeSlotService timeSlotService;

    @PostMapping
    public ResponseEntity<TimeSlotResponse> createSlot(
            @Valid @RequestBody TimeSlotRequest request,
            @RequestParam Long ownerId) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(timeSlotService.createSlot(request, ownerId));
    }

    @GetMapping("/court/{courtId}")
    public ResponseEntity<List<TimeSlotResponse>> getSlots(
            @PathVariable Long courtId,
            @RequestParam LocalDate date) {

        return ResponseEntity.ok(
                timeSlotService.getSlots(courtId, date)
        );
    }

    @GetMapping("/court/{courtId}/available")
    public ResponseEntity<List<TimeSlotResponse>> getAvailableSlots(
            @PathVariable Long courtId,
            @RequestParam LocalDate date) {

        return ResponseEntity.ok(
                timeSlotService.getAvailableSlots(courtId, date)
        );
    }

    @PutMapping("/{slotId}/block")
    public ResponseEntity<TimeSlotResponse> blockSlot(
            @PathVariable Long slotId,
            @RequestParam String reason,
            @RequestParam Long ownerId) {

        return ResponseEntity.ok(
                timeSlotService.blockSlot(
                        slotId,
                        reason,
                        ownerId
                )
        );
    }

    @PutMapping("/{slotId}/unblock")
    public ResponseEntity<TimeSlotResponse> unblockSlot(
            @PathVariable Long slotId,
            @RequestParam Long ownerId) {

        return ResponseEntity.ok(
                timeSlotService.unblockSlot(
                        slotId,
                        ownerId
                )
        );
    }

    @DeleteMapping("/{slotId}")
    public ResponseEntity<Void> deleteSlot(
            @PathVariable Long slotId,
            @RequestParam Long ownerId) {

        timeSlotService.deleteSlot(slotId, ownerId);

        return ResponseEntity.noContent().build();
    }
}