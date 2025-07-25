package com.algnosis.report_service.service;

import com.algnosis.report_service.dto.DoctorResponseDTO;
import com.algnosis.report_service.dto.PatientUploadDTO;
import com.algnosis.report_service.entity.PatientUpload;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.io.IOException;

@Service
public class PatientUploadService {

    @Autowired
    private final Cloudinary cloudinary;
    @Autowired
    private final PatientUploadRepository patientUploadRepository;
    @Autowired
    private final AuthServiceClient authServiceClient;

    public PatientUploadService(Cloudinary cloudinary, PatientUploadRepository patientUploadRepository, AuthServiceClient authServiceClient) {
        this.cloudinary = cloudinary;
        this.patientUploadRepository = patientUploadRepository;
        this.authServiceClient = authServiceClient;
    }

    public PatientUploadDTO uploadPatientFile(MultipartFile file,
                                              String disease,
                                              String specialization) throws IOException {

        System.out.println("I am inside Controller!!!!!");
        //EXTRACTING EMAIL FROM TOKEN
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        //UPLOADING FILE TO CLOUDINARY
        Map<?,?> uploadResults = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        String fileUrl = (String) uploadResults.get("secure_url");
        String fileType = (String) uploadResults.get("resource_type");
        String fileName = (String) uploadResults.get("original_filename");

        //GET A DOCTOR ASSIGNED TO THIS REPORT
        List<DoctorResponseDTO> doctors = authServiceClient.getDoctorsBySpecializationIgnoreCase(specialization);
        System.out.println(doctors);

        int index = findDoctorWithLeastReports(doctors);

        PatientUpload upload = PatientUpload.builder()
                .email(email)
                .fileUrl(fileUrl)
                .fileName(fileName)
                .fileType(fileType)
                .status("Pending")
                .createdAt(LocalDateTime.now())
                .disease(disease)
                .diagnosis(null)
                .diagnosisSummary(null)
                .diagnosisUrl(null)
                .doctorID(doctors.get(index).getId())
//                .firstName(doctors.get(index).getFirstName())
//                .lastName(doctors.get(index).getLastName())
//                .qualifications(doctors.get(index).getQualifications())
//                .yearsOfExperience(doctors.get(index).getYearsOfExperience())
//                .specialization(doctors.get(index).getSpecialization())
                .build();

        //SAVING TO MONGODB
        patientUploadRepository.save(upload);
        PatientUploadDTO patientUploadDTO = PatientUploadMapper.toDTO(upload);
                                            //DOCTOR ID AND REPORT ID
        authServiceClient.assignReportToDoctor(doctors.get(index).getId(), patientUploadDTO.getId());

        return patientUploadDTO;
    }

    public int findDoctorWithLeastReports(List<DoctorResponseDTO> doctors) {
        if (doctors == null || doctors.isEmpty()) {
            throw new IllegalArgumentException("Doctor list is empty or null." +
                    "This exception is thrown by findDoctorWithLeastReports in " +
                    "PatientUploadService of Report-service.");
        }

        int minIndex = 0;
        int minCount = doctors.get(0).getAssignedReports() != null
                ? doctors.get(0).getAssignedReports().size()
                : 0;

        for (int i = 1; i < doctors.size(); i++) {
            List<String> reports = doctors.get(i).getAssignedReports();
            int reportCount = reports != null ? reports.size() : 0;

            if (reportCount < minCount) {
                minCount = reportCount;
                minIndex = i;
            }
        }

        return minIndex;
    }
}
