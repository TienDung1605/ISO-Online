package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.FieldsTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FieldsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Fields.class);
        Fields fields1 = getFieldsSample1();
        Fields fields2 = new Fields();
        assertThat(fields1).isNotEqualTo(fields2);

        fields2.setId(fields1.getId());
        assertThat(fields1).isEqualTo(fields2);

        fields2 = getFieldsSample2();
        assertThat(fields1).isNotEqualTo(fields2);
    }
}
