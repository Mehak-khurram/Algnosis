package com.algnosis.report_service.mapper;

import com.algnosis.report_service.dto.PatientUploadDTO;
import com.algnosis.report_service.entity.PatientUpload;

public class PatientUploadMapper {

    public static PatientUploadDTO toDTO(PatientUpload patientUpload){
        PatientUploadDTO patientUploadDTO = new PatientUploadDTO();

        patientUploadDTO.setDisease(patientUpload.getDisease());
        patientUploadDTO.setEmail(patientUpload.getEmail());
        patientUploadDTO.setStatus(patientUpload.getStatus());
        patientUploadDTO.setCreatedAt(patientUpload.getCreatedAt());
        patientUploadDTO.setFileType(patientUpload.getFileType());
        patientUploadDTO.setFileName(patientUpload.getFileName());
        patientUploadDTO.setFileUrl(patientUpload.getFileUrl());

        return patientUploadDTO;
    }
}
