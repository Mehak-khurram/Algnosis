package com.algnosis.notification_service.service;

import com.algnosis.notification_service.dto.DoctorNotificationDTO;
import com.algnosis.notification_service.dto.DoctorResponseDTO;
import com.algnosis.notification_service.dto.PatientNotificationDTO;
import com.algnosis.notification_service.dto.PatientResponseDTO;
import com.algnosis.notification_service.entity.DoctorNotification;
import com.algnosis.notification_service.entity.PatientNotification;
import com.algnosis.notification_service.feign.AuthServiceClient;
import com.algnosis.notification_service.mapper.DoctorNotificationMapper;
import com.algnosis.notification_service.mapper.PatientNotificationMapper;
import com.algnosis.notification_service.repository.DoctorNotificationRepository;
import com.algnosis.notification_service.repository.PatientNotificationRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorNotificationService {

    private final DoctorNotificationRepository doctorRepo;
    private final AuthServiceClient authServiceClient;

    public DoctorNotificationService(DoctorNotificationRepository repository, AuthServiceClient authServiceClient) {
        this.doctorRepo = repository;
        this.authServiceClient = authServiceClient;
    }

    public DoctorNotificationDTO createNotification(DoctorNotification notification) {
        DoctorNotificationDTO doctorNotificationDTO = new DoctorNotificationDTO();
        doctorNotificationDTO = DoctorNotificationMapper.toDTO(doctorRepo.save(notification));

        return doctorNotificationDTO;
    }

    public List<DoctorNotificationDTO> getNotifications() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        //CALL FEIGN CLIENT FUNCTION TO GET PATIENT ID
        DoctorResponseDTO doctorResponseDTO = authServiceClient.getDoctorBasedOnEmail(email);
        String doctorID = doctorResponseDTO.getId();

        List<DoctorNotification> notifications = doctorRepo.findByDoctorID(doctorID);

        return notifications.stream()
                .map(DoctorNotificationMapper::toDTO)
                .collect(Collectors.toList());
    }
}
