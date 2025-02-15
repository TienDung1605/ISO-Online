package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.SampleReportTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SampleReportTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SampleReport.class);
        SampleReport sampleReport1 = getSampleReportSample1();
        SampleReport sampleReport2 = new SampleReport();
        assertThat(sampleReport1).isNotEqualTo(sampleReport2);

        sampleReport2.setId(sampleReport1.getId());
        assertThat(sampleReport1).isEqualTo(sampleReport2);

        sampleReport2 = getSampleReportSample2();
        assertThat(sampleReport1).isNotEqualTo(sampleReport2);
    }
}
