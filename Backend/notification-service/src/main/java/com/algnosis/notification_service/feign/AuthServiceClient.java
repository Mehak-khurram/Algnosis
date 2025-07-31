package com.algnosis.notification_service.feign;

import com.algnosis.notification_service.config.FeignClientInterceptor;
import com.algnosis.notification_service.dto.DoctorResponseDTO;
import com.algnosis.notification_service.dto.PatientResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name="auth-service",
        url="${auth.service.url}",
        configuration = FeignClientInterceptor.class,
        fallback = AuthServiceClientFallback.class)
public interface AuthServiceClient {

    @GetMapping("/patient/get/data")
    PatientResponseDTO getPatientDataWithoutAuthentication(@RequestParam String email);

    @GetMapping("/doctor/get/email")
    DoctorResponseDTO getDoctorBasedOnEmail(@RequestParam String email);
}
