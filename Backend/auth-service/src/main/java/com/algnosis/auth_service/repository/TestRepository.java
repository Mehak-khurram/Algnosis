package com.algnosis.auth_service.repository;

import com.algnosis.auth_service.entity.Test;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TestRepository extends MongoRepository<Test, String> {
}
