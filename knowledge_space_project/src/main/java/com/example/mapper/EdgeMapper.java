package com.example.mapper;

import com.example.model.dto.Edge;
import com.example.model.entity.EdgeEntity;
import java.util.List;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface EdgeMapper {

  @BeanMapping(qualifiedByName = "edgeEntityToEdge")
  @Mapping(target = "sourceId", source = "sourceProblem.id")
  @Mapping(target = "destinationId", source = "destinationProblem.id")
  Edge mapEdgeEntityToEdge(EdgeEntity edgeEntity);

  @Named("edgeEntityToEdge")
  List<Edge> mapEdgeEntitiesToEdges(List<EdgeEntity> edgeEntityList);
}
