package com.example.repositories;

import com.example.model.entity.ProblemEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemEntityRepository extends JpaRepository<ProblemEntity, Integer> {
  List<ProblemEntity> findAllByKnowledgeSpaceId(Integer id);

}
