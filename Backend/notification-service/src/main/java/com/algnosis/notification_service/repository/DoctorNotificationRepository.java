package com.algnosis.notification_service.repository;

import com.algnosis.notification_service.entity.DoctorNotification;
import com.algnosis.notification_service.entity.PatientNotification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorNotificationRepository extends MongoRepository<DoctorNotification, String> {

    List<DoctorNotification> findByDoctorID(String doctorID);
}
