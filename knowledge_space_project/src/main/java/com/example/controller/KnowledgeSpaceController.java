package com.example.controller;

import com.example.model.dto.AssessmentTestProfessor;
import com.example.model.dto.Edge;
import com.example.model.dto.KnowledgeSpace;
import com.example.model.dto.Problem;
import com.example.model.dto.Report;
import com.example.model.entity.KnowledgeSpaceEntity;
import com.example.model.paging.PageInfoRequest;
import com.example.model.paging.PageResponse;
import com.example.model.request.assesmentTest.CreateAssessmentTestRequest;
import com.example.model.response.auth.KnowledgeSpaceGraphData;
import com.example.service.AssessmentTestService;
import com.example.service.KnowledgeSpaceService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ks")
@RequiredArgsConstructor
public class KnowledgeSpaceController {

  private final KnowledgeSpaceService knowledgeSpaceService;
  private final AssessmentTestService assessmentTestService;

  @GetMapping
  public ResponseEntity<PageResponse<KnowledgeSpace>> getPaginatedKnowledgeSpaces(
      PageInfoRequest request) {
    return ResponseEntity.ok(knowledgeSpaceService.getPaginatedKnowledgeSpaces(request));
  }

  @GetMapping("/all")
  public ResponseEntity<List<KnowledgeSpace>> getKnowledgeSpaces() {
    return ResponseEntity.ok(knowledgeSpaceService.getKnowledgeSpaces());
  }

  @GetMapping("/{id}")
  public ResponseEntity<KnowledgeSpaceGraphData> getKSGraphData(@PathVariable Integer id) {
    return ResponseEntity.ok(knowledgeSpaceService.getKSGraphData(id));
  }

  @GetMapping("/{id}/problems")
  public ResponseEntity<List<Problem>> getKSProblems(@PathVariable Integer id) {
    return ResponseEntity.ok(knowledgeSpaceService.getKSProblems(id));
  }

  @PostMapping("/{id}/problems")
  public ResponseEntity<Problem> createProblem(
      @PathVariable("id") Integer ksId, @RequestBody @Valid Problem problem) {
    return ResponseEntity.ok(knowledgeSpaceService.createProblem(ksId, problem));
  }

  @PutMapping("/problems")
  public ResponseEntity<Problem> updateProblem(@RequestBody @Valid Problem problem) {
    return ResponseEntity.ok(knowledgeSpaceService.updateProblem(problem));
  }

  @DeleteMapping("/problems/{id}")
  public ResponseEntity<Void> deleteProblem(@PathVariable("id") Integer problemId) {
    knowledgeSpaceService.deleteProblem(problemId);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/edges")
  public ResponseEntity<Edge> createEdge(@RequestBody @Valid Edge edge) {
    return ResponseEntity.ok(knowledgeSpaceService.createEdge(edge));
  }

  @DeleteMapping("/edges")
  public ResponseEntity<Void> deleteEdge(
      @RequestParam Integer sourceId, @RequestParam Integer destinationId) {
    knowledgeSpaceService.deleteEdge(sourceId, destinationId);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/{id}/assessment_tests")
  public ResponseEntity<Void> createAssessmentTest(
      @PathVariable Integer id,
      @RequestBody CreateAssessmentTestRequest createAssessmentTestRequest) {
    knowledgeSpaceService.createAssessmentTest(id, createAssessmentTestRequest);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/assessment_tests")
  public ResponseEntity<PageResponse<AssessmentTestProfessor>> getAssessmentTests(
      PageInfoRequest request) {
    return ResponseEntity.ok(knowledgeSpaceService.getAssessmentTests(request));
  }

  @GetMapping("/{id}/assessment_tests")
  public ResponseEntity<List<AssessmentTestProfessor>> getAssessmentTestsForKS(
      @PathVariable Integer id) {
    return ResponseEntity.ok(knowledgeSpaceService.getAssessmentTestsForKS(id));
  }

  @GetMapping("/real_ks/{assessment_test_id}")
  public ResponseEntity<KnowledgeSpaceGraphData> getRealKnowledgeSpace(
      @PathVariable Integer assessment_test_id) {

    return ResponseEntity.ok(
        assessmentTestService.getRealKnowledgeSpaceDTO(assessment_test_id, null));
  }

  @GetMapping("/real_ks/generate/{assessment_test_id}")
  public ResponseEntity<KnowledgeSpaceGraphData> generateRealKnowledgeSpace(
      @PathVariable Integer assessment_test_id) {

    assessmentTestService.generateRealKnowledgeSpace(assessment_test_id);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/statistics/{assessment_test_id}")
  public ResponseEntity<List<Report>> getStatistics(@PathVariable Integer assessment_test_id) {
    return ResponseEntity.ok(assessmentTestService.getStatistics(assessment_test_id));
  }
}
