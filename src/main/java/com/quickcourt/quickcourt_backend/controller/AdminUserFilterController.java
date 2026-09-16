package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.entity.User;
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
    public ResponseEntity<List<User>> filterUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status) {

        return ResponseEntity.ok(
                adminUserFilterService.filterUsers(
                        search,
                        role,
                        status
                )
        );
    }
}