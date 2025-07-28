package com.algnosis.auth_service.repository;

import com.algnosis.auth_service.entity.Doctor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends MongoRepository<Doctor, String> {

    List<Doctor> findBySpecializationIgnoreCase(String specialization);

    Optional<Object> findByEmail(String email);

    Doctor findDoctorByEmail(String email);
}
