package com.algnosis.auth_service.entity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "doctor")
public class Doctor extends User{

    @Id
    private String id;

    private List<String> assignedReports;

    private String specialization;
    private int yearsOfExperience;
    private String qualifications;
    private String hospitalName;
    private String medicalLicenseNumber;
    private String shortBio;
    private String role = "DOCTOR";
}
