package com.quickcourt.quickcourt_backend.dto;
import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchResponse {
    private Long id;
    private String title;
    private String sport;
    private String location;
    private String matchTime;
    private int maxPlayers;
    private int currentPlayers;
    private String creatorName;
    private boolean isParticipant;
}
