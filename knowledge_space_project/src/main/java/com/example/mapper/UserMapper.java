package com.example.mapper;

import com.example.model.dto.User;
import com.example.model.entity.UserEntity;
import com.example.model.response.auth.LoginResponse;
import com.example.security.JwtUser;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(
    componentModel = "spring")
public abstract class UserMapper {


  @BeanMapping(qualifiedByName = "userEntityToUser")
  public abstract User mapUserEntityToUser(UserEntity userEntity);

  public abstract JwtUser mapUserEntityToJwtUser(UserEntity userEntity);

  @BeanMapping(
      qualifiedByName = "userEntityToLoginResponse",
      nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  public abstract LoginResponse mapUserEntityToLoginResponse(UserEntity userEntity);

}
