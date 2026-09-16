package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.VenuePhotoRequest;
import com.quickcourt.quickcourt_backend.dto.VenuePhotoResponse;
import com.quickcourt.quickcourt_backend.entity.User;
import com.quickcourt.quickcourt_backend.entity.Venue;
import com.quickcourt.quickcourt_backend.entity.VenuePhoto;
import com.quickcourt.quickcourt_backend.repository.UserRepository;
import com.quickcourt.quickcourt_backend.repository.VenuePhotoRepository;
import com.quickcourt.quickcourt_backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class VenuePhotoService {

    private final VenuePhotoRepository venuePhotoRepository;
    private final VenueRepository venueRepository;
    private final UserRepository userRepository;

    public VenuePhotoResponse addPhoto(
            VenuePhotoRequest request,
            Long ownerId) {

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        if (owner.getRole() != User.Role.FACILITY_OWNER) {
            throw new RuntimeException("Only facility owners can manage venue photos");
        }

        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        validateOwner(venue, owner);

        VenuePhoto photo = VenuePhoto.builder()
                .venue(venue)
                .imageUrl(request.getImageUrl())
                .caption(request.getCaption())
                .build();

        return mapToResponse(venuePhotoRepository.save(photo));
    }

    @Transactional(readOnly = true)
    public List<VenuePhotoResponse> getVenuePhotos(Long venueId) {
        if (!venueRepository.existsById(venueId)) {
            throw new RuntimeException("Venue not found");
        }

        return venuePhotoRepository
                .findByVenueIdOrderByCreatedAtDesc(venueId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public void deletePhoto(Long photoId, Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Owner not found"));

        VenuePhoto photo = venuePhotoRepository.findById(photoId)
                .orElseThrow(() -> new RuntimeException("Venue photo not found"));

        validateOwner(photo.getVenue(), owner);

        venuePhotoRepository.delete(photo);
    }

    private void validateOwner(Venue venue, User owner) {
        if (!venue.getOwner().getId().equals(owner.getId())) {
            throw new RuntimeException(
                    "You are not authorized to manage this venue"
            );
        }
    }

    private VenuePhotoResponse mapToResponse(VenuePhoto photo) {
        return VenuePhotoResponse.builder()
                .id(photo.getId())
                .venueId(photo.getVenue().getId())
                .imageUrl(photo.getImageUrl())
                .caption(photo.getCaption())
                .createdAt(photo.getCreatedAt())
                .build();
    }
}