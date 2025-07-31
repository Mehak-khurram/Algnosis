package com.algnosis.notification_service.controller;

import com.algnosis.notification_service.dto.DoctorNotificationDTO;
import com.algnosis.notification_service.dto.PatientNotificationDTO;
import com.algnosis.notification_service.entity.DoctorNotification;
import com.algnosis.notification_service.entity.PatientNotification;
import com.algnosis.notification_service.service.DoctorNotificationService;
import com.algnosis.notification_service.service.PatientNotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

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
}
