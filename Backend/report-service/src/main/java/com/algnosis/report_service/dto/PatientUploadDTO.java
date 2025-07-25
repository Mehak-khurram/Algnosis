package com.algnosis.report_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatientUploadDTO {
    private String id;

    //THE FILE UPLOADED BY PATIENT
    private String email;
    private LocalDateTime createdAt;
    private String status;
    private String disease;

    private String fileUrl;
    private String fileName;
    private String fileType;

    //DOCTOR ASSIGNED TO THE REPORT
    private String doctorID;
//    private String firstName;
//    private String lastName;
//    private String specialization;
//    private int yearsOfExperience;
//    private String qualifications;

    //DIAGNOSIS OF THE REPORT
    private String diagnosis;//to store the one line diagnosis
    private String diagnosisSummary;
    private String diagnosisUrl;//to store the url of the diagnosis report sent by the doctor

}
