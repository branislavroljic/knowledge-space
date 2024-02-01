package com.example.controller;

import com.example.model.dto.AssessmentTest;
import com.example.model.dto.Question;
import com.example.model.dto.Response;
import com.example.model.request.UserAnswerRequest;
import com.example.model.response.auth.KnowledgeSpaceGraphData;
import com.example.model.response.auth.UserTestResults;
import com.example.security.JwtUser;
import com.example.service.AssessmentTestService;
import com.example.service.KnowledgeSpaceService;
import com.example.service.QTIService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/assessment_tests")
@RequiredArgsConstructor
public class AssessmentTestController {

  private final AssessmentTestService assessmentTestService;
  private final QTIService qtiService;

  @GetMapping("/by_user")
  public ResponseEntity<List<AssessmentTest>> getAll(
      @AuthenticationPrincipal JwtUser loggedInUser) {
    return ResponseEntity.ok(assessmentTestService.getAll(loggedInUser));
  }

  @GetMapping("/{id}")
  public ResponseEntity<List<Question>> getAssessmentTestQuestions(@PathVariable Integer id) {
    return ResponseEntity.ok(assessmentTestService.getAssessmentTestQuestions(id, null));
  }

  @GetMapping("/{id}/real_ks")
  public ResponseEntity<KnowledgeSpaceGraphData> getRealStudentKs(
      @PathVariable Integer id, @AuthenticationPrincipal JwtUser loggedInUser) {
    return ResponseEntity.ok(assessmentTestService.getRealStudentKs(id, loggedInUser));
  }

  @PostMapping("/{id}")
  public ResponseEntity<KnowledgeSpaceGraphData> submitAssessmentTest(
      @PathVariable Integer id,
      @AuthenticationPrincipal JwtUser loggedInUser,
      @RequestBody List<UserAnswerRequest> answers) {

    return ResponseEntity.ok(assessmentTestService.submitAssessmentTest(id, loggedInUser, answers));
  }

  @GetMapping("/{id}/matrix")
  public ResponseEntity<Void> getMatrix(@PathVariable Integer id) {
    assessmentTestService.getRealKnowledgeSpace(id, null);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/{id}/imsqti")
  public ResponseEntity<byte[]> generateQti(@PathVariable Integer id) {
    return ResponseEntity.ok(qtiService.generateQTI(id));
  }
}
