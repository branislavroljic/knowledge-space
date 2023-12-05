package com.example.mapper;

import com.example.model.dto.Problem;
import com.example.model.entity.KnowledgeSpaceEntity;
import com.example.model.entity.ProblemEntity;
import com.example.model.exception.NotFoundException;
import com.example.repositories.KnowledgeSpaceEntityRepository;
import java.util.List;
import org.mapstruct.AfterMapping;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class ProblemMapper {

  @Autowired KnowledgeSpaceEntityRepository knowledgeSpaceEntityRepository;

  @BeanMapping(qualifiedByName = "problemEntityToProblem")
  @Mapping(target = "knowledgeSpaceId", source = "knowledgeSpace.id")
  public abstract Problem mapProblemEntityToProblem(ProblemEntity problemEntity);

  @Named("problemEntityToProblem")
  public abstract List<Problem> mapProblemEntitiesToProblem(List<ProblemEntity> problemEntityList);

  @BeanMapping(qualifiedByName = "problemProblemEntity")
  public abstract ProblemEntity mapProblemToProblemEntity(Problem problem);

  @Named("problemProblemEntity")
  @AfterMapping
  public void doAfterMappingProblemToProblemEntity(
      Problem problem, @MappingTarget ProblemEntity problemEntity) {
    if (problem.getKnowledgeSpaceId() != null) {
      KnowledgeSpaceEntity knowledgeSpaceEntity =
          knowledgeSpaceEntityRepository
              .findById(problem.getKnowledgeSpaceId())
              .orElseThrow(NotFoundException::new);
      problemEntity.setKnowledgeSpace(knowledgeSpaceEntity);
    }
  }

  @Named("updateProblemEntityFromProblem")
  @Mapping(target = "id", ignore = true)
  public abstract void updateProblemEntityFromProblem(
      Problem problem, @MappingTarget ProblemEntity problemEntity);
}
