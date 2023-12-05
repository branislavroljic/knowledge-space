package com.example.model.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Problem {
  private Integer id;

  private Integer knowledgeSpaceId;

  private String name;

  private Double positionX;

  private Double positionY;
}
