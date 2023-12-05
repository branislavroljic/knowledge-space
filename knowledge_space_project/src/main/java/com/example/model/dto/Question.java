package com.example.model.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class Question {

  private Integer id;

  private String title;

  private Integer problemId;

  private List<Response> responses;
}
