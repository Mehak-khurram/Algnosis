package com.algnosis.report_service.dto;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
public class PatientUploadDTO {

    private String patientEmail;

    private String fileName;

    private String fileType;

    private byte[] fileData;

    private String status = "PENDING"; // or "REVIEWED"

    private Date uploadedAt = new Date();

}
