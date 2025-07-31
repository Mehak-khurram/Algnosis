package com.algnosis.notification_service.controller;

import com.algnosis.notification_service.dto.DoctorNotificationDTO;
import com.algnosis.notification_service.dto.PatientNotificationDTO;
import com.algnosis.notification_service.entity.DoctorNotification;
import com.algnosis.notification_service.entity.PatientNotification;
import com.algnosis.notification_service.service.DoctorNotificationService;
import com.algnosis.notification_service.service.PatientNotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/notif/doctor")
public class DoctorNotificationController {

    DoctorNotificationService doctorNotificationService;

    public DoctorNotificationController(DoctorNotificationService doctorNotificationService){
        this.doctorNotificationService = doctorNotificationService;
    }

    @PostMapping("/")
    public ResponseEntity<DoctorNotificationDTO> addDoctorNotification(@RequestBody DoctorNotification notification){
        notification.setTimestamp(LocalDateTime.now());
        notification.setRead("false");
        return ResponseEntity.ok(doctorNotificationService.createNotification(notification));
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/get")
    public ResponseEntity<List<DoctorNotificationDTO>> getDoctorNotifications(){
        List<DoctorNotificationDTO> notifs = doctorNotificationService.getNotifications();
        return ResponseEntity.ok(notifs);
    }
}
