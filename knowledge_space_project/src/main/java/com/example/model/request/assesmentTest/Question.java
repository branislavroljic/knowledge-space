package com.example.model.request.assesmentTest;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Question {
  private Integer problemId;
  private String title;
  private List<Response> responses;
}
