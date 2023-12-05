package com.example.model.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Response {

  private Integer id;

  private String title;

  private Integer questionId;

  private boolean correct;
}
