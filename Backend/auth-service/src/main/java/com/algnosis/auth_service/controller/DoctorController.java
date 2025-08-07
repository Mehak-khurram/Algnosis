package com.algnosis.auth_service.controller;

import com.algnosis.auth_service.dto.DoctorResponseDTO;
import com.algnosis.auth_service.dto.PatientResponseDTO;
import com.algnosis.auth_service.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctor")
public class DoctorController {
    private DoctorService doctorService;

    public DoctorController(DoctorService doctorService){
        this.doctorService = doctorService;
    }

    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/get/{doctorID}")
    public ResponseEntity<DoctorResponseDTO> getDoctorByID(@PathVariable String doctorID){
        DoctorResponseDTO doctorResponseDTO = doctorService.getDoctorByID(doctorID);
        return ResponseEntity.ok(doctorResponseDTO);
    }

    @GetMapping("/data")
    public ResponseEntity<DoctorResponseDTO> getDoctorByIDWithoutAuthentication(@RequestParam String doctorID){
        DoctorResponseDTO doctorResponseDTO = doctorService.getDoctorByID(doctorID);
        return ResponseEntity.ok(doctorResponseDTO);
    }

    @GetMapping("/get/email")
    public ResponseEntity<DoctorResponseDTO> getDoctorBasedOnEmail(@RequestParam String email){
        DoctorResponseDTO doctorResponseDTO = doctorService.getDoctorBasedOnEmail(email);
        return ResponseEntity.ok(doctorResponseDTO);
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/profile")
    public ResponseEntity<DoctorResponseDTO> getDoctorData(){
        DoctorResponseDTO doctorResponseDTO = doctorService.getDoctorData();
        return ResponseEntity.ok(doctorResponseDTO);
    }

    @GetMapping("/list")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<PatientResponseDTO>> getListOfPatientsAssignedToDoctor(){
        System.out.println("------------CONTROLLER WAS HIT----------");
        List<PatientResponseDTO> patient = doctorService.getPatientList();
        return ResponseEntity.ok(patient);
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<DoctorResponseDTO> updateDoctor(@RequestBody DoctorResponseDTO updatedData) {
        DoctorResponseDTO updatedDoctor = doctorService.updateDoctorProfile(updatedData);
        return ResponseEntity.ok(updatedDoctor);
    }

    @GetMapping("/all")
    public ResponseEntity<List<DoctorResponseDTO>> getListOfDocto(){
        System.out.println("------------CONTROLLER WAS HIT----------");
        List<DoctorResponseDTO> doctors = doctorService.getDoctorList();
        return ResponseEntity.ok(doctors);
    }
}
