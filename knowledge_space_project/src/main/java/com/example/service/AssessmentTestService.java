package com.example.service;

import com.example.mapper.AssessmentTestMapper;
import com.example.mapper.QuestionMapper;
import com.example.model.dto.AssessmentTest;
import com.example.model.dto.Question;
import com.example.model.entity.AssessmentTestEntity;
import com.example.model.entity.AssessmentTestQuestionEntity;
import com.example.model.entity.EdgeEntity;
import com.example.model.entity.ProblemEntity;
import com.example.model.entity.QuestionEntity;
import com.example.model.entity.ResponseEntity;
import com.example.model.entity.UserAssessmentTestEntity;
import com.example.model.entity.UserAssessmentTestResponseEntity;
import com.example.model.entity.UserEntity;
import com.example.model.exception.NotFoundException;
import com.example.model.request.UserAnswerRequest;
import com.example.model.response.auth.UserTestResults;
import com.example.repositories.AssessmentTestEntityRepository;
import com.example.repositories.EdgeEntityRepository;
import com.example.repositories.ProblemEntityRepository;
import com.example.repositories.ResponseEntityRepository;
import com.example.repositories.UserAssessmentTestEntityRepository;
import com.example.repositories.UserAssessmentTestResponseEntityRepository;
import com.example.repositories.UserEntityRepository;
import com.example.security.JwtUser;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
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
  private final AssessmentTestEntityRepository assessmentTestEntityRepository;
  private final UserAssessmentTestEntityRepository userAssessmentTestEntityRepository;
  private final ResponseEntityRepository responseEntityRepository;
  private final UserEntityRepository userEntityRepository;
  private final UserAssessmentTestResponseEntityRepository
      userAssessmentTestResponseEntityRepository;
  private final QuestionMapper questionMapper;
  private final ProblemEntityRepository problemEntityRepository;
  private final EdgeEntityRepository edgeEntityRepository;

  public List<AssessmentTest> getAll(JwtUser loggedInUser) {
    List<AssessmentTest> assessmentTests =
        assessmentTestMapper.mapAssessmentTestEntitiesToAssessmentTests(
            assessmentTestEntityRepository.findAll());
    assessmentTests.forEach(
        assessmentTest ->
            assessmentTest.setCompleted(
                userAssessmentTestEntityRepository.existsByUserIdAndAndAssessmentTestId(
                    loggedInUser.getId(), assessmentTest.getId())));
    return assessmentTests;
  }

  public List<Question> getAssessmentTestQuestions(Integer id) {
    AssessmentTestEntity assessmentTestEntity =
        assessmentTestEntityRepository.findById(id).orElseThrow(NotFoundException::new);

    List<QuestionEntity> questionsEntities =
        assessmentTestEntity.getQuestions().stream()
            .map(AssessmentTestQuestionEntity::getQuestion)
            .toList();
    return questionMapper.mapQuestionEntitiesToQuestion(questionsEntities);
  }

  public UserTestResults submitAssessmentTest(
      Integer assessmentTestId, JwtUser loggedInUser, List<UserAnswerRequest> answers) {
    UserEntity userEntity = userEntityRepository.getReferenceById(loggedInUser.getId());
    AssessmentTestEntity assessmentTestEntity =
        assessmentTestEntityRepository
            .findById(assessmentTestId)
            .orElseThrow(NotFoundException::new);
    List<ResponseEntity> responses =
        responseEntityRepository.findAllById(
            answers.stream().map(UserAnswerRequest::getResponseId).toList());

    UserAssessmentTestEntity userAssessmentTestEntity = new UserAssessmentTestEntity();
    userAssessmentTestEntity.setUser(userEntity);
    userAssessmentTestEntity.setAssessmentTest(assessmentTestEntity);
    userAssessmentTestEntity.setId(0);

    userAssessmentTestEntityRepository.save(userAssessmentTestEntity);

    List<UserAssessmentTestResponseEntity> userResponses =
        responses.stream()
            .map(
                response -> {
                  UserAssessmentTestResponseEntity userResponse =
                      new UserAssessmentTestResponseEntity();
                  userResponse.setUserAssessmentTest(userAssessmentTestEntity);
                  userResponse.setResponse(response);
                  userResponse.setId(0);
                  return userResponse;
                })
            .toList();

    userAssessmentTestResponseEntityRepository.saveAll(userResponses);

    return UserTestResults.builder()
        .total(assessmentTestEntity.getQuestions().size())
        .correct(responses.stream().filter(ResponseEntity::isCorrect).count())
        .build();
  }

//  public void startMCQ(Integer assessmentTestId){
//    AssessmentTestEntity assessmentTestEntity =
//        assessmentTestEntityRepository.findById(assessmentTestId).orElseThrow(NotFoundException::new);
//
//      List<ProblemEntity> nodes =
//          problemEntityRepository.findAllByKnowledgeSpaceId(assessmentTestEntity.getKnowledgeSpace().getId());
//      List<EdgeEntity> edges =
//          edgeEntityRepository.findBySourceProblemInOrDestinationProblemIn(nodes, nodes);
//      List<ProblemEntity> notRootNodes =
//          edges.stream().map(EdgeEntity::getDestinationProblem).toList();
//
//     List<ProblemEntity> rootNodes =  new ArrayList<>(nodes);
//     rootNodes.removeAll(notRootNodes);
//
//      List<List<ProblemEntity>> learningSpaces = BFS(rootNodes, nodes ,edges);
//
//
//  }
//
//  private
}
