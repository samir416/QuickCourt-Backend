package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.VenueResponse;
import com.quickcourt.quickcourt_backend.entity.Venue;
import com.quickcourt.quickcourt_backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VenueFilterService {

    private final VenueRepository venueRepository;

    public Page<VenueResponse> filterVenues(
            String search,
            String sport,
            Double minPrice,
            Double maxPrice,
            String venueType,
            Double minRating,
            int page,
            int size) {

        List<Venue> venues = venueRepository.findByApprovalStatus(
                Venue.ApprovalStatus.APPROVED
        );

        List<VenueResponse> filtered = venues.stream()
                .filter(venue -> matchesSearch(venue, search))
                .filter(venue -> matchesSport(venue, sport))
                .filter(venue -> matchesPrice(venue, minPrice, maxPrice))
                .filter(venue -> matchesVenueType(venue, venueType))
                .filter(venue -> matchesRating(venue, minRating))
                .map(this::toResponse)
                .toList();

        int start = Math.min(page * size, filtered.size());
        int end = Math.min(start + size, filtered.size());

        List<VenueResponse> content = filtered.subList(start, end);

        return new PageImpl<>(
                content,
                PageRequest.of(page, size),
                filtered.size()
        );
    }

    private boolean matchesSearch(Venue venue, String search) {
        if (search == null || search.isBlank()) {
            return true;
        }

        String value = search.toLowerCase();

        return contains(venue.getName(), value)
                || contains(venue.getDescription(), value)
                || contains(venue.getAddress(), value)
                || contains(venue.getCity(), value)
                || contains(venue.getState(), value)
                || contains(venue.getPincode(), value);
    }

    private boolean matchesSport(Venue venue, String sport) {
        if (sport == null || sport.isBlank()) {
            return true;
        }

        if (venue.getSports() == null || venue.getSports().isBlank()) {
            return false;
        }

        return List.of(venue.getSports().split(","))
                .stream()
                .map(String::trim)
                .anyMatch(value ->
                        value.equalsIgnoreCase(sport.trim())
                );
    }

    private boolean matchesPrice(
            Venue venue,
            Double minPrice,
            Double maxPrice) {

        if (minPrice == null && maxPrice == null) {
            return true;
        }

        Double price = parsePrice(venue.getStartingPrice());

        if (price == null) {
            return false;
        }

        if (minPrice != null && price < minPrice) {
            return false;
        }

        if (maxPrice != null && price > maxPrice) {
            return false;
        }

        return true;
    }

    private boolean matchesVenueType(
            Venue venue,
            String venueType) {

        if (venueType == null || venueType.isBlank()) {
            return true;
        }

        return venue.getVenueType() != null
                && venue.getVenueType()
                .equalsIgnoreCase(venueType.trim());
    }

    private boolean matchesRating(
            Venue venue,
            Double minRating) {

        if (minRating == null) {
            return true;
        }

        return venue.getRating() != null
                && venue.getRating() >= minRating;
    }

    private Double parsePrice(String price) {
        if (price == null || price.isBlank()) {
            return null;
        }

        try {
            String cleaned = price.replaceAll("[^0-9.]", "");

            if (cleaned.isBlank()) {
                return null;
            }

            return Double.parseDouble(cleaned);
        } catch (NumberFormatException exception) {
            return null;
        }
    }

    private boolean contains(String value, String search) {
        return value != null
                && value.toLowerCase().contains(search);
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
                .rating(venue.getRating())
                .totalReviews(0)
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