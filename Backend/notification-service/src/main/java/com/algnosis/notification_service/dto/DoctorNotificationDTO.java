package com.algnosis.notification_service.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorNotificationDTO {

    private String id;

    private String doctorID;
    private String reportID;

    private String disease;
    private String message;

    private String read;
    private LocalDateTime timestamp;

}