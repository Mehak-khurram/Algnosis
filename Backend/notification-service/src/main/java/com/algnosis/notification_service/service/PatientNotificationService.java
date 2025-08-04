package com.algnosis.notification_service.service;

import com.algnosis.notification_service.dto.PatientNotificationDTO;
import com.algnosis.notification_service.dto.PatientResponseDTO;
import com.algnosis.notification_service.entity.PatientNotification;
import com.algnosis.notification_service.exceptionHandling.NotificationNotFound;
import com.algnosis.notification_service.feign.AuthServiceClient;
import com.algnosis.notification_service.mapper.PatientNotificationMapper;
import com.algnosis.notification_service.repository.PatientNotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientNotificationService {
    @Autowired
    private final PatientNotificationRepository patientRepo;
    @Autowired
    private final AuthServiceClient authServiceClient;

    public PatientNotificationService(PatientNotificationRepository repository, AuthServiceClient authServiceClient) {
        this.patientRepo = repository;
        this.authServiceClient = authServiceClient;
    }

    public PatientNotificationDTO createNotification(PatientNotification notification) {
        PatientNotificationDTO patientNotificationDTO = new PatientNotificationDTO();
        patientNotificationDTO = PatientNotificationMapper.toDTO(patientRepo.save(notification));
        patientRepo.save(notification);

        return patientNotificationDTO;
    }

    public List<PatientNotificationDTO> getNotifications() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        System.out.println("getting notification for "+
                "patient " + email);

        //CALL FEIGN CLIENT FUNCTION TO GET PATIENT ID
        PatientResponseDTO patientResponseDTO = authServiceClient.getPatientDataWithoutAuthentication(email);
        String patientID = patientResponseDTO.getId();

        List<PatientNotification> notifications = patientRepo.findByPatientID(patientID);

        return notifications.stream()
                .map(PatientNotificationMapper::toDTO)
                .collect(Collectors.toList());
    }

    public PatientNotificationDTO updateNotificationStatus(String id) {
        PatientNotification notification = patientRepo.findById(id)
                .orElseThrow(() -> new NotificationNotFound("Notification not found with ID: " + id +
                        ". This error is thrown by updateNotificationStatus function in PatientNotificationService " +
                        "class or NotificationService."));

        notification.setRead("true");
        patientRepo.save(notification);

        return PatientNotificationMapper.toDTO(notification);
    }
}
