package com.example.repositories;

import com.example.model.dto.Report;
import com.example.model.entity.KnowledgeSpaceEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface KnowledgeSpaceEntityRepository
    extends JpaRepository<KnowledgeSpaceEntity, Integer> {


}
