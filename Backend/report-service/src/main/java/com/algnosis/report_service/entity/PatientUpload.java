package com.algnosis.report_service.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "patientReports")
public class PatientUpload {

    @Id
    private String id;

    private String patientEmail;

    private String fileName;

    private String fileType;

    private byte[] fileData;

    private String status = "PENDING";

    private Date uploadedAt = new Date();

}
