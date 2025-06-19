package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;

@Entity
@Table(name = "remediation_plan_detail")
public class RemediationPlanDetail implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "remediation_plan_id")
    private Long remediationPlanId;

    @Column(name = "criterial_name")
    private String criterialName;

    @Column(name = "criterial_group_name")
    private String criterialGroupName;

    @Column(name = "convert_score")
    private String convertScore;

    @Column(name = "note")
    private String note;

    @Column(name = "solution")
    private String solution;

    @Column(name = "status")
    private String status;

    @Column(name = "plan_time_complete")
    private ZonedDateTime planTimeComplete;

    @Column(name = "user_handle")
    private String userHandle;

    @Column(name = "detail")
    private String detail;

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @Column(name = "created_by")
    private String createdBy;

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

    public String getUserHandle() {
        return userHandle;
    }

    public void setUserHandle(String userHandle) {
        this.userHandle = userHandle;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public ZonedDateTime getPlanTimeComplete() {
        return planTimeComplete;
    }

    public void setPlanTimeComplete(ZonedDateTime planTimeComplete) {
        this.planTimeComplete = planTimeComplete;
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
}
