package com.algnosis.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatientUploadDTO {
    private String id;

    // THE FILE UPLOADED BY PATIENT
    private String email;
    private LocalDateTime createdAt;
    private String status;
    private String disease;

    private String fileUrl;
    private String fileName;
    private String fileType;

    // DOCTOR ASSIGNED TO THE REPORT
    private String doctorID;

    // DIAGNOSIS OF THE REPORT
    private String diagnosis;
    private String diagnosisSummary;
    private String diagnosisUrl;
}