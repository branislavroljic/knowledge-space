package com.example.repositories;

import com.example.model.entity.UserAssessmentTestResponseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAssessmentTestResponseEntityRepository
    extends JpaRepository<UserAssessmentTestResponseEntity, Integer> {}
