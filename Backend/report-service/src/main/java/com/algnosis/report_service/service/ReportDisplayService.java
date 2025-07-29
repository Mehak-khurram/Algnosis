package com.algnosis.report_service.service;

import com.algnosis.report_service.dto.DoctorResponseDTO;
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

import java.util.ArrayList;
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

    //GETTING REPORTS FOR VIEW ALL REPORTS PAGE FOR PATIENT
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

    public List<PatientUploadDTO> getAllReportsForDoctor() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String doctorEmail = authentication.getName();

        System.out.println(authentication);

        System.out.println(doctorEmail);

        List<String> reportIds = authServiceClient.getDoctorByEmail(doctorEmail).getAssignedReports();

        List<PatientUploadDTO> reportDTOs = new ArrayList<>();

        for (String reportId : reportIds) {
            PatientUpload report = patientUploadRepository.findById(reportId)
                    .orElseThrow(() -> new NoReportsFound("Report not found with ID: " + reportId+
                            ". This error is thrown by getAllReportsForDoctor function" +
                            "inside ReportDisplayService class in Report-service."));

            PatientUploadDTO dto = PatientUploadMapper.toDTO(report);
            reportDTOs.add(dto);
        }

        return reportDTOs;
    }

}
