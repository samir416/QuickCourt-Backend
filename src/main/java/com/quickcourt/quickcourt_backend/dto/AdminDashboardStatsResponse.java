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
public class AdminDashboardStatsResponse {

    private long totalUsers;
    private long totalFacilityOwners;
    private long totalBookings;
    private long activeCourts;
    private long totalVenues;
    private long pendingVenues;
    private long approvedVenues;
    private long rejectedVenues;
    private long activeSports;
    private double totalEarnings;
}