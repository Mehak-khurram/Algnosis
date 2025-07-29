package com.algnosis.auth_service.controller;

import com.algnosis.auth_service.dto.PatientResponseDTO;
import com.algnosis.auth_service.dto.PatientSignUpRequestDTO;
import com.algnosis.auth_service.dto.PatientSignUpResponseDTO;
import com.algnosis.auth_service.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/patient")
public class PatientController {
    private PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/profile")
    public ResponseEntity<PatientResponseDTO> getPatientData(){

        System.out.println("------------CONTROLLER WAS HIT----------");
        PatientResponseDTO patient = patientService.getLoggedInPatientDetails();
        return ResponseEntity.ok(patient);
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<PatientResponseDTO> updatePatient(@RequestBody PatientResponseDTO updatedData) {
        PatientResponseDTO updatedPatient = patientService.updatePatientProfile(updatedData);
        return ResponseEntity.ok(updatedPatient);
    }

    //GET PATIENT DATA BY EMAIL, THIS IS FOR DOCTOR SIDE DIAGNOSIS PAGE FOR PATIENT INFORMATION
    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/get/profile")
    public ResponseEntity<PatientResponseDTO> getPatientData(@RequestParam String email){

        System.out.println("------------CONTROLLER WAS HIT----------");
        PatientResponseDTO patient = patientService.getPatientDetailsByEmail(email);
        return ResponseEntity.ok(patient);
    }
}
