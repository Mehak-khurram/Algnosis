package com.algnosis.report_service.service;

import com.algnosis.report_service.dto.PatientUploadDTO;
import com.algnosis.report_service.entity.PatientUpload;
import com.algnosis.report_service.exceptionHandling.NoReportsFound;
import com.algnosis.report_service.feign.AuthServiceClient;
import com.algnosis.report_service.mapper.PatientUploadMapper;
import com.algnosis.report_service.repository.PatientUploadRepository;
import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportDisplayService {

    @Autowired
    private final PatientUploadRepository patientUploadRepository;
    @Autowired
    private final AuthServiceClient authServiceClient;

    public ReportDisplayService(PatientUploadRepository patientUploadRepository,
                                AuthServiceClient authServiceClient) {
        this.patientUploadRepository = patientUploadRepository;
        this.authServiceClient = authServiceClient;
    }

    public List<PatientUploadDTO> getAllReports() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // assumes `email` is stored in the JWT `sub` (subject)

        // 2. Fetch reports by email
        List<PatientUpload> reports = patientUploadRepository.findByEmail(email);

        if(reports.isEmpty() || reports == null){
            throw new NoReportsFound("No Reports have been added by patient yet." +
                    "This error is thrown by ReportDisplayService, function getAllReports.");
        }

        return reports.stream()
                .map(PatientUploadMapper::toDTO)
                .toList();
    }

}
