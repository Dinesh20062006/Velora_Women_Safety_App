package com.complaint.controller;

import com.complaint.entity.Notification;
import com.complaint.repository.NotificationRepository;
import com.complaint.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null || principal.getUserId() == null) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(notificationRepository.findByUserIdOrderByCreatedAtDesc(principal.getUserId()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null || principal.getUserId() == null) {
            return ResponseEntity.ok(0L);
        }
        return ResponseEntity.ok(notificationRepository.countByUserIdAndIsReadFalse(principal.getUserId()));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal principal) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification == null) {
            return ResponseEntity.notFound().build();
        }
        if (principal != null && principal.getUserId() != null && !principal.getUserId().equals(notification.getUserId())) {
            return ResponseEntity.status(403).body("Access denied");
        }
        notification.setRead(true);
        notificationRepository.save(notification);
        return ResponseEntity.ok(notification);
    }
}
