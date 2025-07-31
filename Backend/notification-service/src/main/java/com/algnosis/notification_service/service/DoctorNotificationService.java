package com.algnosis.notification_service.service;

import com.algnosis.notification_service.dto.DoctorNotificationDTO;
import com.algnosis.notification_service.entity.DoctorNotification;
import com.algnosis.notification_service.entity.PatientNotification;
import com.algnosis.notification_service.mapper.DoctorNotificationMapper;
import com.algnosis.notification_service.repository.DoctorNotificationRepository;
import com.algnosis.notification_service.repository.PatientNotificationRepository;
import org.springframework.stereotype.Service;

@Service
public class DoctorNotificationService {

    private final DoctorNotificationRepository doctorRepo;

    public DoctorNotificationService(DoctorNotificationRepository repository) {
        this.doctorRepo = repository;
    }

    public DoctorNotificationDTO createNotification(DoctorNotification notification) {
        DoctorNotificationDTO doctorNotificationDTO = new DoctorNotificationDTO();
        doctorNotificationDTO = DoctorNotificationMapper.toDTO(doctorRepo.save(notification));

        return doctorNotificationDTO;
    }
}
