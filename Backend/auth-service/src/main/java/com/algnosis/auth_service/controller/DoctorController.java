package com.algnosis.auth_service.controller;

import com.algnosis.auth_service.dto.DoctorResponseDTO;
import com.algnosis.auth_service.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
