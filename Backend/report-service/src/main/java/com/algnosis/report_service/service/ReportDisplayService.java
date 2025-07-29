package com.algnosis.report_service.service;

import com.algnosis.report_service.dto.DoctorResponseDTO;
import com.algnosis.report_service.dto.PatientUploadDTO;
import com.algnosis.report_service.entity.PatientUpload;
import com.algnosis.report_service.exceptionHandling.NoReportsFound;
import com.algnosis.report_service.feign.AuthServiceClient;
import com.algnosis.report_service.mapper.PatientUploadMapper;
import com.algnosis.report_service.repository.PatientUploadRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ReportDisplayService {

    @Autowired
    private final PatientUploadRepository patientUploadRepository;
    @Autowired
    private final AuthServiceClient authServiceClient;
    @Autowired
    private final Cloudinary cloudinary;

    public ReportDisplayService(PatientUploadRepository patientUploadRepository,
                                AuthServiceClient authServiceClient, Cloudinary cloudinary) {
        this.patientUploadRepository = patientUploadRepository;
        this.authServiceClient = authServiceClient;
        this.cloudinary = cloudinary;
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


    public PatientUploadDTO uploadDiagnosisReport(MultipartFile file, String reportID) throws IOException {
        System.out.println("I am inside Controller!!!!!");
        //EXTRACTING EMAIL FROM TOKEN
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        //UPLOADING FILE TO CLOUDINARY
        Map<?,?> uploadResults = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        String fileUrl = (String) uploadResults.get("secure_url");
        String fileType = (String) uploadResults.get("resource_type");
        String fileName = (String) uploadResults.get("original_filename");

        PatientUpload patientUpload = patientUploadRepository.findById(reportID).orElseThrow(
                () -> new NoReportsFound("No report with ID "+
                        reportID + " found. This error is thrown by uploadDiagnosisReport function " +
                        "in ReportDisplayService of ReportService.")
        );

        patientUpload.setDiagnosisUrl(fileUrl);
        patientUploadRepository.save(patientUpload);

        PatientUploadDTO patientUploadDTO = PatientUploadMapper.toDTO(patientUpload);
        return patientUploadDTO;
    }


    public PatientUploadDTO findReportByID(String reportID){
        PatientUpload patientUpload = patientUploadRepository.findByid(reportID).orElseThrow(
                () -> new NoReportsFound("No report with ID "+
                        reportID + " found. This error is thrown by uploadDiagnosisReport function " +
                        "in ReportDisplayService of ReportService.")
        );

        PatientUploadDTO patientUploadDTO = PatientUploadMapper.toDTO(patientUpload);
        return patientUploadDTO;
    }
}
