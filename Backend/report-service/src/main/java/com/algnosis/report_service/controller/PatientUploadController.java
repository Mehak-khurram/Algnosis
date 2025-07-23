package com.algnosis.report_service.controller;

import com.algnosis.report_service.dto.PatientUploadDTO;
import com.algnosis.report_service.service.PatientUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/patient")
public class PatientUploadController {
    @Autowired
    private final PatientUploadService patientUploadService;

    public PatientUploadController(PatientUploadService patientUploadService) {
        this.patientUploadService = patientUploadService;
    }

    @PostMapping("/upload/pneumonia")
    @PreAuthorize("hasRole('PATIENT)")
    public ResponseEntity<PatientUploadDTO> uploadFileForPneumonia(
            @RequestParam("file") MultipartFile file
            ) throws IOException {

        System.out.println("Controller was hit!");
        PatientUploadDTO patientUploadDTO = patientUploadService.uploadPatientFile(file, "PNEUMONIA");
        return ResponseEntity.ok(patientUploadDTO);
    }
}
