package com.example.repositories;

import com.example.model.entity.KnowledgeSpaceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KnowledgeSpaceEntityRepository
    extends JpaRepository<KnowledgeSpaceEntity, Integer> {}
