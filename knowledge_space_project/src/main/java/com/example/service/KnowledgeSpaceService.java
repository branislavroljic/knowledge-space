package com.example.service;

import com.example.mapper.AssessmentTestMapper;
import com.example.mapper.EdgeMapper;
import com.example.mapper.KnowledgeSpaceMapper;
import com.example.mapper.ProblemMapper;
import com.example.mapper.QuestionMapper;
import com.example.mapper.ResponseMapper;
import com.example.model.dto.AssessmentTestProfessor;
import com.example.model.dto.Edge;
import com.example.model.dto.KnowledgeSpace;
import com.example.model.dto.Problem;
import com.example.model.entity.AssessmentTestEntity;
import com.example.model.entity.AssessmentTestQuestionEntity;
import com.example.model.entity.EdgeEntity;
import com.example.model.entity.KnowledgeSpaceEntity;
import com.example.model.entity.KnowledgeSpaceProblemEntity;
import com.example.model.entity.ProblemEntity;
import com.example.model.entity.QuestionEntity;
import com.example.model.entity.ResponseEntity;
import com.example.model.exception.ActionNotAllowedException;
import com.example.model.exception.NotFoundException;
import com.example.model.paging.PageInfoRequest;
import com.example.model.paging.PageResponse;
import com.example.model.request.assesmentTest.CreateAssessmentTestRequest;
import com.example.model.request.assesmentTest.Question;
import com.example.model.response.auth.KnowledgeSpaceGraphData;
import com.example.repositories.AssessmentTestEntityRepository;
import com.example.repositories.AssessmentTestQuestionEntityRepository;
import com.example.repositories.EdgeEntityRepository;
import com.example.repositories.KnowledgeSpaceEntityRepository;
import com.example.repositories.KnowledgeSpaceProblemEntityRepository;
import com.example.repositories.ProblemEntityRepository;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class KnowledgeSpaceService {
  private final ProblemEntityRepository problemEntityRepository;
  private final EdgeEntityRepository edgeEntityRepository;
  private final ProblemMapper problemMapper;
  private final EdgeMapper edgeMapper;
  private final KnowledgeSpaceEntityRepository knowledgeSpaceEntityRepository;
  private final QuestionMapper questionMapper;
  private final ResponseMapper responseMapper;
  private final KnowledgeSpaceMapper knowledgeSpaceMapper;
  private final AssessmentTestQuestionEntityRepository assessmentTestQuestionEntityRepository;
  private final AssessmentTestMapper assessmentTestMapper;
  private final AssessmentTestEntityRepository assessmentTestEntityRepository;
  private final KnowledgeSpaceProblemEntityRepository ksProblemEntityRepository;

  public List<KnowledgeSpace> getKnowledgeSpaces() {
    return knowledgeSpaceMapper.mapKnowledgeSpaceEntitiesToKnowledgeSpaces(
        knowledgeSpaceEntityRepository.findAll());
  }

  public KnowledgeSpaceGraphData getKSGraphData(Integer id) {
    List<ProblemEntity> nodes = getProblemsForKS(id);
    List<EdgeEntity> edges =
        edgeEntityRepository.findBySourceProblemInOrDestinationProblemIn(nodes, nodes);

    return KnowledgeSpaceGraphData.builder()
        .nodes(problemMapper.mapProblemEntitiesToProblems(nodes))
        .edges(edgeMapper.mapEdgeEntitiesToEdges(edges))
        .build();
  }

  public List<Problem> getKSProblems(Integer ksId) {
    List<ProblemEntity> problemEntities = getProblemsForKS(ksId);
    return problemMapper.mapProblemEntitiesToProblems(problemEntities);
  }

  public Problem createProblem(Integer ksId, Problem problem) {
    KnowledgeSpaceEntity knowledgeSpaceEntity =
        knowledgeSpaceEntityRepository.findById(ksId).orElseThrow(NotFoundException::new);
    ProblemEntity problemEntity = problemMapper.mapProblemToProblemEntity(problem);
    problemEntity.setId(0);

    KnowledgeSpaceProblemEntity knowledgeSpaceProblemEntity = new KnowledgeSpaceProblemEntity();
    knowledgeSpaceProblemEntity.setKnowledgeSpace(knowledgeSpaceEntity);
    knowledgeSpaceProblemEntity.setProblem(problemEntity);
    knowledgeSpaceProblemEntity.setId(0);
    ksProblemEntityRepository.save(knowledgeSpaceProblemEntity);

    Problem newProblem = problemMapper.mapProblemEntityToProblem(problemEntity);
    newProblem.setKnowledgeSpaceId(ksId);
    return newProblem;
  }

  public Problem updateProblem(Problem problem) {
    Optional<ProblemEntity> optionalProblemEntity =
        problemEntityRepository.findById(problem.getId());

    ProblemEntity problemEntity;
    if (optionalProblemEntity.isPresent()) {
      problemEntity = optionalProblemEntity.get();
      problemMapper.updateProblemEntityFromProblem(problem, problemEntity);
    } else {
      problemEntity = problemMapper.mapProblemToProblemEntity(problem);
    }
    problemEntityRepository.save(problemEntity);
    return problemMapper.mapProblemEntityToProblem(problemEntity);
  }

  public void deleteProblem(Integer problemId) {
    if (problemEntityRepository.existsById(problemId)) {
      problemEntityRepository.deleteById(problemId);
    }
  }

  public Edge createEdge(Edge edge) {
    if (Objects.equals(edge.getSourceId(), edge.getDestinationId()))
      throw new ActionNotAllowedException("Self loops are not allowed");

    if (edgeEntityRepository.existsBySourceProblemIdAndDestinationProblemId(
        edge.getDestinationId(), edge.getSourceId())) {
      throw new ActionNotAllowedException("The edge in different direction already exist");
    }
    ProblemEntity sourceProblemEntity =
        problemEntityRepository.findById(edge.getSourceId()).orElseThrow(NotFoundException::new);
    ProblemEntity destinationProblemEntity =
        problemEntityRepository
            .findById(edge.getDestinationId())
            .orElseThrow(NotFoundException::new);

    EdgeEntity edgeEntity = new EdgeEntity();
    edgeEntity.setId(0);
    edgeEntity.setSourceProblem(sourceProblemEntity);
    edgeEntity.setDestinationProblem(destinationProblemEntity);
    edgeEntityRepository.save(edgeEntity);
    return edgeMapper.mapEdgeEntityToEdge(edgeEntity);
  }

  public void deleteEdge(Integer sourceId, Integer destinationId) {

    if (edgeEntityRepository.existsBySourceProblemIdAndDestinationProblemId(
        sourceId, destinationId)) {
      edgeEntityRepository.deleteBySourceProblemIdAndDestinationProblemId(sourceId, destinationId);
    }
  }

  public void createAssessmentTest(
      Integer knowledgeSpaceId, CreateAssessmentTestRequest createAssessmentTestRequest) {
    KnowledgeSpaceEntity knowledgeSpaceEntity =
        knowledgeSpaceEntityRepository
            .findById(knowledgeSpaceId)
            .orElseThrow(NotFoundException::new);
    List<QuestionEntity> questionEntities = new ArrayList<>();
    for (Question question : createAssessmentTestRequest.getQuestions()) {
      ProblemEntity problemEntity =
          problemEntityRepository
              .findById(question.getProblemId())
              .orElseThrow(NotFoundException::new);
      List<ResponseEntity> responses =
          responseMapper.mapResponsesToResponseEntities(question.getResponses());

      QuestionEntity questionEntity = questionMapper.mapQuestionToQuestionEntity(question);
      questionEntity.setId(0);
      questionEntity.setProblem(problemEntity);
      questionEntity.setResponses(responses);
      questionEntities.add(questionEntity);
      responses.forEach(
          r -> {
            r.setId(0);
            r.setQuestion(questionEntity);
          });
    }
    AssessmentTestEntity assessmentTestEntity = new AssessmentTestEntity();
    assessmentTestEntity.setId(0);
    assessmentTestEntity.setKnowledgeSpace(knowledgeSpaceEntity);
    assessmentTestEntity.setName(createAssessmentTestRequest.getName());

    List<AssessmentTestQuestionEntity> assessmentTestQuestionEntities = new ArrayList<>();
    for (QuestionEntity questionEntity : questionEntities) {
      AssessmentTestQuestionEntity assessmentTestQuestionEntity =
          new AssessmentTestQuestionEntity();
      assessmentTestQuestionEntity.setId(0);
      assessmentTestQuestionEntity.setAssessmentTest(assessmentTestEntity);
      assessmentTestQuestionEntity.setQuestion(questionEntity);
      assessmentTestQuestionEntities.add(assessmentTestQuestionEntity);
    }

    assessmentTestQuestionEntityRepository.saveAll(assessmentTestQuestionEntities);
  }

  public PageResponse<KnowledgeSpace> getPaginatedKnowledgeSpaces(PageInfoRequest request) {
    Pageable pageable = PageRequest.of(request.getPageIndex(), request.getPageSize());

    Page<KnowledgeSpaceEntity> knowledgeSpaceEntityPage =
        knowledgeSpaceEntityRepository.findAll(pageable);

    List<KnowledgeSpace> knowledgeSpaces =
        knowledgeSpaceMapper.mapKnowledgeSpaceEntitiesToKnowledgeSpaces(
            knowledgeSpaceEntityPage.getContent());

    return PageResponse.<KnowledgeSpace>builder()
        .rows(knowledgeSpaces)
        .totalCount(knowledgeSpaceEntityPage.getTotalElements())
        .build();
  }

  public PageResponse<AssessmentTestProfessor> getAssessmentTests(PageInfoRequest request) {
    Pageable pageable = PageRequest.of(request.getPageIndex(), request.getPageSize());

    Page<AssessmentTestEntity> assessmentTestEntityPage =
        assessmentTestEntityRepository.findAll(pageable);

    List<AssessmentTestProfessor> assessmentTests =
        assessmentTestMapper.mapAssessmentTestEntitiesToAssessmentTestsProfessor(
            assessmentTestEntityPage.getContent());

    return PageResponse.<AssessmentTestProfessor>builder()
        .rows(assessmentTests)
        .totalCount(assessmentTestEntityPage.getTotalElements())
        .build();
  }

  public List<AssessmentTestProfessor> getAssessmentTestsForKS(Integer ksId) {

    List<AssessmentTestEntity> assessmentTestEntities =
        assessmentTestEntityRepository.findAllByKnowledgeSpaceId(ksId);

    return assessmentTestMapper.mapAssessmentTestEntitiesToAssessmentTestsProfessor(
        assessmentTestEntities);
  }

  private List<ProblemEntity> getProblemsForKS(Integer ksId) {
    return ksProblemEntityRepository.findAllByKnowledgeSpaceId(ksId).stream()
        .map(KnowledgeSpaceProblemEntity::getProblem)
        .toList();
  }

  //  private void generateGraph(Graph g, HashMap<Long, Node> nodes, String edgeStr) {
  //    String node1_id = edgeStr.split("\\.")[0];
  //    String node2_id = edgeStr.split("\\.")[1];
  //
  //    Node node1 = nodes.get(Long.parseLong(node1_id));
  //    Node node2 = nodes.get(Long.parseLong(node2_id));
  //
  //    if (!g.getNodes().contains(nodes.get(node1.getId())))
  // g.getNodes().add(nodes.get(node1.getId()));
  //    if (!g.getNodes().contains(nodes.get(node2.getId())))
  // g.getNodes().add(nodes.get(node2.getId()));
  //
  //    g.addEdge(node1, node2);
  //  }
}
