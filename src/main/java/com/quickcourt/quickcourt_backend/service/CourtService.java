package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.CourtRequest;
import com.quickcourt.quickcourt_backend.dto.CourtResponse;
import com.quickcourt.quickcourt_backend.entity.Court;
import com.quickcourt.quickcourt_backend.entity.User;
import com.quickcourt.quickcourt_backend.entity.Venue;
import com.quickcourt.quickcourt_backend.repository.CourtRepository;
import com.quickcourt.quickcourt_backend.repository.UserRepository;
import com.quickcourt.quickcourt_backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CourtService {

    private final CourtRepository courtRepository;
    private final VenueRepository venueRepository;
    private final UserRepository userRepository;

    public CourtResponse createCourt(CourtRequest request, Long ownerId) {
        User owner = getOwner(ownerId);

        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        validateVenueOwner(venue, owner);

        Court court = Court.builder()
                .venue(venue)
                .name(request.getName())
                .sport(request.getSport())
                .pricePerHour(request.getPricePerHour())
                .openingTime(request.getOpeningTime())
                .closingTime(request.getClosingTime())
                .active(true)
                .build();

        return mapToResponse(courtRepository.save(court));
    }

    public List<CourtResponse> getCourtsByVenue(Long venueId) {
        return courtRepository.findByVenueIdAndActiveTrue(venueId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public CourtResponse getCourt(Long id) {
        Court court = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Court not found"));

        return mapToResponse(court);
    }

    public CourtResponse updateCourt(Long id, CourtRequest request, Long ownerId) {
        User owner = getOwner(ownerId);

        Court court = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Court not found"));

        validateVenueOwner(court.getVenue(), owner);

        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        validateVenueOwner(venue, owner);

        court.setVenue(venue);
        court.setName(request.getName());
        court.setSport(request.getSport());
        court.setPricePerHour(request.getPricePerHour());
        court.setOpeningTime(request.getOpeningTime());
        court.setClosingTime(request.getClosingTime());

        return mapToResponse(courtRepository.save(court));
    }

    public void deleteCourt(Long id, Long ownerId) {
        User owner = getOwner(ownerId);

        Court court = courtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Court not found"));

        validateVenueOwner(court.getVenue(), owner);

        court.setActive(false);
        courtRepository.save(court);
    }

    private User getOwner(Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        if (owner.getRole() != User.Role.FACILITY_OWNER) {
            throw new RuntimeException("Only facility owners can manage courts");
        }

        return owner;
    }

    private void validateVenueOwner(Venue venue, User owner) {
        if (!venue.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException("You are not authorized to manage this venue");
        }
    }

    private CourtResponse mapToResponse(Court court) {
        return CourtResponse.builder()
                .id(court.getId())
                .venueId(court.getVenue().getId())
                .venueName(court.getVenue().getName())
                .name(court.getName())
                .sport(court.getSport())
                .pricePerHour(court.getPricePerHour())
                .openingTime(court.getOpeningTime())
                .closingTime(court.getClosingTime())
                .active(court.getActive())
                .build();
    }
}