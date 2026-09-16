package com.quickcourt.quickcourt_backend.repository;

import com.quickcourt.quickcourt_backend.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findTopByEmailOrderByCreatedAtDesc(String email);

    void deleteByEmail(String email);
}