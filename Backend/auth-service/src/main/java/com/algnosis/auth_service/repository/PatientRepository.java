package com.algnosis.auth_service.repository;

import com.algnosis.auth_service.entity.Patient;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;


@Repository
public interface PatientRepository extends MongoRepository<Patient, String> {

    Optional<Object> findByEmail(String email);

    List<Patient> findByEmailIn(Set<String> emails);

    long countByActiveTrue();
}
