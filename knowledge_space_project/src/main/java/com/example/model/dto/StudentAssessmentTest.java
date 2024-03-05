package com.example.model.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentAssessmentTest {

  private Integer id;
  private String email;
  private Integer numOfCorrectAnswers;
  private Integer totalNumOfAnswers;
}
