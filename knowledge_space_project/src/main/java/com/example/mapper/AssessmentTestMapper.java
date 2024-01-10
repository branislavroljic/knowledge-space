package com.example.mapper;

import com.example.model.dto.AssessmentTest;
import com.example.model.dto.AssessmentTestProfessor;
import com.example.model.entity.AssessmentTestEntity;
import java.util.List;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface AssessmentTestMapper {

  @BeanMapping(qualifiedByName = "assessmentTestEntityToAssessmentTest")
  AssessmentTest mapAssessmentTestEntityToAssessmentTest(AssessmentTestEntity assessmentTestEntity);

  @Named("assessmentTestEntityToAssessmentTest")
  List<AssessmentTest> mapAssessmentTestEntitiesToAssessmentTests(List<AssessmentTestEntity> assessmentTestEntityList);

  @Mapping(target = "knowledgeSpace", source = "knowledgeSpace.name")
  @BeanMapping(qualifiedByName = "assessmentTestEntityToAssessmentTestProfessor")
  AssessmentTestProfessor mapAssessmentTestEntityToAssessmentTestProfessor(AssessmentTestEntity assessmentTestEntity);

  @Named("assessmentTestEntityToAssessmentTestProfessor")
  List<AssessmentTestProfessor> mapAssessmentTestEntitiesToAssessmentTestsProfessor(List<AssessmentTestEntity> assessmentTestEntityList);
}
