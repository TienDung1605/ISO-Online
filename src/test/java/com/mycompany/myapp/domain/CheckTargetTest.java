package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.CheckTargetTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CheckTargetTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CheckTarget.class);
        CheckTarget checkTarget1 = getCheckTargetSample1();
        CheckTarget checkTarget2 = new CheckTarget();
        assertThat(checkTarget1).isNotEqualTo(checkTarget2);

        checkTarget2.setId(checkTarget1.getId());
        assertThat(checkTarget1).isEqualTo(checkTarget2);

        checkTarget2 = getCheckTargetSample2();
        assertThat(checkTarget1).isNotEqualTo(checkTarget2);
    }
}
