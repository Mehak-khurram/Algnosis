package com.algnosis.notification_service.mapper;

import com.algnosis.notification_service.dto.DoctorNotificationDTO;
import com.algnosis.notification_service.entity.DoctorNotification;

public class DoctorNotificationMapper {

    public static DoctorNotificationDTO toDTO(DoctorNotification doctorNotification){
        DoctorNotificationDTO doctorNotificationDTO = new DoctorNotificationDTO();

        doctorNotificationDTO.setId(doctorNotification.getId());
        doctorNotificationDTO.setDoctorID(doctorNotification.getDoctorID());
        doctorNotificationDTO.setDisease(doctorNotification.getDisease());
        doctorNotificationDTO.setRead(doctorNotification.getRead());
        doctorNotificationDTO.setMessage(doctorNotification.getMessage());
        doctorNotificationDTO.setReportID(doctorNotification.getReportID());
        doctorNotificationDTO.setTimestamp(doctorNotification.getTimestamp());

        return doctorNotificationDTO;

    }
}
