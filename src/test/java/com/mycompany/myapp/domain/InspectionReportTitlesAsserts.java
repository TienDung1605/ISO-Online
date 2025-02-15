package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AssertUtils.zonedDataTimeSameInstant;
import static org.assertj.core.api.Assertions.assertThat;

public class InspectionReportTitlesAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertInspectionReportTitlesAllPropertiesEquals(InspectionReportTitles expected, InspectionReportTitles actual) {
        assertInspectionReportTitlesAutoGeneratedPropertiesEquals(expected, actual);
        assertInspectionReportTitlesAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertInspectionReportTitlesAllUpdatablePropertiesEquals(
        InspectionReportTitles expected,
        InspectionReportTitles actual
    ) {
        assertInspectionReportTitlesUpdatableFieldsEquals(expected, actual);
        assertInspectionReportTitlesUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertInspectionReportTitlesAutoGeneratedPropertiesEquals(
        InspectionReportTitles expected,
        InspectionReportTitles actual
    ) {
        assertThat(expected)
            .as("Verify InspectionReportTitles auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertInspectionReportTitlesUpdatableFieldsEquals(InspectionReportTitles expected, InspectionReportTitles actual) {
        assertThat(expected)
            .as("Verify InspectionReportTitles relevant properties")
            .satisfies(e -> assertThat(e.getNameTitle()).as("check nameTitle").isEqualTo(actual.getNameTitle()))
            .satisfies(e -> assertThat(e.getSource()).as("check source").isEqualTo(actual.getSource()))
            .satisfies(e -> assertThat(e.getField()).as("check field").isEqualTo(actual.getField()))
            .satisfies(e -> assertThat(e.getDataType()).as("check dataType").isEqualTo(actual.getDataType()))
            .satisfies(
                e ->
                    assertThat(e.getTimeCreate())
                        .as("check timeCreate")
                        .usingComparator(zonedDataTimeSameInstant)
                        .isEqualTo(actual.getTimeCreate())
            )
            .satisfies(
                e ->
                    assertThat(e.getTimeUpdate())
                        .as("check timeUpdate")
                        .usingComparator(zonedDataTimeSameInstant)
                        .isEqualTo(actual.getTimeUpdate())
            )
            .satisfies(e -> assertThat(e.getSampleReportId()).as("check sampleReportId").isEqualTo(actual.getSampleReportId()));
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertInspectionReportTitlesUpdatableRelationshipsEquals(
        InspectionReportTitles expected,
        InspectionReportTitles actual
    ) {}
}
