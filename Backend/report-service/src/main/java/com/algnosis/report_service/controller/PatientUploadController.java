package com.algnosis.report_service.controller;

import com.algnosis.report_service.dto.PatientUploadDTO;
import com.algnosis.report_service.service.PatientUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Set;

@RestController
@RequestMapping("/patient")
public class PatientUploadController {
    @Autowired
    private final PatientUploadService patientUploadService;

    public PatientUploadController(PatientUploadService patientUploadService) {
        this.patientUploadService = patientUploadService;
    }

    @PostMapping("/upload/pneumonia")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<PatientUploadDTO> uploadFileForPneumonia(
            @RequestParam("file") MultipartFile file
            ) throws IOException {

        System.out.println("Controller was hit!");
        PatientUploadDTO patientUploadDTO = patientUploadService.uploadPatientFile(file,
                "PNEUMONIA",
                        "PULMONOLOGY"
                );
        return ResponseEntity.ok(patientUploadDTO);
    }

    @PostMapping("/upload/tb")
    @PreAuthorize("hasRole('PATIENT)")
    public ResponseEntity<PatientUploadDTO> uploadFileForTB(
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        System.out.println("Controller was hit!");
        PatientUploadDTO patientUploadDTO = patientUploadService.uploadPatientFile(file, "TB",
                "PULMONOLOGY");
        return ResponseEntity.ok(patientUploadDTO);
    }

    @PostMapping("/upload/braintumor")
    @PreAuthorize("hasRole('PATIENT)")
    public ResponseEntity<PatientUploadDTO> uploadFileForBrainTumor(
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        System.out.println("Controller was hit!");
        PatientUploadDTO patientUploadDTO = patientUploadService.uploadPatientFile(file, "BRAIN_TUMOR",
                "NEUROLOGY");
        return ResponseEntity.ok(patientUploadDTO);
    }

    @PostMapping("/upload/anemia")
    @PreAuthorize("hasRole('PATIENT)")
    public ResponseEntity<PatientUploadDTO> uploadFileForAnemia(
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        System.out.println("Controller was hit!");
        PatientUploadDTO patientUploadDTO = patientUploadService.uploadPatientFile(file, "ANEMIA",
                "GENERAL PHYSICIAN");
        return ResponseEntity.ok(patientUploadDTO);
    }

    @GetMapping("/emails")
    public ResponseEntity<Set<String>> getEmailsOfPatientsAssignedToDoctor(@RequestParam String doctorId){
        System.out.println("Controller was hit!");
        Set<String> emails = patientUploadService.getPatientsEmailsForDoctor(doctorId);
        return ResponseEntity.ok(emails);
    }
}
