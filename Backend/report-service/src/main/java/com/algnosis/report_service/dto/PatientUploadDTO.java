package com.algnosis.report_service.dto;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class PatientUploadDTO {

    private String email;
    private LocalDateTime createdAt;
    private String status;
    private String disease;

    private String fileUrl;
    private String fileName;
    private String fileType;

}
