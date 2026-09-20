package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.HomeResponse;
import com.quickcourt.quickcourt_backend.dto.VenueResponse;
import com.quickcourt.quickcourt_backend.entity.Venue;
import com.quickcourt.quickcourt_backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomeService {

    private final VenueRepository venueRepository;

    public HomeResponse getHomeData() {

        List<Venue> venues = venueRepository.findByApprovalStatus(
                Venue.ApprovalStatus.APPROVED
        ).stream().filter(v -> Boolean.TRUE.equals(v.getActive())).collect(Collectors.toList());

        List<VenueResponse> approvedVenues = venues.stream()
                .map(this::toResponse)
                .toList();

        List<VenueResponse> popularVenues = venues.stream()
                .sorted((v1, v2) -> {
                    Double rating1 = v1.getRating() == null ? 0.0 : v1.getRating();
                    Double rating2 = v2.getRating() == null ? 0.0 : v2.getRating();
                    return Double.compare(rating2, rating1);
                })
                .limit(8)
                .map(this::toResponse)
                .toList();

        Map<String, Long> sportCounts = venues.stream()
                .filter(venue -> venue.getSports() != null)
                .flatMap(venue -> Arrays.stream(venue.getSports().split(",")))
                .map(String::trim)
                .filter(sport -> !sport.isBlank())
                .collect(Collectors.groupingBy(
                        String::toLowerCase,
                        Collectors.counting()
                ));

        List<String> popularSports = sportCounts.entrySet()
                .stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(6)
                .map(Map.Entry::getKey)
                .toList();

        return HomeResponse.builder()
                .popularVenues(popularVenues)
                .popularSports(popularSports)
                .approvedVenues(approvedVenues)
                .build();
    }

    private VenueResponse toResponse(Venue venue) {
        return VenueResponse.builder()
                .id(venue.getId())
                .ownerId(
                        venue.getOwner() != null
                                ? venue.getOwner().getId()
                                : null
                )
                .ownerName(
                        venue.getOwner() != null
                                ? venue.getOwner().getName()
                                : null
                )
                .name(venue.getName())
                .description(venue.getDescription())
                .address(venue.getAddress())
                .city(venue.getCity())
                .state(venue.getState())
                .pincode(venue.getPincode())
                .venueType(venue.getVenueType())
                .sports(venue.getSports())
                .amenities(venue.getAmenities())
                .startingPrice(venue.getStartingPrice())
                .rating((venue.getTotalReviews() == null || venue.getTotalReviews() == 0) ? 0.0 : venue.getRating())
                .totalReviews(venue.getTotalReviews() == null ? 0 : venue.getTotalReviews())
                .approvalStatus(
                        venue.getApprovalStatus() != null
                                ? venue.getApprovalStatus().name()
                                : null
                )
                .approvalComment(venue.getApprovalComment())
                .active(venue.getActive())
                .build();
    }
}