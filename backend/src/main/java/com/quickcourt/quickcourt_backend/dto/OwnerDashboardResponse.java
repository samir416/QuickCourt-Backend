package com.quickcourt.quickcourt_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OwnerDashboardResponse {

    private long totalBookings;
    private long upcomingBookings;
    private long completedBookings;
    private long cancelledBookings;
    private long activeCourts;
    private long totalVenues;
    private double totalEarnings;
    private double monthlyEarnings;
}