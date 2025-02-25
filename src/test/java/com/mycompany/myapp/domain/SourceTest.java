package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.SourceTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SourceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Source.class);
        Source source1 = getSourceSample1();
        Source source2 = new Source();
        assertThat(source1).isNotEqualTo(source2);

        source2.setId(source1.getId());
        assertThat(source1).isEqualTo(source2);

        source2 = getSourceSample2();
        assertThat(source1).isNotEqualTo(source2);
    }
}
