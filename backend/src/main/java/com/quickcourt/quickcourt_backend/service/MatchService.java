package com.quickcourt.quickcourt_backend.service;
import com.quickcourt.quickcourt_backend.dto.MatchRequest;
import com.quickcourt.quickcourt_backend.dto.MatchResponse;
import com.quickcourt.quickcourt_backend.entity.Match;
import com.quickcourt.quickcourt_backend.entity.User;
import com.quickcourt.quickcourt_backend.repository.MatchRepository;
import com.quickcourt.quickcourt_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MatchService {
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    public MatchResponse createMatch(Long userId, MatchRequest request) {
        User creator = userRepository.findById(userId).orElseThrow();
        Match match = Match.builder()
            .title(request.getTitle())
            .sport(request.getSport())
            .location(request.getLocation())
            .matchTime(LocalDateTime.parse(request.getMatchTime(), DateTimeFormatter.ISO_DATE_TIME))
            .maxPlayers(request.getMaxPlayers())
            .creator(creator)
            .build();
        match.getParticipants().add(creator);
        return mapToResponse(matchRepository.save(match), userId);
    }

    public List<MatchResponse> getAvailableMatches(Long userId) {
        return matchRepository.findByMatchTimeAfterOrderByMatchTimeAsc(LocalDateTime.now().minusHours(1))
            .stream().map(m -> mapToResponse(m, userId)).collect(Collectors.toList());
    }

    public MatchResponse joinMatch(Long userId, Long matchId) {
        User user = userRepository.findById(userId).orElseThrow();
        Match match = matchRepository.findById(matchId).orElseThrow();
        if (match.getParticipants().size() >= match.getMaxPlayers()) {
            throw new RuntimeException("Match is full");
        }
        match.getParticipants().add(user);
        return mapToResponse(matchRepository.save(match), userId);
    }
    
    public MatchResponse leaveMatch(Long userId, Long matchId) {
        User user = userRepository.findById(userId).orElseThrow();
        Match match = matchRepository.findById(matchId).orElseThrow();
        match.getParticipants().remove(user);
        return mapToResponse(matchRepository.save(match), userId);
    }

    private MatchResponse mapToResponse(Match match, Long userId) {
        boolean isPart = match.getParticipants().stream().anyMatch(p -> p.getId().equals(userId));
        return MatchResponse.builder()
            .id(match.getId())
            .title(match.getTitle())
            .sport(match.getSport())
            .location(match.getLocation())
            .matchTime(match.getMatchTime().toString())
            .maxPlayers(match.getMaxPlayers())
            .currentPlayers(match.getParticipants().size())
            .creatorName(match.getCreator().getName())
            .isParticipant(isPart)
            .build();
    }
}
