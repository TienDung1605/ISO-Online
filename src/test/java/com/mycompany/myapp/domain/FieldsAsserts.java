package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AssertUtils.zonedDataTimeSameInstant;
import static org.assertj.core.api.Assertions.assertThat;

public class FieldsAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertFieldsAllPropertiesEquals(Fields expected, Fields actual) {
        assertFieldsAutoGeneratedPropertiesEquals(expected, actual);
        assertFieldsAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertFieldsAllUpdatablePropertiesEquals(Fields expected, Fields actual) {
        assertFieldsUpdatableFieldsEquals(expected, actual);
        assertFieldsUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertFieldsAutoGeneratedPropertiesEquals(Fields expected, Fields actual) {
        assertThat(expected)
            .as("Verify Fields auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertFieldsUpdatableFieldsEquals(Fields expected, Fields actual) {
        assertThat(expected)
            .as("Verify Fields relevant properties")
            .satisfies(e -> assertThat(e.getName()).as("check name").isEqualTo(actual.getName()))
            .satisfies(e -> assertThat(e.getFieldName()).as("check fieldName").isEqualTo(actual.getFieldName()))
            .satisfies(e -> assertThat(e.getSourceId()).as("check sourceId").isEqualTo(actual.getSourceId()))
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
            .satisfies(e -> assertThat(e.getCreateBy()).as("check createBy").isEqualTo(actual.getCreateBy()));
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertFieldsUpdatableRelationshipsEquals(Fields expected, Fields actual) {}
}
