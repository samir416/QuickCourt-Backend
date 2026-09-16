package com.quickcourt.quickcourt_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardResponse {

    private long totalUsers;
    private long totalFacilityOwners;
    private long totalBookings;
    private long confirmedBookings;
    private long cancelledBookings;
    private long completedBookings;
    private long totalVenues;
    private long pendingVenues;
    private long approvedVenues;
    private long rejectedVenues;
    private long activeCourts;
    private double totalEarnings;
}