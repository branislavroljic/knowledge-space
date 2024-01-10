package com.example.mapper;

import com.example.model.dto.Question;
import com.example.model.entity.QuestionEntity;
import java.util.List;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(
    componentModel = "spring",
    uses = {ResponseMapper.class})
public interface QuestionMapper {
  @BeanMapping(qualifiedByName = "questionEntityToQuestion")
  @Mapping(target = "problemId", source = "questionEntity.problem.id")
  Question mapQuestionEntityToQuestion(QuestionEntity questionEntity);

  @Named("QuestionEntityToQuestion")
  List<Question> mapQuestionEntitiesToQuestion(List<QuestionEntity> questionEntityList);

  @BeanMapping(qualifiedByName = "questionToQuestionEntity")
  QuestionEntity mapQuestionToQuestionEntity(
      com.example.model.request.assesmentTest.Question question);
}
