package com.algnosis.notification_service.entity;
import lombok.*;
import org.springframework.cglib.core.Local;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "doctorNotification")
public class DoctorNotification {
    @Id
    private String id;

    private String doctorID;
    private String reportID;

    private String disease;
    private String message;

    private String read;
    private LocalDateTime timestamp;


}
