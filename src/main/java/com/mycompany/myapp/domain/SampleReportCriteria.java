package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A SampleReportCriteria.
 */
@Entity
@Table(name = "sample_report_criteria")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SampleReportCriteria implements Serializable {

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

    @Column(name = "sample_report_id")
    private Long sampleReportId;

    @Column(name = "detail")
    private String detail;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SampleReportCriteria id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCriteriaName() {
        return this.criteriaName;
    }

    public SampleReportCriteria criteriaName(String criteriaName) {
        this.setCriteriaName(criteriaName);
        return this;
    }

    public void setCriteriaName(String criteriaName) {
        this.criteriaName = criteriaName;
    }

    public String getCriteriaGroupName() {
        return this.criteriaGroupName;
    }

    public SampleReportCriteria criteriaGroupName(String criteriaGroupName) {
        this.setCriteriaGroupName(criteriaGroupName);
        return this;
    }

    public void setCriteriaGroupName(String criteriaGroupName) {
        this.criteriaGroupName = criteriaGroupName;
    }

    public Long getCriteriaId() {
        return this.criteriaId;
    }

    public SampleReportCriteria criteriaId(Long criteriaId) {
        this.setCriteriaId(criteriaId);
        return this;
    }

    public void setCriteriaId(Long criteriaId) {
        this.criteriaId = criteriaId;
    }

    public Long getCriteriaGroupId() {
        return this.criteriaGroupId;
    }

    public SampleReportCriteria criteriaGroupId(Long criteriaGroupId) {
        this.setCriteriaGroupId(criteriaGroupId);
        return this;
    }

    public void setCriteriaGroupId(Long criteriaGroupId) {
        this.criteriaGroupId = criteriaGroupId;
    }

    public String getStatus() {
        return this.status;
    }

    public SampleReportCriteria status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public ZonedDateTime getCreatedAt() {
        return this.createdAt;
    }

    public SampleReportCriteria createdAt(ZonedDateTime createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ZonedDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    public SampleReportCriteria updatedAt(ZonedDateTime updatedAt) {
        this.setUpdatedAt(updatedAt);
        return this;
    }

    public void setUpdatedAt(ZonedDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUpdateBy() {
        return this.updateBy;
    }

    public SampleReportCriteria updateBy(String updateBy) {
        this.setUpdateBy(updateBy);
        return this;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public String getFrequency() {
        return this.frequency;
    }

    public SampleReportCriteria frequency(String frequency) {
        this.setFrequency(frequency);
        return this;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public Long getSampleReportId() {
        return this.sampleReportId;
    }

    public SampleReportCriteria sampleReportId(Long sampleReportId) {
        this.setSampleReportId(sampleReportId);
        return this;
    }

    public void setSampleReportId(Long sampleReportId) {
        this.sampleReportId = sampleReportId;
    }

    public String getDetail() {
        return this.detail;
    }

    public SampleReportCriteria detail(String detail) {
        this.setDetail(detail);
        return this;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SampleReportCriteria)) {
            return false;
        }
        return getId() != null && getId().equals(((SampleReportCriteria) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SampleReportCriteria{" +
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
            ", sampleReportId=" + getSampleReportId() +
            ", detail='" + getDetail() + "'" +
            "}";
    }
}
