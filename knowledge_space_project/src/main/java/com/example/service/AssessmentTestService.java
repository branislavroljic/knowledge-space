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
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
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
                userAssessmentTestEntityRepository.existsByUserIdAndAssessmentTestId(
                    loggedInUser.getId(), assessmentTest.getId())));
    return assessmentTests;
  }

  //  public List<Question> getAssessmentTestQuestions(Integer id) {
  //    AssessmentTestEntity assessmentTestEntity =
  //        assessmentTestEntityRepository.findById(id).orElseThrow(NotFoundException::new);
  //
  //    List<QuestionEntity> questionsEntities =
  //        assessmentTestEntity.getQuestions().stream()
  //            .map(AssessmentTestQuestionEntity::getQuestion)
  //            .toList();
  //    return questionMapper.mapQuestionEntitiesToQuestion(questionsEntities);
  //  }

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

  public List<Question> getAssessmentTestQuestions(
      Integer assessmentTestId, List<ProblemEntity> sortedProblems) {
    AssessmentTestEntity assessmentTestEntity =
        assessmentTestEntityRepository
            .findById(assessmentTestId)
            .orElseThrow(NotFoundException::new);

    if (sortedProblems == null) {
      List<ProblemEntity> nodes =
          problemEntityRepository.findAllByKnowledgeSpaceId(
              assessmentTestEntity.getKnowledgeSpace().getId());
      List<EdgeEntity> edges =
          edgeEntityRepository.findBySourceProblemInOrDestinationProblemIn(nodes, nodes);

      Map<Integer, List<ProblemEntity>> problemLevelTree = getProblemsLevelTree(nodes, edges);
      sortedProblems = problemLevelTree.get(0);
    }
    // get questions
    List<QuestionEntity> questionEntities =
        assessmentTestEntity.getQuestions().stream()
            .map(AssessmentTestQuestionEntity::getQuestion)
            .toList();

    List<QuestionEntity> sortedQuestionEntities =
        sortQuestionByProblems(questionEntities, sortedProblems);

    return questionMapper.mapQuestionEntitiesToQuestion(sortedQuestionEntities);
  }

  public int[][] generateAssessmentTestMatrix(
      Integer assessmentTestId, List<ProblemEntity> sortedProblems) {
    AssessmentTestEntity assessmentTestEntity =
        assessmentTestEntityRepository
            .findById(assessmentTestId)
            .orElseThrow(NotFoundException::new);
    List<UserAssessmentTestEntity> userAssessmentTestEntities =
        userAssessmentTestEntityRepository.findAllByAssessmentTest(assessmentTestEntity);

    int[][] matrix =
        new int[userAssessmentTestEntities.size()][assessmentTestEntity.getQuestions().size()];

    List<Question> sortedQuestions = getAssessmentTestQuestions(assessmentTestId, sortedProblems);
    for (int i = 0; i < userAssessmentTestEntities.size(); i++) {
      List<ResponseEntity> responses =
          userAssessmentTestEntities.get(i).getResponseEntities().stream()
              .map(UserAssessmentTestResponseEntity::getResponse)
              .toList();

      responses =
          responses.stream()
              .sorted(
                  Comparator.comparingInt(
                      responseEntity -> {
                        Question question =
                            questionMapper.mapQuestionEntityToQuestion(
                                responseEntity.getQuestion());
                        // Find the index of the question in the sortedQuestions list
                        return sortedQuestions.indexOf(question);
                      }))
              .toList();

      for (int j = 0; j < sortedQuestions.size(); j++) {

        matrix[i][j] = responses.get(j).isCorrect() ? 1 : 0;
      }
    }
    return matrix;
  }

  public List<ProblemEntity> getSortedProblems(Map<Integer, List<ProblemEntity>> problemLevelTree) {

    // sort generated tree
    Set<ProblemEntity> sortedProblems = new LinkedHashSet<>();
    List<Integer> levels = new ArrayList<>(problemLevelTree.keySet());
    levels.sort(Collections.reverseOrder());

    for (Integer level : levels) {
      sortedProblems.addAll(problemLevelTree.get(level));
    }
    return new ArrayList<>(sortedProblems);
  }

  public Map<Integer, List<ProblemEntity>> getProblemsLevelTree(
      List<ProblemEntity> problems, List<EdgeEntity> edges) {
    Map<Integer, List<ProblemEntity>> problemLevelTree = new HashMap<>();

    // find children of each problem
    Map<Integer, List<ProblemEntity>> problemChildrenMap = new HashMap<>();
    for (EdgeEntity edge : edges) {
      problemChildrenMap
          .computeIfAbsent(edge.getSourceProblem().getId(), k -> new ArrayList<>())
          .add(edge.getDestinationProblem());
    }

    // populate the tree starting from the leaves
    for (ProblemEntity problem : problems) {
      traverseAndAddToTree(problem, problemLevelTree, problemChildrenMap, 0);
    }
    return problemLevelTree;
  }

  private void traverseAndAddToTree(
      ProblemEntity problem,
      Map<Integer, List<ProblemEntity>> problemLevelTree,
      Map<Integer, List<ProblemEntity>> childrenMap,
      int level) {
    problemLevelTree.computeIfAbsent(level, k -> new ArrayList<>()).add(problem);

    List<ProblemEntity> children = childrenMap.get(problem.getId());
    if (children != null) {
      for (ProblemEntity child : children) {
        traverseAndAddToTree(child, problemLevelTree, childrenMap, level + 1);
      }
    }
  }

  private List<QuestionEntity> sortQuestionByProblems(
      List<QuestionEntity> questionEntities, List<ProblemEntity> sortedProblems) {
    Map<ProblemEntity, Integer> problemIndexMap = new HashMap<>();

    for (int i = 0; i < sortedProblems.size(); i++) {
      problemIndexMap.put(sortedProblems.get(i), i);
    }

    return questionEntities.stream()
        .sorted(
            Comparator.comparing(
                q -> problemIndexMap.get(q.getProblem())))
        .toList();
  }
}
