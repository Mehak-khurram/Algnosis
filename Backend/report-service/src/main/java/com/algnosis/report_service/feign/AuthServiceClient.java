package com.algnosis.report_service.feign;

import com.algnosis.report_service.dto.DoctorResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name="auth-service",
        url="${auth.service.url}",
        fallback = AuthServiceClientFallback.class)
public interface AuthServiceClient {

    @GetMapping("/protected/doctor")
    List<DoctorResponseDTO> getDoctorsBySpecializationIgnoreCase(@RequestParam("specialization") String specialization);

}
