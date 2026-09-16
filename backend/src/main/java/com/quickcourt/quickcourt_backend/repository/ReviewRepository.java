package com.quickcourt.quickcourt_backend.repository;

import com.quickcourt.quickcourt_backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByVenueIdOrderByCreatedAtDesc(Long venueId);

    Optional<Review> findByUserIdAndVenueId(Long userId, Long venueId);

    boolean existsByUserIdAndVenueId(Long userId, Long venueId);

    long countByVenueId(Long venueId);
}