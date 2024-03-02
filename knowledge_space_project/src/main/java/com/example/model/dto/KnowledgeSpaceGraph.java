package com.example.model.dto;

import com.example.model.entity.EdgeEntity;
import com.example.model.entity.ProblemEntity;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KnowledgeSpaceGraph {

  List<ProblemEntity> nodes;
  List<EdgeEntity> edges;
}