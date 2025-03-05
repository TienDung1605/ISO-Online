package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Fields;
import com.mycompany.myapp.service.dto.FieldsDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Fields} and its DTO {@link FieldsDTO}.
 */
@Mapper(componentModel = "spring")
public interface FieldsMapper extends EntityMapper<FieldsDTO, Fields> {}
