package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A ReportTitle.
 */
@Entity
@Table(name = "report_title")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ReportTitle implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "source")
    private String source;

    @Column(name = "field")
    private String field;

    @Column(name = "data_type")
    private String dataType;

    @Column(name = "jhi_index")
    private Long index;

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @Column(name = "update_by")
    private String updateBy;

    @Column(name = "report_id")
    private Long reportId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ReportTitle id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public ReportTitle name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSource() {
        return this.source;
    }

    public ReportTitle source(String source) {
        this.setSource(source);
        return this;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getField() {
        return this.field;
    }

    public ReportTitle field(String field) {
        this.setField(field);
        return this;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getDataType() {
        return this.dataType;
    }

    public ReportTitle dataType(String dataType) {
        this.setDataType(dataType);
        return this;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public Long getIndex() {
        return this.index;
    }

    public ReportTitle index(Long index) {
        this.setIndex(index);
        return this;
    }

    public void setIndex(Long index) {
        this.index = index;
    }

    public ZonedDateTime getCreatedAt() {
        return this.createdAt;
    }

    public ReportTitle createdAt(ZonedDateTime createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ZonedDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    public ReportTitle updatedAt(ZonedDateTime updatedAt) {
        this.setUpdatedAt(updatedAt);
        return this;
    }

    public void setUpdatedAt(ZonedDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUpdateBy() {
        return this.updateBy;
    }

    public ReportTitle updateBy(String updateBy) {
        this.setUpdateBy(updateBy);
        return this;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public Long getReportId() {
        return this.reportId;
    }

    public ReportTitle reportId(Long reportId) {
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
        if (!(o instanceof ReportTitle)) {
            return false;
        }
        return getId() != null && getId().equals(((ReportTitle) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ReportTitle{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", source='" + getSource() + "'" +
            ", field='" + getField() + "'" +
            ", dataType='" + getDataType() + "'" +
            ", index=" + getIndex() +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            ", updateBy='" + getUpdateBy() + "'" +
            ", reportId=" + getReportId() +
            "}";
    }
}
