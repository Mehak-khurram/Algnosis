package com.algnosis.notification_service.controller;

import com.algnosis.notification_service.dto.PatientNotificationDTO;
import com.algnosis.notification_service.entity.PatientNotification;
import com.algnosis.notification_service.service.PatientNotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

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

}
