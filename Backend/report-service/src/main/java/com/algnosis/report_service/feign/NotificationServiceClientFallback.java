package com.algnosis.report_service.feign;

import com.algnosis.report_service.dto.DoctorNotificationDTO;
import com.algnosis.report_service.dto.PatientNotificationDTO;
import com.algnosis.report_service.exceptionHandling.UnreachableService;

public class NotificationServiceClientFallback implements NotificationServiceClient{

    @Override
    public void sendNotificationToPatient(PatientNotificationDTO notification) {
        throw new UnreachableService("Notification-service not reachable. This error is thrown by " +
                "sendNotificationToPatient in NotificationServiceClientFallback.");
    }

    @Override
    public void sendNotificationToDoctor(DoctorNotificationDTO notification) {
        throw new UnreachableService("Notification-service not reachable. This error is thrown by " +
                "sendNotificationToDoctor in NotificationServiceClientFallback.");
    }
}
