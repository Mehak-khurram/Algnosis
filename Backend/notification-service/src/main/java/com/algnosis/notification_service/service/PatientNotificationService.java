package com.algnosis.notification_service.service;

import com.algnosis.notification_service.dto.PatientNotificationDTO;
import com.algnosis.notification_service.entity.PatientNotification;
import com.algnosis.notification_service.mapper.PatientNotificationMapper;
import com.algnosis.notification_service.repository.PatientNotificationRepository;
import org.springframework.stereotype.Service;

@Service
public class PatientNotificationService {
    private final PatientNotificationRepository patientRepo;

    public PatientNotificationService(PatientNotificationRepository repository) {
        this.patientRepo = repository;
    }

    public PatientNotificationDTO createNotification(PatientNotification notification) {
        PatientNotificationDTO patientNotificationDTO = new PatientNotificationDTO();
        patientNotificationDTO = PatientNotificationMapper.toDTO(patientRepo.save(notification));
        patientRepo.save(notification);

        return patientNotificationDTO;
    }
}
