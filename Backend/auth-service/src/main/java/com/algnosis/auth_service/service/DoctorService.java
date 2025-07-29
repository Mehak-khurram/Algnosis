package com.algnosis.auth_service.service;

import com.algnosis.auth_service.dto.*;
import com.algnosis.auth_service.entity.Doctor;
import com.algnosis.auth_service.entity.Patient;
import com.algnosis.auth_service.exceptionHandling.DoctorNotFound;
import com.algnosis.auth_service.exceptionHandling.EmailAlreadyRegistered;
import com.algnosis.auth_service.exceptionHandling.InvalidCredentials;
import com.algnosis.auth_service.mapper.DoctorSignUpMapper;
import com.algnosis.auth_service.mapper.PatientSignUpMapper;
import com.algnosis.auth_service.repository.DoctorRepository;
import com.algnosis.auth_service.repository.PatientRepository;
import com.algnosis.auth_service.security.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private final DoctorRepository doctorRepo;

    @Autowired
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private final JWTService jwtService;

    //CONSTRUCTOR
    public DoctorService(DoctorRepository doctorRepo, BCryptPasswordEncoder passwordEncoder, JWTService jwtService) {
        this.doctorRepo = doctorRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    //HANDLING DOCTOR REGISTRATION
    public DoctorSignUpRequestDTO registerDoctor(DoctorSignUpRequestDTO request) {

        Doctor doctor = DoctorSignUpMapper.toEntity(request);

        if(emailAlreadyExists(request.getEmail())){
            throw new EmailAlreadyRegistered("Email " + request.getEmail() + " is already registered.");
        }

        //hash password
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        doctor.setPassword(hashedPassword);

        DoctorSignUpRequestDTO doctorSignUpRequestDTO = DoctorSignUpMapper.toDTO(
                doctorRepo.save(doctor)
        );

        return doctorSignUpRequestDTO;
    }

    //CHECKING IF EMAIL IS ALREADY SIGNED UP/ ACCOUNT ALREADY EXISTS
    public boolean emailAlreadyExists(String email){
        return doctorRepo.findByEmail(email).isPresent();
    }

    public LogInResponseDTO loginDoctor(LogInRequestDTO loginRequestDTO){
        //FIRST FIND THE Doctor BY EMAIL
        Doctor doctor = (Doctor) doctorRepo.findByEmail(loginRequestDTO.getEmail()).orElseThrow(
                () -> new InvalidCredentials("Email address or password incorrect.")
        );

        if(!passwordEncoder.matches(loginRequestDTO.getPassword(), doctor.getPassword())){
            throw new InvalidCredentials("Email address or password incorrect.");
        }

        String token = jwtService.generateToken(doctor.getEmail(), doctor.getRole());
        return new LogInResponseDTO(token, doctor.getFirstName(),
                doctor.getLastName(),
                doctor.getEmail(),
                doctor.getRole());
    }

    public List<DoctorResponseDTO> getDoctorsBasedOnSpecialization(String specialization){
        List<Doctor> doctors = doctorRepo.findBySpecializationIgnoreCase(specialization);
        System.out.println(doctors);
        List<DoctorResponseDTO> doctorDTOs = doctors.stream()
                .map(DoctorSignUpMapper::toDoctorResponseDTO)
                .toList();


        return doctorDTOs;
    }

    public DoctorResponseDTO getDoctorBasedOnEmail(String email){
        Doctor doctor = (Doctor) doctorRepo.findByEmail(email).orElseThrow(
                ()-> new DoctorNotFound("No doctor found against email " +
                        "address " + email + ". this error is thrown by" +
                        " getDoctorsBasedOnEmail function in DoctorService class of " +
                        "auth-service.")
        );
       DoctorResponseDTO doctorDTO = DoctorSignUpMapper.toDoctorResponseDTO(doctor);

        return doctorDTO;
    }

    public void assignReport(String doctorId, String reportId) {
        Doctor doctor = doctorRepo.findById(doctorId)
                .orElseThrow(() -> new DoctorNotFound("Doctor not found for ID " +
                        doctorId + "in auth service DoctorService class, function assignReports."));

        List<String> reports = doctor.getAssignedReports();
        if (reports == null) {
            reports = new ArrayList<>();
        }
        if (!reports.contains(reportId)) {
            reports.add(reportId);
        }
        doctor.setAssignedReports(reports);
        doctorRepo.save(doctor);
    }

    public DoctorResponseDTO getDoctorByID(String doctorID){
        Doctor doctor = doctorRepo.findById(doctorID).orElseThrow(
                () -> new DoctorNotFound("Doctor not found for ID " +
                        doctorID + "in auth service DoctorService class, function getDoctorByID.")
        );
        DoctorResponseDTO doctorResponseDTO = DoctorSignUpMapper.toDoctorResponseDTO(doctor);

        return doctorResponseDTO;
    }

}
