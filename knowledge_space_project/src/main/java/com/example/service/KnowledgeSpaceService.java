package com.example.service;

import com.example.mapper.EdgeMapper;
import com.example.mapper.ProblemMapper;
import com.example.model.dto.Edge;
import com.example.model.dto.Problem;
import com.example.model.entity.EdgeEntity;
import com.example.model.entity.KnowledgeSpaceEntity;
import com.example.model.entity.ProblemEntity;
import com.example.model.exception.ActionNotAllowedException;
import com.example.model.exception.NotFoundException;
import com.example.model.response.auth.KnowledgeSpaceGraphData;
import com.example.repositories.EdgeEntityRepository;
import com.example.repositories.KnowledgeSpaceEntityRepository;
import com.example.repositories.ProblemEntityRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

  public KnowledgeSpaceGraphData getKSGraphData(Integer id) {
    List<ProblemEntity> nodes = problemEntityRepository.findAllByKnowledgeSpaceId(id);
    List<EdgeEntity> edges =
        edgeEntityRepository.findBySourceProblemInOrDestinationProblemIn(nodes, nodes);

    return KnowledgeSpaceGraphData.builder()
        .nodes(problemMapper.mapProblemEntitiesToProblem(nodes))
        .edges(edgeMapper.mapEdgeEntitiesToEdges(edges))
        .build();
  }

  public Problem createProblem(Integer ksId, Problem problem) {
    KnowledgeSpaceEntity knowledgeSpaceEntity =
        knowledgeSpaceEntityRepository.findById(ksId).orElseThrow(NotFoundException::new);
    ProblemEntity problemEntity = problemMapper.mapProblemToProblemEntity(problem);
    problemEntity.setId(0);
    problemEntity.setKnowledgeSpace(knowledgeSpaceEntity);
    problemEntityRepository.save(problemEntity);
    return problemMapper.mapProblemEntityToProblem(problemEntity);
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
}
