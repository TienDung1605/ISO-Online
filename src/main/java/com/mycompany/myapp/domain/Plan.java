package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A Plan.
 */
@Entity
@Table(name = "plan")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Plan implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "subject_of_assetment_plan")
    private String subjectOfAssetmentPlan;

    @Column(name = "frequency")
    private String frequency;

    @Column(name = "time_start")
    private ZonedDateTime timeStart;

    @Column(name = "time_end")
    private ZonedDateTime timeEnd;

    @Column(name = "status_plan")
    private String statusPlan;

    @Column(name = "test_object")
    private String testObject;

    @Column(name = "report_type_id")
    private Long reportTypeId;

    @Column(name = "report_type_name")
    private String reportTypeName;

    @Column(name = "number_of_check")
    private String numberOfCheck;

    @Column(name = "implementer")
    private String implementer;

    @Column(name = "paticipant")
    private String paticipant;

    @Column(name = "checker_group")
    private String checkerGroup;

    @Column(name = "checker_name")
    private String checkerName;

    @Column(name = "checker_group_id")
    private Long checkerGroupId;

    @Column(name = "checker_id")
    private Long checkerId;

    @Column(name = "gross")
    private String gross;

    @Column(name = "time_check")
    private String timeCheck;

    @Column(name = "name_result")
    private String nameResult;

    @Column(name = "script_id")
    private Long scriptId;

    @Column(name = "create_by")
    private String createBy;

    @Column(name = "status")
    private String status;

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @Column(name = "update_by")
    private String updateBy;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Plan id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public Plan code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return this.name;
    }

    public Plan name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSubjectOfAssetmentPlan() {
        return this.subjectOfAssetmentPlan;
    }

    public Plan subjectOfAssetmentPlan(String subjectOfAssetmentPlan) {
        this.setSubjectOfAssetmentPlan(subjectOfAssetmentPlan);
        return this;
    }

    public void setSubjectOfAssetmentPlan(String subjectOfAssetmentPlan) {
        this.subjectOfAssetmentPlan = subjectOfAssetmentPlan;
    }

    public String getFrequency() {
        return this.frequency;
    }

    public Plan frequency(String frequency) {
        this.setFrequency(frequency);
        return this;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public ZonedDateTime getTimeStart() {
        return this.timeStart;
    }

    public Plan timeStart(ZonedDateTime timeStart) {
        this.setTimeStart(timeStart);
        return this;
    }

    public void setTimeStart(ZonedDateTime timeStart) {
        this.timeStart = timeStart;
    }

    public ZonedDateTime getTimeEnd() {
        return this.timeEnd;
    }

    public Plan timeEnd(ZonedDateTime timeEnd) {
        this.setTimeEnd(timeEnd);
        return this;
    }

    public void setTimeEnd(ZonedDateTime timeEnd) {
        this.timeEnd = timeEnd;
    }

    public String getStatusPlan() {
        return this.statusPlan;
    }

    public Plan statusPlan(String statusPlan) {
        this.setStatusPlan(statusPlan);
        return this;
    }

    public void setStatusPlan(String statusPlan) {
        this.statusPlan = statusPlan;
    }

    public String getTestObject() {
        return this.testObject;
    }

    public Plan testObject(String testObject) {
        this.setTestObject(testObject);
        return this;
    }

    public void setTestObject(String testObject) {
        this.testObject = testObject;
    }

    public Long getReportTypeId() {
        return this.reportTypeId;
    }

    public Plan reportTypeId(Long reportTypeId) {
        this.setReportTypeId(reportTypeId);
        return this;
    }

    public void setReportTypeId(Long reportTypeId) {
        this.reportTypeId = reportTypeId;
    }

    public String getReportTypeName() {
        return this.reportTypeName;
    }

    public Plan reportTypeName(String reportTypeName) {
        this.setReportTypeName(reportTypeName);
        return this;
    }

    public void setReportTypeName(String reportTypeName) {
        this.reportTypeName = reportTypeName;
    }

    public String getNumberOfCheck() {
        return this.numberOfCheck;
    }

    public Plan numberOfCheck(String numberOfCheck) {
        this.setNumberOfCheck(numberOfCheck);
        return this;
    }

    public void setNumberOfCheck(String numberOfCheck) {
        this.numberOfCheck = numberOfCheck;
    }

    public String getImplementer() {
        return this.implementer;
    }

    public Plan implementer(String implementer) {
        this.setImplementer(implementer);
        return this;
    }

    public void setImplementer(String implementer) {
        this.implementer = implementer;
    }

    public String getPaticipant() {
        return this.paticipant;
    }

    public Plan paticipant(String paticipant) {
        this.setPaticipant(paticipant);
        return this;
    }

    public void setPaticipant(String paticipant) {
        this.paticipant = paticipant;
    }

    public String getCheckerGroup() {
        return this.checkerGroup;
    }

    public Plan checkerGroup(String checkerGroup) {
        this.setCheckerGroup(checkerGroup);
        return this;
    }

    public void setCheckerGroup(String checkerGroup) {
        this.checkerGroup = checkerGroup;
    }

    public String getCheckerName() {
        return this.checkerName;
    }

    public Plan checkerName(String checkerName) {
        this.setCheckerName(checkerName);
        return this;
    }

    public void setCheckerName(String checkerName) {
        this.checkerName = checkerName;
    }

    public Long getCheckerGroupId() {
        return this.checkerGroupId;
    }

    public Plan checkerGroupId(Long checkerGroupId) {
        this.setCheckerGroupId(checkerGroupId);
        return this;
    }

    public void setCheckerGroupId(Long checkerGroupId) {
        this.checkerGroupId = checkerGroupId;
    }

    public Long getCheckerId() {
        return this.checkerId;
    }

    public Plan checkerId(Long checkerId) {
        this.setCheckerId(checkerId);
        return this;
    }

    public void setCheckerId(Long checkerId) {
        this.checkerId = checkerId;
    }

    public String getGross() {
        return this.gross;
    }

    public Plan gross(String gross) {
        this.setGross(gross);
        return this;
    }

    public void setGross(String gross) {
        this.gross = gross;
    }

    public String getTimeCheck() {
        return this.timeCheck;
    }

    public Plan timeCheck(String timeCheck) {
        this.setTimeCheck(timeCheck);
        return this;
    }

    public void setTimeCheck(String timeCheck) {
        this.timeCheck = timeCheck;
    }

    public String getNameResult() {
        return this.nameResult;
    }

    public Plan nameResult(String nameResult) {
        this.setNameResult(nameResult);
        return this;
    }

    public void setNameResult(String nameResult) {
        this.nameResult = nameResult;
    }

    public Long getScriptId() {
        return this.scriptId;
    }

    public Plan scriptId(Long scriptId) {
        this.setScriptId(scriptId);
        return this;
    }

    public void setScriptId(Long scriptId) {
        this.scriptId = scriptId;
    }

    public String getCreateBy() {
        return this.createBy;
    }

    public Plan createBy(String createBy) {
        this.setCreateBy(createBy);
        return this;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public String getStatus() {
        return this.status;
    }

    public Plan status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public ZonedDateTime getCreatedAt() {
        return this.createdAt;
    }

    public Plan createdAt(ZonedDateTime createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ZonedDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    public Plan updatedAt(ZonedDateTime updatedAt) {
        this.setUpdatedAt(updatedAt);
        return this;
    }

    public void setUpdatedAt(ZonedDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUpdateBy() {
        return this.updateBy;
    }

    public Plan updateBy(String updateBy) {
        this.setUpdateBy(updateBy);
        return this;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Plan)) {
            return false;
        }
        return getId() != null && getId().equals(((Plan) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Plan{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", name='" + getName() + "'" +
            ", subjectOfAssetmentPlan='" + getSubjectOfAssetmentPlan() + "'" +
            ", frequency='" + getFrequency() + "'" +
            ", timeStart='" + getTimeStart() + "'" +
            ", timeEnd='" + getTimeEnd() + "'" +
            ", statusPlan='" + getStatusPlan() + "'" +
            ", testObject='" + getTestObject() + "'" +
            ", reportTypeId=" + getReportTypeId() +
            ", reportTypeName='" + getReportTypeName() + "'" +
            ", numberOfCheck='" + getNumberOfCheck() + "'" +
            ", implementer='" + getImplementer() + "'" +
            ", paticipant='" + getPaticipant() + "'" +
            ", checkerGroup='" + getCheckerGroup() + "'" +
            ", checkerName='" + getCheckerName() + "'" +
            ", checkerGroupId=" + getCheckerGroupId() +
            ", checkerId=" + getCheckerId() +
            ", gross='" + getGross() + "'" +
            ", timeCheck='" + getTimeCheck() + "'" +
            ", nameResult='" + getNameResult() + "'" +
            ", scriptId=" + getScriptId() +
            ", createBy='" + getCreateBy() + "'" +
            ", status='" + getStatus() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            ", updateBy='" + getUpdateBy() + "'" +
            "}";
    }
}
