package com.example.service;

import com.example.mapper.AssessmentTestMapper;
import com.example.mapper.QuestionMapper;
import com.example.model.dto.AssessmentTest;
import com.example.model.dto.Question;
import com.example.model.entity.AssessmentTestEntity;
import com.example.model.entity.AssessmentTestQuestionEntity;
import com.example.model.entity.QuestionEntity;
import com.example.model.exception.NotFoundException;
import com.example.repositories.AssessmentTestRepository;
import com.example.repositories.UserAssessmentTestEntityRepository;
import com.example.security.JwtUser;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AssessmentTestService {

  private final AssessmentTestMapper assessmentTestMapper;
  private final AssessmentTestRepository assessmentTestRepository;
  private final UserAssessmentTestEntityRepository userAssessmentTestEntityRepository;
  private final QuestionMapper questionMapper;

  public List<AssessmentTest> getAll(JwtUser loggedInUser) {
    List<AssessmentTest> assessmentTests =
        assessmentTestMapper.mapAssessmentTestEntitiesToAssessmentTests(
        assessmentTestRepository.findAll());
assessmentTests.forEach(assessmentTest -> assessmentTest.setCompleted( userAssessmentTestEntityRepository.existsByUserIdAndAndAssessmentTestId(
    loggedInUser.getId(), assessmentTest.getId())));
    return assessmentTests;
  }

  public List<Question> getAssessmentTestQuestions(Integer id) {
    AssessmentTestEntity assessmentTestEntity =
        assessmentTestRepository.findById(id).orElseThrow(NotFoundException::new);

    List<QuestionEntity> questionsEntities =
        assessmentTestEntity.getQuestions().stream()
            .map(AssessmentTestQuestionEntity::getQuestion)
            .collect(Collectors.toList());
  return questionMapper.mapQuestionEntitiesToQuestion(questionsEntities);
  }
}
