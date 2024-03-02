package com.example.model.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class KnowledgeSpace {

   private Integer id;
   private String name;
   private Boolean isReal;
   private String assessmentTest;
}
