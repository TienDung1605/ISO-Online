package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AssertUtils.zonedDataTimeSameInstant;
import static org.assertj.core.api.Assertions.assertThat;

public class ReportTitleAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertReportTitleAllPropertiesEquals(ReportTitle expected, ReportTitle actual) {
        assertReportTitleAutoGeneratedPropertiesEquals(expected, actual);
        assertReportTitleAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertReportTitleAllUpdatablePropertiesEquals(ReportTitle expected, ReportTitle actual) {
        assertReportTitleUpdatableFieldsEquals(expected, actual);
        assertReportTitleUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertReportTitleAutoGeneratedPropertiesEquals(ReportTitle expected, ReportTitle actual) {
        assertThat(expected)
            .as("Verify ReportTitle auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertReportTitleUpdatableFieldsEquals(ReportTitle expected, ReportTitle actual) {
        assertThat(expected)
            .as("Verify ReportTitle relevant properties")
            .satisfies(e -> assertThat(e.getName()).as("check name").isEqualTo(actual.getName()))
            .satisfies(e -> assertThat(e.getSource()).as("check source").isEqualTo(actual.getSource()))
            .satisfies(e -> assertThat(e.getField()).as("check field").isEqualTo(actual.getField()))
            .satisfies(e -> assertThat(e.getDataType()).as("check dataType").isEqualTo(actual.getDataType()))
            .satisfies(e -> assertThat(e.getIndex()).as("check index").isEqualTo(actual.getIndex()))
            .satisfies(
                e ->
                    assertThat(e.getCreatedAt())
                        .as("check createdAt")
                        .usingComparator(zonedDataTimeSameInstant)
                        .isEqualTo(actual.getCreatedAt())
            )
            .satisfies(
                e ->
                    assertThat(e.getUpdatedAt())
                        .as("check updatedAt")
                        .usingComparator(zonedDataTimeSameInstant)
                        .isEqualTo(actual.getUpdatedAt())
            )
            .satisfies(e -> assertThat(e.getUpdateBy()).as("check updateBy").isEqualTo(actual.getUpdateBy()))
            .satisfies(e -> assertThat(e.getReportId()).as("check reportId").isEqualTo(actual.getReportId()));
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertReportTitleUpdatableRelationshipsEquals(ReportTitle expected, ReportTitle actual) {}
}
