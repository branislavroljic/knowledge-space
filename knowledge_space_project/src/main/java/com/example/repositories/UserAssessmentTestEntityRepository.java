package com.example.repositories;

import com.example.model.entity.AssessmentTestEntity;
import com.example.model.entity.UserAssessmentTestEntity;
import com.example.model.entity.UserEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAssessmentTestEntityRepository
    extends JpaRepository<UserAssessmentTestEntity, Integer> {

  boolean existsByUserIdAndAssessmentTestId(Integer userId, Integer assessmentTestId);

  Optional<UserAssessmentTestEntity> findByUserIdAndAssessmentTestId(
      Integer userId, Integer assessmentTestId);

  List<UserAssessmentTestEntity> findAllByAssessmentTest(AssessmentTestEntity assessmentTestEntity);

  Page<UserAssessmentTestEntity> findAllByAssessmentTest(
      AssessmentTestEntity assessmentTestEntity, Pageable pageable);

  UserAssessmentTestEntity findByAssessmentTestAndUser(
      AssessmentTestEntity assessmentTestEntity, UserEntity userEntity);
}
