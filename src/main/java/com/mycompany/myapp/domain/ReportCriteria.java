package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A ReportCriteria.
 */
@Entity
@Table(name = "report_criteria")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ReportCriteria implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "criteria_name")
    private String criteriaName;

    @Column(name = "criteria_group_name")
    private String criteriaGroupName;

    @Column(name = "criteria_id")
    private Long criteriaId;

    @Column(name = "criteria_group_id")
    private Long criteriaGroupId;

    @Column(name = "status")
    private String status;

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @Column(name = "update_by")
    private String updateBy;

    @Column(name = "frequency")
    private String frequency;

    @Column(name = "report_id")
    private Long reportId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ReportCriteria id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCriteriaName() {
        return this.criteriaName;
    }

    public ReportCriteria criteriaName(String criteriaName) {
        this.setCriteriaName(criteriaName);
        return this;
    }

    public void setCriteriaName(String criteriaName) {
        this.criteriaName = criteriaName;
    }

    public String getCriteriaGroupName() {
        return this.criteriaGroupName;
    }

    public ReportCriteria criteriaGroupName(String criteriaGroupName) {
        this.setCriteriaGroupName(criteriaGroupName);
        return this;
    }

    public void setCriteriaGroupName(String criteriaGroupName) {
        this.criteriaGroupName = criteriaGroupName;
    }

    public Long getCriteriaId() {
        return this.criteriaId;
    }

    public ReportCriteria criteriaId(Long criteriaId) {
        this.setCriteriaId(criteriaId);
        return this;
    }

    public void setCriteriaId(Long criteriaId) {
        this.criteriaId = criteriaId;
    }

    public Long getCriteriaGroupId() {
        return this.criteriaGroupId;
    }

    public ReportCriteria criteriaGroupId(Long criteriaGroupId) {
        this.setCriteriaGroupId(criteriaGroupId);
        return this;
    }

    public void setCriteriaGroupId(Long criteriaGroupId) {
        this.criteriaGroupId = criteriaGroupId;
    }

    public String getStatus() {
        return this.status;
    }

    public ReportCriteria status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public ZonedDateTime getCreatedAt() {
        return this.createdAt;
    }

    public ReportCriteria createdAt(ZonedDateTime createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ZonedDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    public ReportCriteria updatedAt(ZonedDateTime updatedAt) {
        this.setUpdatedAt(updatedAt);
        return this;
    }

    public void setUpdatedAt(ZonedDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUpdateBy() {
        return this.updateBy;
    }

    public ReportCriteria updateBy(String updateBy) {
        this.setUpdateBy(updateBy);
        return this;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public String getFrequency() {
        return this.frequency;
    }

    public ReportCriteria frequency(String frequency) {
        this.setFrequency(frequency);
        return this;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public Long getReportId() {
        return this.reportId;
    }

    public ReportCriteria reportId(Long reportId) {
        this.setReportId(reportId);
        return this;
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ReportCriteria)) {
            return false;
        }
        return getId() != null && getId().equals(((ReportCriteria) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ReportCriteria{" +
            "id=" + getId() +
            ", criteriaName='" + getCriteriaName() + "'" +
            ", criteriaGroupName='" + getCriteriaGroupName() + "'" +
            ", criteriaId=" + getCriteriaId() +
            ", criteriaGroupId=" + getCriteriaGroupId() +
            ", status='" + getStatus() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            ", updateBy='" + getUpdateBy() + "'" +
            ", frequency='" + getFrequency() + "'" +
            ", reportId=" + getReportId() +
            "}";
    }
}
