package com.mycompany.myapp.service.dto;

import com.mycompany.myapp.domain.Report;
import jakarta.persistence.Column;
import java.time.ZonedDateTime;
import java.util.List;

public class PlanDetailDTO {

    private Long id;

    private String code;

    private String name;

    private String subjectOfAssetmentPlan;

    private String frequency;

    private ZonedDateTime timeStart;

    private ZonedDateTime timeEnd;

    private String statusPlan;

    private String testObject;

    private Long reportTypeId;

    private String reportTypeName;

    private String numberOfCheck;

    private String implementer;

    private String paticipant;

    private String checkerGroup;

    private String checkerName;

    private Long checkerGroupId;

    private Long checkerId;

    private String gross;

    private String timeCheck;

    private String nameResult;

    private Long scriptId;

    private String createBy;

    private String status;

    private ZonedDateTime createdAt;

    private ZonedDateTime updatedAt;

    private String updateBy;
    private List<Report> planDetail;

    public PlanDetailDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSubjectOfAssetmentPlan() {
        return subjectOfAssetmentPlan;
    }

    public void setSubjectOfAssetmentPlan(String subjectOfAssetmentPlan) {
        this.subjectOfAssetmentPlan = subjectOfAssetmentPlan;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public ZonedDateTime getTimeStart() {
        return timeStart;
    }

    public void setTimeStart(ZonedDateTime timeStart) {
        this.timeStart = timeStart;
    }

    public ZonedDateTime getTimeEnd() {
        return timeEnd;
    }

    public void setTimeEnd(ZonedDateTime timeEnd) {
        this.timeEnd = timeEnd;
    }

    public String getStatusPlan() {
        return statusPlan;
    }

    public void setStatusPlan(String statusPlan) {
        this.statusPlan = statusPlan;
    }

    public String getTestObject() {
        return testObject;
    }

    public void setTestObject(String testObject) {
        this.testObject = testObject;
    }

    public Long getReportTypeId() {
        return reportTypeId;
    }

    public void setReportTypeId(Long reportTypeId) {
        this.reportTypeId = reportTypeId;
    }

    public String getReportTypeName() {
        return reportTypeName;
    }

    public void setReportTypeName(String reportTypeName) {
        this.reportTypeName = reportTypeName;
    }

    public String getNumberOfCheck() {
        return numberOfCheck;
    }

    public void setNumberOfCheck(String numberOfCheck) {
        this.numberOfCheck = numberOfCheck;
    }

    public String getImplementer() {
        return implementer;
    }

    public void setImplementer(String implementer) {
        this.implementer = implementer;
    }

    public String getPaticipant() {
        return paticipant;
    }

    public void setPaticipant(String paticipant) {
        this.paticipant = paticipant;
    }

    public String getCheckerGroup() {
        return checkerGroup;
    }

    public void setCheckerGroup(String checkerGroup) {
        this.checkerGroup = checkerGroup;
    }

    public String getCheckerName() {
        return checkerName;
    }

    public void setCheckerName(String checkerName) {
        this.checkerName = checkerName;
    }

    public Long getCheckerGroupId() {
        return checkerGroupId;
    }

    public void setCheckerGroupId(Long checkerGroupId) {
        this.checkerGroupId = checkerGroupId;
    }

    public Long getCheckerId() {
        return checkerId;
    }

    public void setCheckerId(Long checkerId) {
        this.checkerId = checkerId;
    }

    public String getGross() {
        return gross;
    }

    public void setGross(String gross) {
        this.gross = gross;
    }

    public String getTimeCheck() {
        return timeCheck;
    }

    public void setTimeCheck(String timeCheck) {
        this.timeCheck = timeCheck;
    }

    public String getNameResult() {
        return nameResult;
    }

    public void setNameResult(String nameResult) {
        this.nameResult = nameResult;
    }

    public Long getScriptId() {
        return scriptId;
    }

    public void setScriptId(Long scriptId) {
        this.scriptId = scriptId;
    }

    public String getCreateBy() {
        return createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ZonedDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(ZonedDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUpdateBy() {
        return updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public List<Report> getPlanDetail() {
        return planDetail;
    }

    public void setPlanDetail(List<Report> planDetail) {
        this.planDetail = planDetail;
    }
}
