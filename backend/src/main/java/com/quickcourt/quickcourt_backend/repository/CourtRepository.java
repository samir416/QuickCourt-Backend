package com.quickcourt.quickcourt_backend.repository;

import com.quickcourt.quickcourt_backend.entity.Court;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourtRepository extends JpaRepository<Court, Long> {

    List<Court> findByVenueIdAndActiveTrue(Long venueId);

    List<Court> findByVenueId(Long venueId);

    List<Court> findBySportIgnoreCaseAndActiveTrue(String sport);
}