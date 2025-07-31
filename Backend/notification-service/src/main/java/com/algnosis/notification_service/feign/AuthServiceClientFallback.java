package com.algnosis.notification_service.feign;

import com.algnosis.notification_service.dto.DoctorResponseDTO;
import com.algnosis.notification_service.dto.PatientResponseDTO;
import com.algnosis.notification_service.exceptionHandling.UnreachableService;
import org.springframework.stereotype.Component;

@Component
public class AuthServiceClientFallback implements AuthServiceClient {

    @Override
    public PatientResponseDTO getPatientDataWithoutAuthentication(String email) {
        throw new UnreachableService("Notification-service not reachable. This error is thrown by " +
                "getPatientDataWithoutAuthentication in AuthServiceClientFallback.");
    }

    @Override
    public DoctorResponseDTO getDoctorBasedOnEmail(String email) {
        throw new UnreachableService("Notification-service not reachable. This error is thrown by " +
                "getDoctorBasedOnEmail in AuthServiceClientFallback.");
    }
}