package com.mycompany.myapp.service.dto;

import java.time.ZonedDateTime;
import java.util.List;

public class RemediationPlanDetailDTO {

    private Long id;
    private Long remediationPlanId;
    private String criterialName;
    private String criterialGroupName;
    private String convertScore;
    private String note;
    private String solution;
    private String status;
    private ZonedDateTime planTimeComplete;
    private String userHandle;
    private String detail;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
    private String createdBy;

    // Key 'recheckDetails' chứa arr các recheck_remediation_plan_detail
    private List<RecheckRemediationPlanDetailDTO> recheckDetails;

    // Constructors
    public RemediationPlanDetailDTO() {}

    public RemediationPlanDetailDTO(
        Long id,
        Long remediationPlanId,
        String criterialName,
        String criterialGroupName,
        String convertScore,
        String note,
        String solution,
        String status,
        ZonedDateTime planTimeComplete,
        String detail,
        String userHandle,
        ZonedDateTime createdAt,
        ZonedDateTime updatedAt,
        String createdBy,
        List<RecheckRemediationPlanDetailDTO> recheckDetails
    ) {
        this.id = id;
        this.remediationPlanId = remediationPlanId;
        this.criterialName = criterialName;
        this.criterialGroupName = criterialGroupName;
        this.convertScore = convertScore;
        this.note = note;
        this.solution = solution;
        this.status = status;
        this.planTimeComplete = planTimeComplete;
        this.detail = detail;
        this.userHandle = userHandle;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.createdBy = createdBy;
        this.recheckDetails = recheckDetails;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRemediationPlanId() {
        return remediationPlanId;
    }

    public void setRemediationPlanId(Long remediationPlanId) {
        this.remediationPlanId = remediationPlanId;
    }

    public String getCriterialName() {
        return criterialName;
    }

    public void setCriterialName(String criterialName) {
        this.criterialName = criterialName;
    }

    public String getCriterialGroupName() {
        return criterialGroupName;
    }

    public void setCriterialGroupName(String criterialGroupName) {
        this.criterialGroupName = criterialGroupName;
    }

    public String getConvertScore() {
        return convertScore;
    }

    public void setConvertScore(String convertScore) {
        this.convertScore = convertScore;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getSolution() {
        return solution;
    }

    public void setSolution(String solution) {
        this.solution = solution;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public ZonedDateTime getPlanTimeComplete() {
        return planTimeComplete;
    }

    public void setPlanTimeComplete(ZonedDateTime planTimeComplete) {
        this.planTimeComplete = planTimeComplete;
    }

    public String getUserHandle() {
        return userHandle;
    }

    public void setUserHandle(String userHandle) {
        this.userHandle = userHandle;
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

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getDetail() {
        return detail;
    }

    public List<RecheckRemediationPlanDetailDTO> getRecheckDetails() {
        return recheckDetails;
    }

    public void setRecheckDetails(List<RecheckRemediationPlanDetailDTO> recheckDetails) {
        this.recheckDetails = recheckDetails;
    }
}
