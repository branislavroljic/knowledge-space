package com.example.repositories;

import com.example.model.entity.AssessmentTestQuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssessmentTestQuestionEntityRepository extends JpaRepository<AssessmentTestQuestionEntity, Integer> {

}
