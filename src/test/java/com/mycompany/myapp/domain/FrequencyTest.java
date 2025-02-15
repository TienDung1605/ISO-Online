package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.FrequencyTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FrequencyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Frequency.class);
        Frequency frequency1 = getFrequencySample1();
        Frequency frequency2 = new Frequency();
        assertThat(frequency1).isNotEqualTo(frequency2);

        frequency2.setId(frequency1.getId());
        assertThat(frequency1).isEqualTo(frequency2);

        frequency2 = getFrequencySample2();
        assertThat(frequency1).isNotEqualTo(frequency2);
    }
}
