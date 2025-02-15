package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.CriteriaTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CriteriaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Criteria.class);
        Criteria criteria1 = getCriteriaSample1();
        Criteria criteria2 = new Criteria();
        assertThat(criteria1).isNotEqualTo(criteria2);

        criteria2.setId(criteria1.getId());
        assertThat(criteria1).isEqualTo(criteria2);

        criteria2 = getCriteriaSample2();
        assertThat(criteria1).isNotEqualTo(criteria2);
    }
}
