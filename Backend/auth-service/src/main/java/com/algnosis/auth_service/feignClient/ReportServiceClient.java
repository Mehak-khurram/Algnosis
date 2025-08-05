package com.algnosis.auth_service.feignClient;

import com.algnosis.auth_service.config.FeignClientInterceptor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Set;

@FeignClient(name="report-service",
        url="${report.service.url}",
        configuration = FeignClientInterceptor.class,
        fallback = ReportServiceClientFallback.class)
public interface ReportServiceClient {

    @GetMapping("/patient/emails")
    Set<String> getEmailsOfPatientsAssignedToDoctor(@RequestParam String doctorId);

}