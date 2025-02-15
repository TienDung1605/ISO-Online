package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ReportTitleTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ReportTitleTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ReportTitle.class);
        ReportTitle reportTitle1 = getReportTitleSample1();
        ReportTitle reportTitle2 = new ReportTitle();
        assertThat(reportTitle1).isNotEqualTo(reportTitle2);

        reportTitle2.setId(reportTitle1.getId());
        assertThat(reportTitle1).isEqualTo(reportTitle2);

        reportTitle2 = getReportTitleSample2();
        assertThat(reportTitle1).isNotEqualTo(reportTitle2);
    }
}
