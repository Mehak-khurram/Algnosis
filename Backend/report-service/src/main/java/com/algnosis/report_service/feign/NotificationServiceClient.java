package com.algnosis.report_service.feign;


import com.algnosis.report_service.config.FeignClientInterceptor;
import com.algnosis.report_service.dto.DoctorNotificationDTO;
import com.algnosis.report_service.dto.PatientNotificationDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name="notification-service",
        url="${notif.service.url}",
        configuration = FeignClientInterceptor.class,
        fallback = NotificationServiceClientFallback.class)
public interface NotificationServiceClient {

    @PostMapping("/notif/patient/")
    void sendNotificationToPatient(@RequestBody PatientNotificationDTO notification);

    @PostMapping("/notif/doctor/")
    void sendNotificationToDoctor(@RequestBody DoctorNotificationDTO notification);
}
