package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.PartsTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PartsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Parts.class);
        Parts parts1 = getPartsSample1();
        Parts parts2 = new Parts();
        assertThat(parts1).isNotEqualTo(parts2);

        parts2.setId(parts1.getId());
        assertThat(parts1).isEqualTo(parts2);

        parts2 = getPartsSample2();
        assertThat(parts1).isNotEqualTo(parts2);
    }
}
