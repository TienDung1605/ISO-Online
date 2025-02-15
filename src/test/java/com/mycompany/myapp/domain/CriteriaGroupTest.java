package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.CriteriaGroupTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CriteriaGroupTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CriteriaGroup.class);
        CriteriaGroup criteriaGroup1 = getCriteriaGroupSample1();
        CriteriaGroup criteriaGroup2 = new CriteriaGroup();
        assertThat(criteriaGroup1).isNotEqualTo(criteriaGroup2);

        criteriaGroup2.setId(criteriaGroup1.getId());
        assertThat(criteriaGroup1).isEqualTo(criteriaGroup2);

        criteriaGroup2 = getCriteriaGroupSample2();
        assertThat(criteriaGroup1).isNotEqualTo(criteriaGroup2);
    }
}
