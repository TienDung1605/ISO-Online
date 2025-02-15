package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ReportTypeTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReportTypeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ReportType.class);
        ReportType reportType1 = getReportTypeSample1();
        ReportType reportType2 = new ReportType();
        assertThat(reportType1).isNotEqualTo(reportType2);

        reportType2.setId(reportType1.getId());
        assertThat(reportType1).isEqualTo(reportType2);

        reportType2 = getReportTypeSample2();
        assertThat(reportType1).isNotEqualTo(reportType2);
    }
}
