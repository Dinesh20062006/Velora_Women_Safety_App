package com.complaint.controller;

import java.util.List;
import java.util.Map;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.complaint.dto.ComplaintRequest;
import com.complaint.entity.Complaint;
import com.complaint.security.UserPrincipal;
import com.complaint.service.ComplaintService;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    // Create Complaint - automatically injects logged-in user details from JWT
    @PostMapping
    public ResponseEntity<Complaint> createComplaint(
            @RequestBody(required = false) ComplaintRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        if (request == null) {
            request = new ComplaintRequest();
        }
        System.out.println("CREATE COMPLAINT API HIT: title=" + request.getTitle());
        if (principal != null) {
            if (principal.getUserId() != null) {
                request.setUserId(principal.getUserId());
            }
            if (principal.getName() != null && !principal.getName().isBlank()) {
                request.setUserName(principal.getName());
            }
            if (principal.getUsername() != null && !principal.getUsername().isBlank()) {
                request.setPhoneNumber(principal.getUsername());
            }
        }
        Complaint complaint = complaintService.saveComplaint(request);
        System.out.println("COMPLAINT CREATED WITH ID: " + (complaint != null ? complaint.getComplaintId() : "null"));
        return ResponseEntity.status(HttpStatus.CREATED).body(complaint);
    }

    // Live Dashboard Statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAnalyticsStats() {
        return ResponseEntity.ok(complaintService.getAnalyticsStats());
    }

    // Get All Complaints - Police / Manager / Admin
    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    // Get Complaint By ID
    @GetMapping("/{id}")
    public ResponseEntity<Complaint> getComplaint(@PathVariable Long id) {
        Complaint complaint = complaintService.getComplaint(id);
        if (complaint == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(complaint);
    }

    // Get Complaints By User ID - Normal user can only view their own complaints
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Complaint>> getComplaintsByUserId(
            @PathVariable Long userId,
            @AuthenticationPrincipal UserPrincipal principal) {

        if (principal != null && !"MANAGER".equalsIgnoreCase(principal.getRole()) && !"ADMIN".equalsIgnoreCase(principal.getRole())) {
            if (principal.getUserId() != null && !principal.getUserId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        return ResponseEntity.ok(complaintService.getComplaintsByUserId(userId));
    }

    // Update Status - Police / Manager / Admin
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().body("Status is required");
        }
        Complaint updated = complaintService.updateStatus(id, status);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    // Assign Police Officer - Police / Manager / Admin
    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignOfficer(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Object officerIdObj = body.get("assignedOfficerId") != null 
            ? body.get("assignedOfficerId") 
            : (body.get("assignedOfficer") != null ? body.get("assignedOfficer") : body.get("officerId"));

        String officerStr = officerIdObj != null ? officerIdObj.toString() : (String) body.get("officerName");
        String station = body.get("assignedStation") != null ? body.get("assignedStation").toString() : "Central Police Station";

        if (officerStr == null || officerStr.isBlank()) {
            return ResponseEntity.badRequest().body("Officer ID is required");
        }

        Complaint updated = complaintService.assignOfficer(id, officerStr, station);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    // Update Full Case Investigation Details - Police / Manager / Admin
    @PutMapping("/{id}/investigation")
    public ResponseEntity<?> updateInvestigation(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        String status = body.get("status");
        String assignedOfficer = body.get("assignedOfficer");
        String assignedStation = body.get("assignedStation");
        String investigationNotes = body.get("investigationNotes");
        String closingRemarks = body.get("closingRemarks");
        
        String updatedBy = (principal != null && principal.getName() != null && !principal.getName().isBlank())
                ? principal.getName()
                : (body.get("updatedBy") != null ? body.get("updatedBy") : "Police Officer");

        Complaint updated = complaintService.updateInvestigationDetails(
                id, status, assignedOfficer, assignedStation, investigationNotes, closingRemarks, updatedBy
        );

        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

}