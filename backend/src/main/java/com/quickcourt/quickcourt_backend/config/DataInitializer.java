package com.quickcourt.quickcourt_backend.config;

import com.quickcourt.quickcourt_backend.entity.Court;
import com.quickcourt.quickcourt_backend.entity.Venue;
import com.quickcourt.quickcourt_backend.entity.VenuePhoto;
import com.quickcourt.quickcourt_backend.repository.CourtRepository;
import com.quickcourt.quickcourt_backend.repository.VenuePhotoRepository;
import com.quickcourt.quickcourt_backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final VenueRepository venueRepository;
    private final CourtRepository courtRepository;
    private final VenuePhotoRepository venuePhotoRepository;

    @Override
    public void run(String... args) {
        initAmenities();
        initCourts();
        initPhotos();
    }

    private void initAmenities() {
        Map<Long, String> venueAmenities = Map.of(
                1L, "Parking, Washroom, Drinking Water, Changing Room, First Aid, Pro Shop, AC",
                2L, "Parking, Washroom, Drinking Water, Lockers, Seating",
                3L, "Parking, Washroom, Floodlights, Seating, Cafe, First Aid",
                4L, "Parking, Washroom, Pro Shop, Changing Room, Floodlights",
                5L, "Parking, Washroom, Floodlights, Cafe, Seating, Lockers",
                6L, "Parking, Washroom, Pro Shop, Changing Room, Seating"
        );

        venueAmenities.forEach((id, amenities) -> {
            venueRepository.findById(id).ifPresent(venue -> {
                if (venue.getAmenities() == null || venue.getAmenities().isBlank()) {
                    venue.setAmenities(amenities);
                    venueRepository.save(venue);
                }
            });
        });
    }

    private void initCourts() {
        // SBR Badminton (Venue ID 1)
        venueRepository.findById(1L).ifPresent(venue -> {
            List<Court> existing = courtRepository.findByVenueIdAndActiveTrue(1L);
            if (existing.isEmpty()) {
                courtRepository.save(Court.builder()
                        .venue(venue)
                        .name("Court 1 (Wooden)")
                        .sport("Badminton")
                        .pricePerHour(250.0)
                        .openingTime("06:00")
                        .closingTime("23:00")
                        .active(true)
                        .build());
                courtRepository.save(Court.builder()
                        .venue(venue)
                        .name("Court 2 (Synthetic)")
                        .sport("Badminton")
                        .pricePerHour(300.0)
                        .openingTime("06:00")
                        .closingTime("23:00")
                        .active(true)
                        .build());
            }
        });

        // Ensure other venues have at least one active court
        Map<Long, String[]> venueCourtData = Map.of(
                2L, new String[]{"Court A", "Badminton", "300"},
                3L, new String[]{"Pitch 1", "Football", "600"},
                4L, new String[]{"Center Court", "Tennis", "450"},
                10L, new String[]{"Arena 1", "Badminton", "600"},
                11L, new String[]{"Court 1 (Clay)", "Tennis", "800"},
                12L, new String[]{"Court 1", "Badminton", "500"},
                13L, new String[]{"Main Ground", "Cricket", "1500"},
                14L, new String[]{"Turf A", "Football", "1200"},
                15L, new String[]{"Lane 1-4", "Swimming", "400"}
        );

        venueCourtData.forEach((venueId, data) -> {
            venueRepository.findById(venueId).ifPresent(venue -> {
                List<Court> courts = courtRepository.findByVenueIdAndActiveTrue(venueId);
                if (courts.isEmpty()) {
                    courtRepository.save(Court.builder()
                            .venue(venue)
                            .name(data[0])
                            .sport(data[1])
                            .pricePerHour(Double.parseDouble(data[2]))
                            .openingTime("06:00")
                            .closingTime("23:00")
                            .active(true)
                            .build());
                }
            });
        });
    }

    private void initPhotos() {
        addPhotoIfMissing(1L, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=85", "SBR Badminton Main Court");
        addPhotoIfMissing(1L, "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=85", "Synthetic Court Side View");
        addPhotoIfMissing(1L, "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=800&q=85", "Warmup Area & Equipment");
        addPhotoIfMissing(2L, "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=85", "Skyline Badminton Court");
        addPhotoIfMissing(3L, "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1200&q=85", "The Turf House");
        addPhotoIfMissing(4L, "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=85", "Ace Tennis Club");
        addPhotoIfMissing(5L, "https://images.unsplash.com/photo-1611251135345-18c56206b863?auto=format&fit=crop&w=1200&q=85", "Ahmedabad Turf Arena");
        addPhotoIfMissing(6L, "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?auto=format&fit=crop&w=1200&q=85", "City Tennis Hub");
    }

    private void addPhotoIfMissing(Long venueId, String imageUrl, String caption) {
        venueRepository.findById(venueId).ifPresent(venue -> {
            List<VenuePhoto> existing = venuePhotoRepository.findByVenueIdOrderByCreatedAtDesc(venueId);
            boolean alreadyHas = existing.stream().anyMatch(p -> imageUrl.equals(p.getImageUrl()));
            if (!alreadyHas) {
                venuePhotoRepository.save(VenuePhoto.builder()
                        .venue(venue)
                        .imageUrl(imageUrl)
                        .caption(caption)
                        .build());
            }
        });
    }
}
