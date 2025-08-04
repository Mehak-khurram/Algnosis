package com.algnosis.report_service.mapper;

import com.algnosis.report_service.dto.PatientUploadDTO;
import com.algnosis.report_service.entity.PatientUpload;

public class PatientUploadMapper {

    public static PatientUploadDTO toDTO(PatientUpload patientUpload){
        PatientUploadDTO patientUploadDTO = new PatientUploadDTO();

        patientUploadDTO.setId(patientUpload.getId());

        patientUploadDTO.setDoctorID(patientUpload.getDoctorID());

        patientUploadDTO.setDisease(patientUpload.getDisease());
        patientUploadDTO.setEmail(patientUpload.getEmail());
        patientUploadDTO.setStatus(patientUpload.getStatus());
        patientUploadDTO.setCreatedAt(patientUpload.getCreatedAt());

        patientUploadDTO.setFileType(patientUpload.getFileType());
        patientUploadDTO.setFileName(patientUpload.getFileName());
        patientUploadDTO.setFileUrl(patientUpload.getFileUrl());

        patientUploadDTO.setDiagnosis(patientUpload.getDiagnosis());
        patientUploadDTO.setDiagnosisSummary(patientUpload.getDiagnosisSummary());
        patientUploadDTO.setDiagnosisUrl(patientUpload.getDiagnosisUrl());

        return patientUploadDTO;
    }

    public static PatientUpload toEntity(PatientUploadDTO patientUploadDTO) {
        PatientUpload patientUpload = new PatientUpload();

        patientUpload.setId(patientUploadDTO.getId());

        patientUpload.setDoctorID(patientUploadDTO.getDoctorID());

        patientUpload.setDisease(patientUploadDTO.getDisease());
        patientUpload.setEmail(patientUploadDTO.getEmail());
        patientUpload.setStatus(patientUploadDTO.getStatus());
        patientUpload.setCreatedAt(patientUploadDTO.getCreatedAt());

        patientUpload.setFileType(patientUploadDTO.getFileType());
        patientUpload.setFileName(patientUploadDTO.getFileName());
        patientUpload.setFileUrl(patientUploadDTO.getFileUrl());

        patientUpload.setDiagnosis(patientUploadDTO.getDiagnosis());
        patientUpload.setDiagnosisSummary(patientUploadDTO.getDiagnosisSummary());
        patientUpload.setDiagnosisUrl(patientUploadDTO.getDiagnosisUrl());

        return patientUpload;
    }
}
