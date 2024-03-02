package com.example.repositories;

import com.example.model.entity.KnowledgeSpaceEntity;
import com.example.model.entity.KnowledgeSpaceProblemEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KnowledgeSpaceProblemEntityRepository
    extends JpaRepository<KnowledgeSpaceProblemEntity, Integer> {

  List<KnowledgeSpaceProblemEntity> findAllByKnowledgeSpaceId(Integer knowledgeSpaceId);

  void deleteAllByKnowledgeSpace(KnowledgeSpaceEntity knowledgeSpaceEntity);
}
