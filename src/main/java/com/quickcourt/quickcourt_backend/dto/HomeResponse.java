package com.quickcourt.quickcourt_backend.dto;

import com.quickcourt.quickcourt_backend.dto.VenueResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomeResponse {

    private List<VenueResponse> popularVenues;
    private List<String> popularSports;
    private List<VenueResponse> approvedVenues;
}