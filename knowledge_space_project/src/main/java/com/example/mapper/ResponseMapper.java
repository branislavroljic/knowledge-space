package com.example.mapper;

import com.example.model.dto.Response;
import com.example.model.entity.ResponseEntity;
import java.util.List;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ResponseMapper {
  @BeanMapping(qualifiedByName = "ResponseEntityToResponse")
  @Mapping(target = "questionId", source = "responseEntity.question.id")
  Response mapResponseEntityToResponse(ResponseEntity responseEntity);

  @Named("ResponseEntityToResponse")
  List<Response> mapResponseEntitiesToResponse(List<ResponseEntity> responseEntityList);

  @BeanMapping(qualifiedByName = "ResponseToResponseEntity")
  ResponseEntity mapResponseToResponseEntity(
      com.example.model.request.assesmentTest.Response response);

  @Named("ResponseToResponseEntity")
  List<ResponseEntity> mapResponsesToResponseEntities(
      List<com.example.model.request.assesmentTest.Response> responses);
}
