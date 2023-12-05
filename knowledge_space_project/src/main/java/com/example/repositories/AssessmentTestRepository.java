package com.example.repositories;

import com.example.model.entity.AssessmentTestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssessmentTestRepository extends JpaRepository<AssessmentTestEntity, Integer> {}
