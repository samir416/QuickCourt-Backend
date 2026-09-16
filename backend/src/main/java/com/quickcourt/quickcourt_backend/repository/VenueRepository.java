package com.quickcourt.quickcourt_backend.repository;

import com.quickcourt.quickcourt_backend.entity.Venue;
import com.quickcourt.quickcourt_backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VenueRepository extends JpaRepository<Venue, Long> {

    Page<Venue> findByApprovalStatusAndActiveTrue(
            Venue.ApprovalStatus approvalStatus,
            Pageable pageable
    );

    Page<Venue> findByNameContainingIgnoreCaseAndApprovalStatusAndActiveTrue(
            String name,
            Venue.ApprovalStatus approvalStatus,
            Pageable pageable
    );

    List<Venue> findByOwner(User owner);

    List<Venue> findByApprovalStatus(Venue.ApprovalStatus approvalStatus);
}