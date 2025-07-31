package com.algnosis.notification_service.mapper;

import com.algnosis.notification_service.dto.PatientNotificationDTO;
import com.algnosis.notification_service.entity.PatientNotification;

public class PatientNotificationMapper {

    public static PatientNotificationDTO toDTO(PatientNotification patientNotification){
        PatientNotificationDTO patientNotificationDTO = new PatientNotificationDTO();

        patientNotificationDTO.setId(patientNotification.getId());
        patientNotificationDTO.setPatientID(patientNotification.getPatientID());
        patientNotificationDTO.setDisease(patientNotification.getDisease());
        patientNotificationDTO.setRead(patientNotification.getRead());
        patientNotificationDTO.setMessage(patientNotification.getMessage());
        patientNotificationDTO.setReportID(patientNotification.getReportID());
        patientNotificationDTO.setTimestamp(patientNotification.getTimestamp());

        return patientNotificationDTO;

    }
}
