package com.example.controller;

import com.example.model.dto.AssessmentTest;
import com.example.model.dto.Question;
import com.example.model.dto.Response;
import com.example.security.JwtUser;
import com.example.service.AssessmentTestService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/assessment_tests")
@RequiredArgsConstructor
public class AssessmentTestController {

  private final AssessmentTestService assessmentTestService;

  @GetMapping
  public ResponseEntity<List<AssessmentTest>> getAll(
      @AuthenticationPrincipal JwtUser loggedInUser) {
    return ResponseEntity.ok(assessmentTestService.getAll(loggedInUser));
  }

  @GetMapping("/{id}")
  public ResponseEntity<List<Question>> getAssessmentTestQuestions(@PathVariable Integer id) {
    return ResponseEntity.ok(assessmentTestService.getAssessmentTestQuestions(id));
  }

//  @PostMapping
//  public Response<Void> saveUserAnswers()
}
