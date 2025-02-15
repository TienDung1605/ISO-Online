package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ReportCriteriaTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReportCriteriaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ReportCriteria.class);
        ReportCriteria reportCriteria1 = getReportCriteriaSample1();
        ReportCriteria reportCriteria2 = new ReportCriteria();
        assertThat(reportCriteria1).isNotEqualTo(reportCriteria2);

        reportCriteria2.setId(reportCriteria1.getId());
        assertThat(reportCriteria1).isEqualTo(reportCriteria2);

        reportCriteria2 = getReportCriteriaSample2();
        assertThat(reportCriteria1).isNotEqualTo(reportCriteria2);
    }
}
