package com.mycompany.myapp.service.mapper;

import static com.mycompany.myapp.domain.FieldsAsserts.*;
import static com.mycompany.myapp.domain.FieldsTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class FieldsMapperTest {

    private FieldsMapper fieldsMapper;

    @BeforeEach
    void setUp() {
        fieldsMapper = new FieldsMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getFieldsSample1();
        var actual = fieldsMapper.toEntity(fieldsMapper.toDto(expected));
        assertFieldsAllPropertiesEquals(expected, actual);
    }
}
