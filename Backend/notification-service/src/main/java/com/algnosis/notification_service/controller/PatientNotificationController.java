package com.algnosis.notification_service.controller;

import com.algnosis.notification_service.dto.PatientNotificationDTO;
import com.algnosis.notification_service.entity.PatientNotification;
import com.algnosis.notification_service.service.PatientNotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/notif/patient")
public class PatientNotificationController {

    PatientNotificationService patientNotificationService;

    public PatientNotificationController(PatientNotificationService patientNotificationService){
        this.patientNotificationService = patientNotificationService;
    }

    @PostMapping("/")
    public ResponseEntity<PatientNotificationDTO> addPatientNotification(@RequestBody PatientNotification notification){
        notification.setTimestamp(LocalDateTime.now());
        notification.setRead("false");
        return ResponseEntity.ok(patientNotificationService.createNotification(notification));
    }

    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/get")
    public ResponseEntity<List<PatientNotificationDTO>> getPatientNotifications(){
        List<PatientNotificationDTO> notifs = patientNotificationService.getNotifications();
        return ResponseEntity.ok(notifs);
    }

}
