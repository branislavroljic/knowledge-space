package com.example.model.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class AssessmentTest {
  private Integer id;
  private String name;
  private boolean isCompleted;
  private Integer numOfCorrectAnswers;
  private Integer totalNumOfAnswers;
}
