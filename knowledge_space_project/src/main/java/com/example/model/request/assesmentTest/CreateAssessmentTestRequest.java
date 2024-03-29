package com.example.model.request.assesmentTest;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class CreateAssessmentTestRequest {
  private String name;
  private List<Question> questions;
}
