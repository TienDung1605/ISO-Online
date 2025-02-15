package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.InspectionReportTitlesTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class InspectionReportTitlesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(InspectionReportTitles.class);
        InspectionReportTitles inspectionReportTitles1 = getInspectionReportTitlesSample1();
        InspectionReportTitles inspectionReportTitles2 = new InspectionReportTitles();
        assertThat(inspectionReportTitles1).isNotEqualTo(inspectionReportTitles2);

        inspectionReportTitles2.setId(inspectionReportTitles1.getId());
        assertThat(inspectionReportTitles1).isEqualTo(inspectionReportTitles2);

        inspectionReportTitles2 = getInspectionReportTitlesSample2();
        assertThat(inspectionReportTitles1).isNotEqualTo(inspectionReportTitles2);
    }
}
