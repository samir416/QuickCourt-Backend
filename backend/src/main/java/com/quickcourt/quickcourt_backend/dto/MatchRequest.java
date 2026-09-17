package com.quickcourt.quickcourt_backend.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MatchRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String sport;
    @NotBlank
    private String location;
    @NotBlank
    private String matchTime; // ISO Date string
    @NotNull
    private Integer maxPlayers;
}
