package com.algnosis.report_service.controller;

import com.algnosis.report_service.dto.PatientUploadDTO;
import com.algnosis.report_service.service.PatientUploadService;
import com.algnosis.report_service.service.ReportDisplayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/reports")
public class ReportDisplayController {

    @Autowired
    private final ReportDisplayService reportDisplayService;

    public ReportDisplayController(ReportDisplayService reportDisplayService) {
        this.reportDisplayService = reportDisplayService;
    }

    @GetMapping("/list")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<PatientUploadDTO>> getListOfPatientsUploads() {
        System.out.println("Controller was hit!");
        List<PatientUploadDTO> patientUploadlist = reportDisplayService.getAllReports();

        return ResponseEntity.ok(patientUploadlist);
    }

    @GetMapping("/doctor/list")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<PatientUploadDTO>> getListOfDoctorsAssignedReports() {
        System.out.println("Controller was hit!");
        List<PatientUploadDTO> assignedReportsList = reportDisplayService.getAllReportsForDoctor();

        return ResponseEntity.ok(assignedReportsList);
    }

    // THIS API IS FOR UPDATING THE DIAGNOSISURL OR AN EXISTING REPORT
    // THIS IS CALLED WHEN THE USER CLICKS ON DOWNLOAD PDF AND A DIAGNOSIS SUMMARY
    // IS GENERATED TO BE DOWNLOADED
    @PutMapping("/diagnosis/update")
    public ResponseEntity<PatientUploadDTO> uploadDiagnosisReport(
            @RequestParam("file") MultipartFile file,
            @RequestParam("reportId") String reportId) throws IOException {

        PatientUploadDTO updatedReport = reportDisplayService.uploadDiagnosisReport(file, reportId);
        return ResponseEntity.ok(updatedReport);
    }

    // this is for doctor side diagnosis page to display report information
    @GetMapping("/get")
    @PreAuthorize("hasAnyRole('DOCTOR', 'PATIENT')")
    public ResponseEntity<PatientUploadDTO> getReportByReportID(
            @RequestParam String reportID) {
        PatientUploadDTO patientUploadDTO = reportDisplayService.findReportByID(reportID);
        return ResponseEntity.ok(patientUploadDTO);
    }

    // this is for doctor side diagnosis page to display report information
    @GetMapping("/get/email")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<PatientUploadDTO>> getReportByReportEmail(
            @RequestParam String email) {
        List<PatientUploadDTO> patientUploadDTO = reportDisplayService.findReportByEmail(email);
        return ResponseEntity.ok(patientUploadDTO);
    }
}
