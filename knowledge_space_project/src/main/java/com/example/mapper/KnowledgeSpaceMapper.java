package com.example.mapper;

import com.example.model.dto.KnowledgeSpace;
import com.example.model.entity.KnowledgeSpaceEntity;
import java.util.List;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface KnowledgeSpaceMapper {

  @BeanMapping(qualifiedByName = "knowledgeSpaceEntityToKnowledgeSpace")
  @Mapping(target = "assessmentTest", source = "assessmentTest.name")
  KnowledgeSpace mapKnowledgeSpaceEntityToKnowledgeSpace(KnowledgeSpaceEntity knowledgeSpaceEntity);

  @Named("knowledgeSpaceEntityToKnowledgeSpace")
  List<KnowledgeSpace> mapKnowledgeSpaceEntitiesToKnowledgeSpaces(
      List<KnowledgeSpaceEntity> knowledgeSpaceEntities);
}
