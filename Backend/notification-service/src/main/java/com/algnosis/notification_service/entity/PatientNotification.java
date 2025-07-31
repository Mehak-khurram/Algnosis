package com.algnosis.notification_service.entity;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "patientNotification")
public class PatientNotification {
    @Id
    private String id;

    private String patientID;//this is doctor id
    private String reportID;

    private String disease;
    private String message;

    private String read;
    private LocalDateTime timestamp;
}
