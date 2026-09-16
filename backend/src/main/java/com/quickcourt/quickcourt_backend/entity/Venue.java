package com.quickcourt.quickcourt_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "venues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    private String state;

    private String pincode;

    private String venueType;

    @Column(length = 1000)
    private String sports;

    @Column(length = 1000)
    private String amenities;

    private String startingPrice;

    private Double rating;

    private Integer totalReviews;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    @Column(length = 1000)
    private String approvalComment;

    private Boolean active = true;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (approvalStatus == null) {
            approvalStatus = ApprovalStatus.PENDING;
        }

        if (active == null) {
            active = true;
        }

        if (rating == null) {
            rating = 0.0;
        }

        if (totalReviews == null) {
            totalReviews = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ApprovalStatus {
        PENDING,
        APPROVED,
        REJECTED
    }
}