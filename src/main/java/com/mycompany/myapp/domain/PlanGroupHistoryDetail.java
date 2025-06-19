package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;

@Entity
@Table(name = "plan_group_history_detail")
public class PlanGroupHistoryDetail implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "report_id")
    private Long reportId; // mã bbkt

    @Column(name = "report_name")
    private String reportName;

    @Column(name = "plan_group_history_id")
    private Long planGroupHistoryId;

    @Column(name = "criterial_name")
    private String criterialName;

    @Column(name = "criterial_group_name")
    private String criterialGroupName;

    @Column(name = "frequency")
    private String frequency;

    @Column(name = "convert_score")
    private String convertScore;

    @Column(name = "result")
    private String result;

    @Column(name = "image")
    private String image;

    @Column(name = "note")
    private String note;

    @Column(name = "status")
    private String status;

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

    public Long getReportId() {
        return reportId;
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

    public String getReportName() {
        return reportName;
    }

    public void setReportName(String reportName) {
        this.reportName = reportName;
    }

    public Long getPlanGroupHistoryId() {
        return planGroupHistoryId;
    }

    public void setPlanGroupHistoryId(Long planGroupHistoryId) {
        this.planGroupHistoryId = planGroupHistoryId;
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

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public String getConvertScore() {
        return convertScore;
    }

    public void setConvertScore(String convertScore) {
        this.convertScore = convertScore;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
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
