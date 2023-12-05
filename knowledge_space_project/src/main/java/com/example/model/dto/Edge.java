package com.example.model.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class Edge {

  private Integer id;
  private Integer sourceId;
  private Integer destinationId;
}
