package com.complaint.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@RestController
@RequestMapping("/api/complaints")
public class FileUploadController {

    private static final String UPLOAD_DIR = "uploads";
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("png", "jpg", "jpeg", "pdf", "mp4", "mov", "avi", "webm", "doc", "docx");

    private final com.complaint.service.ComplaintService complaintService;

    public FileUploadController(com.complaint.service.ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping({"/upload/{complaintId}", "/{complaintId}/upload"})
    public ResponseEntity<?> uploadFileForComplaint(@PathVariable Long complaintId, @RequestParam(value = "file", required = false) MultipartFile file) {
        ResponseEntity<?> res = uploadFile(file);
        if (res.getStatusCode() == HttpStatus.OK && res.getBody() instanceof Map) {
            Map<?, ?> body = (Map<?, ?>) res.getBody();
            String url = (String) body.get("url");
            if (url != null && complaintService != null) {
                complaintService.updateImageUrl(complaintId, url);
            }
        }
        return res;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam(value = "file", required = false) MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Uploaded file is empty or missing"));
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest().body(Map.of("error", "File size exceeds maximum limit of 10MB"));
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid file format. Allowed formats: PNG, JPG, JPEG, PDF"));
        }

        try {
            Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String cleanOriginalName = (originalFilename != null ? originalFilename : "file")
                    .replaceAll("[^a-zA-Z0-9._-]", "_");
            String newFilename = UUID.randomUUID().toString() + "_" + cleanOriginalName;
            Path targetPath = uploadPath.resolve(newFilename);

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "http://localhost:8088/uploads/" + newFilename;

            Map<String, Object> response = new HashMap<>();
            response.put("url", fileUrl);
            response.put("fileName", newFilename);
            response.put("originalName", originalFilename);
            response.put("size", file.getSize());

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Could not store file: " + e.getMessage()));
        }
    }
}
