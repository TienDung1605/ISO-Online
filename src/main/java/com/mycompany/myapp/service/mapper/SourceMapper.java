package com.mycompany.myapp.service.mapper;

import com.mycompany.myapp.domain.Source;
import com.mycompany.myapp.service.dto.SourceDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Source} and its DTO {@link SourceDTO}.
 */
@Mapper(componentModel = "spring")
public interface SourceMapper extends EntityMapper<SourceDTO, Source> {}
