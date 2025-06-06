package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.AssertUtils.zonedDataTimeSameInstant;
import static org.assertj.core.api.Assertions.assertThat;

public class ScriptAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertScriptAllPropertiesEquals(Script expected, Script actual) {
        assertScriptAutoGeneratedPropertiesEquals(expected, actual);
        assertScriptAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertScriptAllUpdatablePropertiesEquals(Script expected, Script actual) {
        assertScriptUpdatableFieldsEquals(expected, actual);
        assertScriptUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertScriptAutoGeneratedPropertiesEquals(Script expected, Script actual) {
        assertThat(expected)
            .as("Verify Script auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertScriptUpdatableFieldsEquals(Script expected, Script actual) {
        assertThat(expected)
            .as("Verify Script relevant properties")
            .satisfies(e -> assertThat(e.getScriptCode()).as("check scriptCode").isEqualTo(actual.getScriptCode()))
            .satisfies(e -> assertThat(e.getScriptName()).as("check scriptName").isEqualTo(actual.getScriptName()))
            .satisfies(
                e ->
                    assertThat(e.getTimeStart())
                        .as("check timeStart")
                        .usingComparator(zonedDataTimeSameInstant)
                        .isEqualTo(actual.getTimeStart())
            )
            .satisfies(
                e -> assertThat(e.getTimeEnd()).as("check timeEnd").usingComparator(zonedDataTimeSameInstant).isEqualTo(actual.getTimeEnd())
            )
            .satisfies(e -> assertThat(e.getStatus()).as("check status").isEqualTo(actual.getStatus()))
            .satisfies(e -> assertThat(e.getUpdateBy()).as("check updateBy").isEqualTo(actual.getUpdateBy()))
            .satisfies(e -> assertThat(e.getFrequency()).as("check frequency").isEqualTo(actual.getFrequency()))
            .satisfies(
                e ->
                    assertThat(e.getSubjectOfAssetmentPlan())
                        .as("check subjectOfAssetmentPlan")
                        .isEqualTo(actual.getSubjectOfAssetmentPlan())
            )
            .satisfies(e -> assertThat(e.getCodePlan()).as("check codePlan").isEqualTo(actual.getCodePlan()))
            .satisfies(e -> assertThat(e.getNamePlan()).as("check namePlan").isEqualTo(actual.getNamePlan()))
            .satisfies(
                e ->
                    assertThat(e.getTimeCheck())
                        .as("check timeCheck")
                        .usingComparator(zonedDataTimeSameInstant)
                        .isEqualTo(actual.getTimeCheck())
            )
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
            .satisfies(e -> assertThat(e.getParticipant()).as("check participant").isEqualTo(actual.getParticipant()));
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertScriptUpdatableRelationshipsEquals(Script expected, Script actual) {}
}
