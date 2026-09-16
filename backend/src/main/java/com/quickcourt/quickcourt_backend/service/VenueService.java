package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.VenueRequest;
import com.quickcourt.quickcourt_backend.dto.VenueResponse;
import com.quickcourt.quickcourt_backend.entity.User;
import com.quickcourt.quickcourt_backend.entity.Venue;
import com.quickcourt.quickcourt_backend.repository.UserRepository;
import com.quickcourt.quickcourt_backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VenueService {

    private final VenueRepository venueRepository;
    private final UserRepository userRepository;

    public VenueResponse createVenue(VenueRequest request, Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        if (owner.getRole() != User.Role.FACILITY_OWNER) {
            throw new RuntimeException("Only facility owners can create venues");
        }

        Venue venue = Venue.builder()
                .owner(owner)
                .name(request.getName())
                .description(request.getDescription())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .venueType(request.getVenueType())
                .sports(request.getSports())
                .amenities(request.getAmenities())
                .startingPrice(request.getStartingPrice())
                .rating(0.0)
                .totalReviews(0)
                .approvalStatus(Venue.ApprovalStatus.PENDING)
                .active(true)
                .build();

        return mapToResponse(venueRepository.save(venue));
    }

    public VenueResponse getVenue(Long id) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        return mapToResponse(venue);
    }

    public Page<VenueResponse> getApprovedVenues(Pageable pageable) {
        return venueRepository
                .findByApprovalStatusAndActiveTrue(
                        Venue.ApprovalStatus.APPROVED,
                        pageable
                )
                .map(this::mapToResponse);
    }

    public Page<VenueResponse> searchVenues(String name, Pageable pageable) {
        return venueRepository
                .findByNameContainingIgnoreCaseAndApprovalStatusAndActiveTrue(
                        name,
                        Venue.ApprovalStatus.APPROVED,
                        pageable
                )
                .map(this::mapToResponse);
    }

    public VenueResponse updateVenue(Long id, VenueRequest request, Long ownerId) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        if (!venue.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("You are not authorized to update this venue");
        }

        venue.setName(request.getName());
        venue.setDescription(request.getDescription());
        venue.setAddress(request.getAddress());
        venue.setCity(request.getCity());
        venue.setState(request.getState());
        venue.setPincode(request.getPincode());
        venue.setVenueType(request.getVenueType());
        venue.setSports(request.getSports());
        venue.setAmenities(request.getAmenities());
        venue.setStartingPrice(request.getStartingPrice());
        venue.setApprovalStatus(Venue.ApprovalStatus.PENDING);
        venue.setApprovalComment(null);

        return mapToResponse(venueRepository.save(venue));
    }

    public void deleteVenue(Long id, Long ownerId) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        if (!venue.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("You are not authorized to delete this venue");
        }

        venue.setActive(false);
        venueRepository.save(venue);
    }

    private VenueResponse mapToResponse(Venue venue) {
        User owner = venue.getOwner();

        return VenueResponse.builder()
                .id(venue.getId())
                .ownerId(owner.getId())
                .ownerName(owner.getName())
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
                .totalReviews(venue.getTotalReviews())
                .approvalStatus(venue.getApprovalStatus().name())
                .approvalComment(venue.getApprovalComment())
                .active(venue.getActive())
                .build();
    }
}