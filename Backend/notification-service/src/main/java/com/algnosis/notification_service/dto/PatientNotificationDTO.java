package com.algnosis.notification_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class PatientNotificationDTO {

    private String id;

    private String patientID;
    private String reportID;

    private String disease;
    private String message;

    private String read;
    private LocalDateTime timestamp;

}
