package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A Script.
 */
@Entity
@Table(name = "script")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Script implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "script_code")
    private String scriptCode;

    @Column(name = "script_name")
    private String scriptName;

    @Column(name = "time_start")
    private ZonedDateTime timeStart;

    @Column(name = "time_end")
    private ZonedDateTime timeEnd;

    @Column(name = "status")
    private String status;

    @Column(name = "update_by")
    private String updateBy;

    @Column(name = "frequency")
    private String frequency;

    @Column(name = "subject_of_assetment_plan")
    private String subjectOfAssetmentPlan;

    @Column(name = "code_plan")
    private String codePlan;

    @Column(name = "name_plan")
    private String namePlan;

    @Column(name = "time_check")
    private ZonedDateTime timeCheck;

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @Column(name = "participant")
    private String participant;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Script id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getScriptCode() {
        return this.scriptCode;
    }

    public Script scriptCode(String scriptCode) {
        this.setScriptCode(scriptCode);
        return this;
    }

    public void setScriptCode(String scriptCode) {
        this.scriptCode = scriptCode;
    }

    public String getScriptName() {
        return this.scriptName;
    }

    public Script scriptName(String scriptName) {
        this.setScriptName(scriptName);
        return this;
    }

    public void setScriptName(String scriptName) {
        this.scriptName = scriptName;
    }

    public ZonedDateTime getTimeStart() {
        return this.timeStart;
    }

    public Script timeStart(ZonedDateTime timeStart) {
        this.setTimeStart(timeStart);
        return this;
    }

    public void setTimeStart(ZonedDateTime timeStart) {
        this.timeStart = timeStart;
    }

    public ZonedDateTime getTimeEnd() {
        return this.timeEnd;
    }

    public Script timeEnd(ZonedDateTime timeEnd) {
        this.setTimeEnd(timeEnd);
        return this;
    }

    public void setTimeEnd(ZonedDateTime timeEnd) {
        this.timeEnd = timeEnd;
    }

    public String getStatus() {
        return this.status;
    }

    public Script status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUpdateBy() {
        return this.updateBy;
    }

    public Script updateBy(String updateBy) {
        this.setUpdateBy(updateBy);
        return this;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public String getFrequency() {
        return this.frequency;
    }

    public Script frequency(String frequency) {
        this.setFrequency(frequency);
        return this;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public String getSubjectOfAssetmentPlan() {
        return this.subjectOfAssetmentPlan;
    }

    public Script subjectOfAssetmentPlan(String subjectOfAssetmentPlan) {
        this.setSubjectOfAssetmentPlan(subjectOfAssetmentPlan);
        return this;
    }

    public void setSubjectOfAssetmentPlan(String subjectOfAssetmentPlan) {
        this.subjectOfAssetmentPlan = subjectOfAssetmentPlan;
    }

    public String getCodePlan() {
        return this.codePlan;
    }

    public Script codePlan(String codePlan) {
        this.setCodePlan(codePlan);
        return this;
    }

    public void setCodePlan(String codePlan) {
        this.codePlan = codePlan;
    }

    public String getNamePlan() {
        return this.namePlan;
    }

    public Script namePlan(String namePlan) {
        this.setNamePlan(namePlan);
        return this;
    }

    public void setNamePlan(String namePlan) {
        this.namePlan = namePlan;
    }

    public ZonedDateTime getTimeCheck() {
        return this.timeCheck;
    }

    public Script timeCheck(ZonedDateTime timeCheck) {
        this.setTimeCheck(timeCheck);
        return this;
    }

    public void setTimeCheck(ZonedDateTime timeCheck) {
        this.timeCheck = timeCheck;
    }

    public ZonedDateTime getCreatedAt() {
        return this.createdAt;
    }

    public Script createdAt(ZonedDateTime createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ZonedDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    public Script updatedAt(ZonedDateTime updatedAt) {
        this.setUpdatedAt(updatedAt);
        return this;
    }

    public void setUpdatedAt(ZonedDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getParticipant() {
        return this.participant;
    }

    public Script participant(String participant) {
        this.setParticipant(participant);
        return this;
    }

    public void setParticipant(String participant) {
        this.participant = participant;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Script)) {
            return false;
        }
        return getId() != null && getId().equals(((Script) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Script{" +
            "id=" + getId() +
            ", scriptCode='" + getScriptCode() + "'" +
            ", scriptName='" + getScriptName() + "'" +
            ", timeStart='" + getTimeStart() + "'" +
            ", timeEnd='" + getTimeEnd() + "'" +
            ", status='" + getStatus() + "'" +
            ", updateBy='" + getUpdateBy() + "'" +
            ", frequency='" + getFrequency() + "'" +
            ", subjectOfAssetmentPlan='" + getSubjectOfAssetmentPlan() + "'" +
            ", codePlan='" + getCodePlan() + "'" +
            ", namePlan='" + getNamePlan() + "'" +
            ", timeCheck='" + getTimeCheck() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            ", participant='" + getParticipant() + "'" +
            "}";
    }
}
