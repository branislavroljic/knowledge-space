package com.example.model.response.auth;

import com.example.model.dto.Edge;
import com.example.model.dto.Problem;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KnowledgeSpaceGraphData {

  List<Problem> nodes;
  List<Edge> edges;
}
