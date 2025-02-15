package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.CheckerGroupTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CheckerGroupTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CheckerGroup.class);
        CheckerGroup checkerGroup1 = getCheckerGroupSample1();
        CheckerGroup checkerGroup2 = new CheckerGroup();
        assertThat(checkerGroup1).isNotEqualTo(checkerGroup2);

        checkerGroup2.setId(checkerGroup1.getId());
        assertThat(checkerGroup1).isEqualTo(checkerGroup2);

        checkerGroup2 = getCheckerGroupSample2();
        assertThat(checkerGroup1).isNotEqualTo(checkerGroup2);
    }
}
