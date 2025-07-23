package com.algnosis.report_service.service;

import com.algnosis.report_service.dto.PatientUploadDTO;
import com.algnosis.report_service.entity.PatientUpload;
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
import java.util.Map;
import java.io.IOException;

@Service
public class PatientUploadService {
    @Autowired
    private final Cloudinary cloudinary;
    @Autowired
    private final PatientUploadRepository patientUploadRepository;

    public PatientUploadService(Cloudinary cloudinary, PatientUploadRepository patientUploadRepository) {
        this.cloudinary = cloudinary;
        this.patientUploadRepository = patientUploadRepository;
    }

    public PatientUploadDTO uploadPatientFile(MultipartFile file, String disease) throws IOException {

        //EXTRACTING EMAIL FROM TOKEN
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Map<?,?> uploadResults = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        String fileUrl = (String) uploadResults.get("secure_url");
        String fileType = (String) uploadResults.get("resource_type");
        String fileName = (String) uploadResults.get("original_filename");

        PatientUpload upload = PatientUpload.builder()
                .email(email)
                .fileUrl(fileUrl)
                .fileName(fileName)
                .fileType(fileType)
                .status("Pending")
                .createdAt(LocalDateTime.now())
                .disease(disease)
                .build();
        //SAVING TO MONGODB
        patientUploadRepository.save(upload);
        PatientUploadDTO patientUploadDTO = PatientUploadMapper.toDTO(upload);
        return patientUploadDTO;
    }
}
