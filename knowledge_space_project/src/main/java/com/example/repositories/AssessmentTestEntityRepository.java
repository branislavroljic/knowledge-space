package com.example.repositories;

import com.example.model.entity.AssessmentTestEntity;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssessmentTestEntityRepository
    extends JpaRepository<AssessmentTestEntity, Integer> {

  Page<AssessmentTestEntity> findAllByKnowledgeSpaceId(Integer id, Pageable pageable);

  List<AssessmentTestEntity> findAllByKnowledgeSpaceId(Integer id);
}
