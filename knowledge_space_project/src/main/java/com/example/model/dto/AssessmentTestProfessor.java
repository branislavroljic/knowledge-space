package com.example.model.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class AssessmentTestProfessor {
  private Integer id;
  private String name;
  private String knowledgeSpace;
}
