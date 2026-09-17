package com.quickcourt.quickcourt_backend.controller;

import com.quickcourt.quickcourt_backend.dto.VenuePhotoRequest;
import com.quickcourt.quickcourt_backend.dto.VenuePhotoResponse;
import com.quickcourt.quickcourt_backend.service.VenuePhotoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/venue-photos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VenuePhotoController {

    private final VenuePhotoService venuePhotoService;
    private final Path uploadDir = Paths.get("uploads");

    @PostMapping
    public ResponseEntity<VenuePhotoResponse> addPhoto(
            @Valid @RequestBody VenuePhotoRequest request,
            @RequestParam Long ownerId) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(venuePhotoService.addPhoto(request, ownerId));
    }
    
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<VenuePhotoResponse>> uploadPhotos(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("venueId") Long venueId,
            @RequestParam("ownerId") Long ownerId) {
        
        try {
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            List<VenuePhotoResponse> responses = new ArrayList<>();
            for (MultipartFile file : files) {
                String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                Path filePath = uploadDir.resolve(filename);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                
                String imageUrl = "/api/venue-photos/files/" + filename;
                VenuePhotoRequest req = new VenuePhotoRequest();
                req.setVenueId(venueId);
                req.setImageUrl(imageUrl);
                req.setCaption(file.getOriginalFilename());
                
                responses.add(venuePhotoService.addPhoto(req, ownerId));
            }
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/files/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path file = uploadDir.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/venue/{venueId}")
    public ResponseEntity<List<VenuePhotoResponse>> getVenuePhotos(
            @PathVariable Long venueId) {

        return ResponseEntity.ok(
                venuePhotoService.getVenuePhotos(venueId)
        );
    }

    @DeleteMapping("/{photoId}")
    public ResponseEntity<Void> deletePhoto(
            @PathVariable Long photoId,
            @RequestParam Long ownerId) {

        venuePhotoService.deletePhoto(photoId, ownerId);

        return ResponseEntity.noContent().build();
    }
}
