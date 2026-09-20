package com.quickcourt.quickcourt_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VenueResponse {

    private java.util.List<String> photos;

    private Long id;
    private Long ownerId;
    private String ownerName;
    private String name;
    private String description;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String venueType;
    private String sports;
    private String amenities;
    private String startingPrice;
    private Double rating;
    private Integer totalReviews;
    private String approvalStatus;
    private String approvalComment;
    private Boolean active;
}