package com.example.service;

import com.example.mapper.EdgeMapper;
import com.example.mapper.ProblemMapper;
import com.example.model.dto.KnowledgeSpaceGraph;
import com.example.model.entity.EdgeEntity;
import com.example.model.entity.ProblemEntity;
import com.example.model.response.auth.KnowledgeSpaceGraphData;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class KSFlaskService {

  private final WebClient webClient;

  public Mono<int[][]> getIITAImplications(int[][] matrix) {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_JSON);

    return webClient
        .post()
        .uri("/iita")
        .contentType(MediaType.APPLICATION_JSON)
        .body(BodyInserters.fromValue(matrix))
        .retrieve()
        .bodyToMono(int[][].class);
  }

  public KnowledgeSpaceGraph constructRealKnowledgeSpace(
      int[][] iitaResult, List<ProblemEntity> sortedProblems) {
    Set<ProblemEntity> calculatedNodes = new HashSet<>();
    List<EdgeEntity> calculatedEdges = new ArrayList<>();
    int counter = 0;
    for (int[] implications : iitaResult) {
      ProblemEntity sourceNode = sortedProblems.get(implications[0]);
      ProblemEntity destNode = sortedProblems.get(implications[1]);
      calculatedNodes.add(sourceNode);
      calculatedNodes.add(destNode);

      EdgeEntity iitaEdge = new EdgeEntity();
      iitaEdge.setId(counter++);
      iitaEdge.setSourceProblem(sourceNode);
      iitaEdge.setDestinationProblem(destNode);
      Optional<EdgeEntity> sameNodesEdge =
          calculatedEdges.stream()
              .filter(
                  e ->
                      e.getSourceProblem().equals(destNode)
                          && e.getDestinationProblem().equals(sourceNode))
              .findFirst();

      if (sameNodesEdge.isPresent()) calculatedEdges.remove(sameNodesEdge.get());
      else calculatedEdges.add(iitaEdge);
    }

    //    return KnowledgeSpaceGraphData.builder()
    //        .nodes(problemMapper.mapProblemEntitiesToProblems(new ArrayList<>(calculatedNodes)))
    //        .edges(edgeMapper.mapEdgeEntitiesToEdges(calculatedEdges))
    //        .build();
    return KnowledgeSpaceGraph.builder()
        .nodes(new ArrayList<>(calculatedNodes))
        .edges(calculatedEdges)
        .build();
  }
}
