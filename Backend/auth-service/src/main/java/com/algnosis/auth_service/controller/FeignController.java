package com.algnosis.auth_service.controller;

import com.algnosis.auth_service.dto.DoctorResponseDTO;
import com.algnosis.auth_service.service.DoctorService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/protected")
public class FeignController {
    private DoctorService doctorService;

    public FeignController(DoctorService doctorService){
        this.doctorService = doctorService;
    }

    @GetMapping("/doctor")
    public List<DoctorResponseDTO> getDoctorsBySpecialization(@RequestParam String specialization) {
        List<DoctorResponseDTO> doctors = doctorService.getDoctorsBasedOnSpecialization(specialization);

        return doctors;
    }

}