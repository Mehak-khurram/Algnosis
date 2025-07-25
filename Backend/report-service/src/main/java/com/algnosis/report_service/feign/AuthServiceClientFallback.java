package com.algnosis.report_service.feign;

import com.algnosis.report_service.dto.DoctorResponseDTO;
import com.algnosis.report_service.exceptionHandling.UnreachableService;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class AuthServiceClientFallback implements AuthServiceClient {

    @Override
    public List<DoctorResponseDTO> getDoctorsBySpecializationIgnoreCase(String specialization) {
        throw new UnreachableService("Auth-service not reachable. This error is thrown by " +
                "getDoctorsBySpecialization in AuthServiceClientFallback.");
    }

    @Override
    public void assignReportToDoctor(String doctorId, String reportId) {
        throw new UnreachableService("Auth-service not reachable. This error is thrown by " +
                "assignReportToDoctor in AuthServiceClientFallback.");
    }
}