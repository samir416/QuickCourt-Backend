package com.quickcourt.quickcourt_backend.service;

import com.quickcourt.quickcourt_backend.dto.ReviewRequest;
import com.quickcourt.quickcourt_backend.dto.ReviewResponse;
import com.quickcourt.quickcourt_backend.entity.Review;
import com.quickcourt.quickcourt_backend.entity.User;
import com.quickcourt.quickcourt_backend.entity.Venue;
import com.quickcourt.quickcourt_backend.repository.ReviewRepository;
import com.quickcourt.quickcourt_backend.repository.UserRepository;
import com.quickcourt.quickcourt_backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final VenueRepository venueRepository;

    public ReviewResponse createReview(ReviewRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Venue venue = venueRepository.findById(request.getVenueId())
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new RuntimeException("User account is inactive");
        }

        if (reviewRepository.existsByUserIdAndVenueId(
                request.getUserId(),
                request.getVenueId())) {
            throw new RuntimeException("You have already reviewed this venue");
        }

        Review review = Review.builder()
                .user(user)
                .venue(venue)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        Review savedReview = reviewRepository.save(review);

        updateVenueRating(venue);

        return mapToResponse(savedReview);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getVenueReviews(Long venueId) {
        if (!venueRepository.existsById(venueId)) {
            throw new RuntimeException("Venue not found");
        }

        return reviewRepository.findByVenueIdOrderByCreatedAtDesc(venueId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ReviewResponse updateReview(
            Long reviewId,
            ReviewRequest request) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(request.getUserId())) {
            throw new RuntimeException("You are not authorized to update this review");
        }

        if (!review.getVenue().getId().equals(request.getVenueId())) {
            throw new RuntimeException("Venue cannot be changed");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review updatedReview = reviewRepository.save(review);

        updateVenueRating(review.getVenue());

        return mapToResponse(updatedReview);
    }

    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not authorized to delete this review");
        }

        Venue venue = review.getVenue();

        reviewRepository.delete(review);

        updateVenueRating(venue);
    }

    private void updateVenueRating(Venue venue) {
        List<Review> reviews = reviewRepository
                .findByVenueIdOrderByCreatedAtDesc(venue.getId());

        double averageRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        venue.setRating(Math.round(averageRating * 10.0) / 10.0);
        venue.setTotalReviews(reviews.size());

        venueRepository.save(venue);
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getName())
                .venueId(review.getVenue().getId())
                .venueName(review.getVenue().getName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}