package com.algnosis.auth_service.service;

import com.algnosis.auth_service.dto.*;
import com.algnosis.auth_service.entity.Doctor;
import com.algnosis.auth_service.entity.Patient;
import com.algnosis.auth_service.exceptionHandling.DoctorNotFound;
import com.algnosis.auth_service.exceptionHandling.EmailAlreadyRegistered;
import com.algnosis.auth_service.exceptionHandling.InvalidCredentials;
import com.algnosis.auth_service.exceptionHandling.PatientNotFound;
import com.algnosis.auth_service.feignClient.ReportServiceClient;
import com.algnosis.auth_service.mapper.DoctorSignUpMapper;
import com.algnosis.auth_service.mapper.PatientSignUpMapper;
import com.algnosis.auth_service.repository.DoctorRepository;
import com.algnosis.auth_service.repository.PatientRepository;
import com.algnosis.auth_service.security.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    @Autowired
    private final DoctorRepository doctorRepo;

    @Autowired
    private final PatientRepository patientRepo;

    @Autowired
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private final JWTService jwtService;

    @Autowired
    private final ReportServiceClient reportServiceClient;

    //CONSTRUCTOR
    public DoctorService(DoctorRepository doctorRepo, PatientRepository patientRepo, BCryptPasswordEncoder passwordEncoder, JWTService jwtService, ReportServiceClient reportServiceClient) {
        this.doctorRepo = doctorRepo;
        this.patientRepo = patientRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.reportServiceClient = reportServiceClient;
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

    public DoctorResponseDTO getDoctorData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // This gives the subject of JWT (usually email)

        // Fetch doctor by email
        Doctor doctor = (Doctor) doctorRepo.findByEmail(email)
                .orElseThrow(() -> new DoctorNotFound("No doctor found with email: " + email+
                        ". This error is thrown by function getDoctorData in DoctorService by Auth-service."));


        DoctorResponseDTO doctorResponseDTO = DoctorSignUpMapper.toDoctorResponseDTO(doctor);

        return doctorResponseDTO;
    }

    public List<PatientResponseDTO> getPatientList() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // This gives the subject of JWT (usually email)

        Doctor doctor = doctorRepo.findDoctorByEmail(email);

        Set<String> emailsOfPatients = reportServiceClient.getEmailsOfPatientsAssignedToDoctor(doctor.getId());

        List<Patient> patients = patientRepo.findByEmailIn(emailsOfPatients);

        List<PatientResponseDTO> patientDTOs = patients.stream()
                .map(PatientSignUpMapper::toPatientResponseDTO)
                .collect(Collectors.toList());

        return patientDTOs;
    }

    public DoctorResponseDTO updateDoctorProfile(DoctorResponseDTO updatedData) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Doctor existing = (Doctor) doctorRepo.findByEmail(email)
                .orElseThrow(() -> new DoctorNotFound("No doctor found with email: " + email
                        + ". This error is thrown by updateDoctorProfile function in DoctorService class of auth-service."));

        existing.setFirstName(updatedData.getFirstName());
        existing.setLastName(updatedData.getLastName());
        existing.setPhoneNumber(updatedData.getPhoneNumber());

        existing.setYearsOfExperience(updatedData.getYearsOfExperience());
        existing.setSpecialization(updatedData.getSpecialization());
        existing.setQualifications(updatedData.getQualifications());
        existing.setMedicalLicenseNumber(updatedData.getMedicalLicenseNumber());
        existing.setHospitalName(updatedData.getHospitalName());
        existing.setShortBio(updatedData.getShortBio());

        Doctor saved = doctorRepo.save(existing);

        return DoctorSignUpMapper.toDoctorResponseDTO(saved);
    }
}
