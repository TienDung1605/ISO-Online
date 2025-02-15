package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.SampleReportCriteriaTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SampleReportCriteriaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SampleReportCriteria.class);
        SampleReportCriteria sampleReportCriteria1 = getSampleReportCriteriaSample1();
        SampleReportCriteria sampleReportCriteria2 = new SampleReportCriteria();
        assertThat(sampleReportCriteria1).isNotEqualTo(sampleReportCriteria2);

        sampleReportCriteria2.setId(sampleReportCriteria1.getId());
        assertThat(sampleReportCriteria1).isEqualTo(sampleReportCriteria2);

        sampleReportCriteria2 = getSampleReportCriteriaSample2();
        assertThat(sampleReportCriteria1).isNotEqualTo(sampleReportCriteria2);
    }
}
