package com.quickcourt.quickcourt_backend.repository;

import com.quickcourt.quickcourt_backend.entity.VenuePhoto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VenuePhotoRepository extends JpaRepository<VenuePhoto, Long> {

    List<VenuePhoto> findByVenueIdOrderByCreatedAtDesc(Long venueId);

    void deleteByVenueId(Long venueId);
}