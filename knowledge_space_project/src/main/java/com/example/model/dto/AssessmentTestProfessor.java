package com.example.model.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class AssessmentTestAdmin {
  private Integer id;
  private String name;
  private String knowledgeSpace;
}
