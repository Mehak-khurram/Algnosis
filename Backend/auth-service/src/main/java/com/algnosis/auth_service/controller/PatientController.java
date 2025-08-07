package com.algnosis.auth_service.controller;

import com.algnosis.auth_service.dto.DoctorResponseDTO;
import com.algnosis.auth_service.dto.PatientResponseDTO;
import com.algnosis.auth_service.dto.PatientSignUpRequestDTO;
import com.algnosis.auth_service.dto.PatientSignUpResponseDTO;
import com.algnosis.auth_service.service.PatientService;

import java.util.List;
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

    @GetMapping("/get/data")
    public ResponseEntity<PatientResponseDTO> getPatientDataWithoutAuthentication(@RequestParam String email){

        System.out.println("------------CONTROLLER WAS HIT----------");
        PatientResponseDTO patient = patientService.getPatientDetailsByEmail(email);
        return ResponseEntity.ok(patient);
    }

    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/data")
    public ResponseEntity<PatientResponseDTO> getPatientDataWithId(@RequestParam String id){

        System.out.println("------------CONTROLLER WAS HIT----------");
        PatientResponseDTO patient = patientService.getPatientDetailsByID(id);
        return ResponseEntity.ok(patient);
    }

    /**
     * Get all doctors assigned to the currently logged-in patient
     * @return List of doctors assigned to the patient through medical reports
     */
    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/assigned-doctors")
    public ResponseEntity<List<DoctorResponseDTO>> getAssignedDoctors() {
        System.out.println("------------GET ASSIGNED DOCTORS CONTROLLER WAS HIT----------");
        List<DoctorResponseDTO> assignedDoctors = patientService.getAssignedDoctors();
        return ResponseEntity.ok(assignedDoctors);
    }

}
