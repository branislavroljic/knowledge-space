package com.example.repositories;

import com.example.model.entity.EdgeEntity;
import com.example.model.entity.ProblemEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EdgeEntityRepository extends JpaRepository<EdgeEntity, Integer> {
  List<EdgeEntity> findBySourceProblemInOrDestinationProblemIn(
      List<ProblemEntity> sourceProblems, List<ProblemEntity> destinationProblems);

  boolean existsBySourceProblemIdAndDestinationProblemId(Integer sourceId, Integer destinationId);

  void deleteBySourceProblemIdAndDestinationProblemId(Integer sourceId, Integer destinationId);
}
