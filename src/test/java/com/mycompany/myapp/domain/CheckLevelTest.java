package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.CheckLevelTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CheckLevelTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CheckLevel.class);
        CheckLevel checkLevel1 = getCheckLevelSample1();
        CheckLevel checkLevel2 = new CheckLevel();
        assertThat(checkLevel1).isNotEqualTo(checkLevel2);

        checkLevel2.setId(checkLevel1.getId());
        assertThat(checkLevel1).isEqualTo(checkLevel2);

        checkLevel2 = getCheckLevelSample2();
        assertThat(checkLevel1).isNotEqualTo(checkLevel2);
    }
}
