package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ConvertTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ConvertTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Convert.class);
        Convert convert1 = getConvertSample1();
        Convert convert2 = new Convert();
        assertThat(convert1).isNotEqualTo(convert2);

        convert2.setId(convert1.getId());
        assertThat(convert1).isEqualTo(convert2);

        convert2 = getConvertSample2();
        assertThat(convert1).isNotEqualTo(convert2);
    }
}
