package com.quickcourt.quickcourt_backend.controller;
import com.quickcourt.quickcourt_backend.dto.MatchRequest;
import com.quickcourt.quickcourt_backend.dto.MatchResponse;
import com.quickcourt.quickcourt_backend.service.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MatchController {
    private final MatchService matchService;

    @GetMapping
    public ResponseEntity<List<MatchResponse>> getMatches(@RequestParam Long userId) {
        return ResponseEntity.ok(matchService.getAvailableMatches(userId));
    }

    @PostMapping
    public ResponseEntity<MatchResponse> createMatch(@RequestParam Long userId, @Valid @RequestBody MatchRequest request) {
        return ResponseEntity.ok(matchService.createMatch(userId, request));
    }

    @PostMapping("/{matchId}/join")
    public ResponseEntity<MatchResponse> joinMatch(@RequestParam Long userId, @PathVariable Long matchId) {
        return ResponseEntity.ok(matchService.joinMatch(userId, matchId));
    }
    
    @PostMapping("/{matchId}/leave")
    public ResponseEntity<MatchResponse> leaveMatch(@RequestParam Long userId, @PathVariable Long matchId) {
        return ResponseEntity.ok(matchService.leaveMatch(userId, matchId));
    }
}
