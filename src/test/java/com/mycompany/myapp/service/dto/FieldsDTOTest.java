package com.mycompany.myapp.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FieldsDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(FieldsDTO.class);
        FieldsDTO fieldsDTO1 = new FieldsDTO();
        fieldsDTO1.setId(1L);
        FieldsDTO fieldsDTO2 = new FieldsDTO();
        assertThat(fieldsDTO1).isNotEqualTo(fieldsDTO2);
        fieldsDTO2.setId(fieldsDTO1.getId());
        assertThat(fieldsDTO1).isEqualTo(fieldsDTO2);
        fieldsDTO2.setId(2L);
        assertThat(fieldsDTO1).isNotEqualTo(fieldsDTO2);
        fieldsDTO1.setId(null);
        assertThat(fieldsDTO1).isNotEqualTo(fieldsDTO2);
    }
}
