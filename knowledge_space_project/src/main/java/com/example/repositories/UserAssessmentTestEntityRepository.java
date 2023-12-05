package com.example.repositories;

import com.example.model.entity.UserAssessmentTestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAssessmentTestEntityRepository
    extends JpaRepository<UserAssessmentTestEntity, Integer> {

  boolean existsByUserIdAndAndAssessmentTestId(Integer userId, Integer assessmentTestId);
}
