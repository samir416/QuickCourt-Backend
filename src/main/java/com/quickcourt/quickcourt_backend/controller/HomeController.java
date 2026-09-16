package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.dto.HomeResponse;
import com.quickcourt.quickcourt_backend.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
@CrossOrigin("*")
public class HomeController {

    private final HomeService homeService;

    @GetMapping
    public ResponseEntity<HomeResponse> getHomeData() {
        return ResponseEntity.ok(homeService.getHomeData());
    }
}