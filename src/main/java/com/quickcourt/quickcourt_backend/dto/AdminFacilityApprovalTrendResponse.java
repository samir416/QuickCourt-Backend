package com.quickcourt.quickcourt_backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminFacilityApprovalTrendResponse {

    private String period;
    private long pending;
    private long approved;
    private long rejected;
}