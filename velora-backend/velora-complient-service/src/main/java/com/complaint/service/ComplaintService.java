package com.complaint.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.complaint.dto.ComplaintRequest;
import com.complaint.entity.Complaint;
import com.complaint.entity.Notification;
import com.complaint.repository.ComplaintRepository;
import com.complaint.repository.NotificationRepository;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final NotificationRepository notificationRepository;

    public ComplaintService(ComplaintRepository complaintRepository, NotificationRepository notificationRepository) {
        this.complaintRepository = complaintRepository;
        this.notificationRepository = notificationRepository;
    }

    // Save Complaint
    public Complaint saveComplaint(ComplaintRequest request) {
        System.out.println("SAVING COMPLAINT TO DB: title=" + (request != null ? request.getTitle() : "null"));
        Complaint complaint = new Complaint();

        if (request != null) {
            complaint.setUserId(request.getUserId() != null ? request.getUserId() : 1L);
            complaint.setUserName(request.getUserName() != null ? request.getUserName() : "User");
            complaint.setPhoneNumber(request.getPhoneNumber());

            complaint.setTitle(request.getTitle() != null && !request.getTitle().isBlank() ? request.getTitle() : "Reported Incident");
            complaint.setDescription(request.getDescription() != null && !request.getDescription().isBlank() ? request.getDescription() : "No description provided");
            complaint.setCategory(request.getCategory() != null && !request.getCategory().isBlank() ? request.getCategory() : "General Incident");
            complaint.setLocation(request.getLocation() != null && !request.getLocation().isBlank() ? request.getLocation() : "Location not provided");
            complaint.setImageUrl(request.getImageUrl());
        } else {
            complaint.setUserId(1L);
            complaint.setTitle("Reported Incident");
            complaint.setDescription("No description provided");
            complaint.setCategory("General Incident");
            complaint.setLocation("Location not provided");
        }

        Complaint saved = complaintRepository.saveAndFlush(complaint);
        System.out.println("SUCCESSFULLY SAVED COMPLAINT TO DB WITH ID: " + saved.getComplaintId());

        // Auto-create confirmation notification for the user safely
        if (saved.getUserId() != null) {
            try {
                notificationRepository.save(new Notification(
                        saved.getUserId(),
                        "Complaint Submitted Successfully",
                        "Your complaint #" + saved.getComplaintId() + " (" + saved.getTitle() + ") has been submitted.",
                        "STATUS_UPDATE"
                ));
            } catch (Exception e) {
                System.err.println("Non-critical notification save failed: " + e.getMessage());
            }
        }

        return saved;
    }

    // Get All Complaints
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    // Get Complaint by Id
    public Complaint getComplaint(Long id) {
        return complaintRepository.findById(id).orElse(null);
    }

    // Get User Complaints
    public List<Complaint> getComplaintsByUserId(Long userId) {
        return complaintRepository.findByUserId(userId);
    }

    // Update Image URL
    public Complaint updateImageUrl(Long id, String imageUrl) {
        Complaint complaint = complaintRepository.findById(id).orElse(null);
        if (complaint == null) {
            return null;
        }
        complaint.setImageUrl(imageUrl);
        return complaintRepository.saveAndFlush(complaint);
    }

    // Update Status
    public Complaint updateStatus(Long id, String status) {
        Complaint complaint = complaintRepository.findById(id).orElse(null);
        if (complaint == null) {
            return null;
        }
        complaint.setStatus(status);
        Complaint saved = complaintRepository.saveAndFlush(complaint);

        // Auto-create notification for user safely
        if (saved.getUserId() != null) {
            try {
                notificationRepository.save(new Notification(
                        saved.getUserId(),
                        "Complaint Status Updated",
                        "Your complaint #" + saved.getComplaintId() + " status is now: " + status,
                        "STATUS_UPDATE"
                ));
            } catch (Exception e) {
                System.err.println("Non-critical notification save failed: " + e.getMessage());
            }
        }

        return saved;
    }

    // Assign Police Officer
    public Complaint assignOfficer(Long id, String officerStr, String station) {
        Complaint complaint = complaintRepository.findById(id).orElse(null);
        if (complaint == null) {
            return null;
        }
        complaint.setAssignedOfficer(officerStr);
        try {
            complaint.setAssignedOfficerId(Long.parseLong(officerStr));
        } catch (Exception e) {}
        if (station != null && !station.isBlank()) {
            complaint.setAssignedStation(station);
        }
        if ("PENDING".equalsIgnoreCase(complaint.getStatus())) {
            complaint.setStatus("ASSIGNED");
        }
        Complaint saved = complaintRepository.saveAndFlush(complaint);

        // Auto-create notification for user safely
        if (saved.getUserId() != null) {
            try {
                notificationRepository.save(new Notification(
                        saved.getUserId(),
                        "Officer Assigned to Complaint",
                        "Officer " + officerStr + " has been assigned to your complaint #" + saved.getComplaintId(),
                        "STATUS_UPDATE"
                ));
            } catch (Exception e) {
                System.err.println("Non-critical notification save failed: " + e.getMessage());
            }
        }

        return saved;
    }

    public Complaint assignOfficer(Long id, Long officerId, String station) {
        return assignOfficer(id, String.valueOf(officerId), station);
    }

    // Update Full Case Investigation Details
    public Complaint updateInvestigationDetails(Long id, String status, String assignedOfficer, String assignedStation, String investigationNotes, String closingRemarks, String updatedBy) {
        Complaint complaint = complaintRepository.findById(id).orElse(null);
        if (complaint == null) {
            return null;
        }

        if (status != null && !status.isBlank()) {
            complaint.setStatus(status);
        }
        if (assignedOfficer != null) {
            complaint.setAssignedOfficer(assignedOfficer);
        }
        if (assignedStation != null) {
            complaint.setAssignedStation(assignedStation);
        }
        if (investigationNotes != null) {
            complaint.setInvestigationNotes(investigationNotes);
        }
        if (closingRemarks != null) {
            complaint.setClosingRemarks(closingRemarks);
        }
        if (updatedBy != null && !updatedBy.isBlank()) {
            complaint.setUpdatedBy(updatedBy);
        }

        Complaint saved = complaintRepository.saveAndFlush(complaint);

        // Auto-create notification for user safely
        if (saved.getUserId() != null) {
            try {
                String msg = "Your complaint #" + saved.getComplaintId() + " status is now: " + saved.getStatus();
                if (saved.getAssignedOfficer() != null) {
                    msg += " (Assigned to: " + saved.getAssignedOfficer() + ")";
                }
                notificationRepository.save(new Notification(
                        saved.getUserId(),
                        "Complaint Investigation Updated",
                        msg,
                        "STATUS_UPDATE"
                ));
            } catch (Exception e) {
                System.err.println("Non-critical notification save failed: " + e.getMessage());
            }
        }

        return saved;
    }

    // Live Dashboard Statistics
    public Map<String, Object> getAnalyticsStats() {
        List<Complaint> all = complaintRepository.findAll();

        long total = all.size();
        long pending = all.stream().filter(c -> "PENDING".equalsIgnoreCase(c.getStatus())).count();
        long assigned = all.stream().filter(c -> "ASSIGNED".equalsIgnoreCase(c.getStatus())).count();
        long inProgress = all.stream().filter(c -> "IN_PROGRESS".equalsIgnoreCase(c.getStatus()) || "UNDER_INVESTIGATION".equalsIgnoreCase(c.getStatus())).count();
        long resolved = all.stream().filter(c -> "RESOLVED".equalsIgnoreCase(c.getStatus())).count();
        long rejected = all.stream().filter(c -> "REJECTED".equalsIgnoreCase(c.getStatus())).count();

        String todayStr = LocalDate.now().toString();
        long resolvedToday = all.stream()
                .filter(c -> "RESOLVED".equalsIgnoreCase(c.getStatus()) && c.getUpdatedAt() != null && c.getUpdatedAt().toLocalDate().toString().equals(todayStr))
                .count();

        // Calculate safety score (base 100 minus pending/unresolved impact)
        int safetyScore = Math.max(40, (int) (100 - (pending * 5 + inProgress * 2)));

        // Category breakdown
        Map<String, Long> categoryStats = new HashMap<>();
        all.forEach(c -> {
            String cat = c.getCategory() != null ? c.getCategory() : "General";
            categoryStats.put(cat, categoryStats.getOrDefault(cat, 0L) + 1);
        });

        // Officer Workload
        Map<String, Long> officerWorkload = new HashMap<>();
        all.forEach(c -> {
            String officer = c.getAssignedOfficer() != null && !c.getAssignedOfficer().isBlank()
                    ? c.getAssignedOfficer()
                    : (c.getAssignedStation() != null ? c.getAssignedStation() : "Unassigned");
            officerWorkload.put(officer, officerWorkload.getOrDefault(officer, 0L) + 1);
        });

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalComplaints", total);
        stats.put("pendingComplaints", pending);
        stats.put("assignedComplaints", assigned);
        stats.put("inProgressComplaints", inProgress);
        stats.put("resolvedComplaints", resolved);
        stats.put("rejectedComplaints", rejected);
        stats.put("resolvedToday", resolvedToday);
        stats.put("activeAlerts", pending + inProgress);
        stats.put("safetyScore", safetyScore);
        stats.put("categoryStats", categoryStats);
        stats.put("officerWorkload", officerWorkload);

        return stats;
    }

}