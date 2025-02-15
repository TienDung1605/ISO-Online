package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A InspectionReportTitles.
 */
@Entity
@Table(name = "inspection_report_titles")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class InspectionReportTitles implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name_title")
    private String nameTitle;

    @Column(name = "source")
    private String source;

    @Column(name = "field")
    private String field;

    @Column(name = "data_type")
    private String dataType;

    @Column(name = "time_create")
    private ZonedDateTime timeCreate;

    @Column(name = "time_update")
    private ZonedDateTime timeUpdate;

    @Column(name = "sample_report_id")
    private Long sampleReportId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public InspectionReportTitles id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNameTitle() {
        return this.nameTitle;
    }

    public InspectionReportTitles nameTitle(String nameTitle) {
        this.setNameTitle(nameTitle);
        return this;
    }

    public void setNameTitle(String nameTitle) {
        this.nameTitle = nameTitle;
    }

    public String getSource() {
        return this.source;
    }

    public InspectionReportTitles source(String source) {
        this.setSource(source);
        return this;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getField() {
        return this.field;
    }

    public InspectionReportTitles field(String field) {
        this.setField(field);
        return this;
    }

    public void setField(String field) {
        this.field = field;
    }

    public String getDataType() {
        return this.dataType;
    }

    public InspectionReportTitles dataType(String dataType) {
        this.setDataType(dataType);
        return this;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public ZonedDateTime getTimeCreate() {
        return this.timeCreate;
    }

    public InspectionReportTitles timeCreate(ZonedDateTime timeCreate) {
        this.setTimeCreate(timeCreate);
        return this;
    }

    public void setTimeCreate(ZonedDateTime timeCreate) {
        this.timeCreate = timeCreate;
    }

    public ZonedDateTime getTimeUpdate() {
        return this.timeUpdate;
    }

    public InspectionReportTitles timeUpdate(ZonedDateTime timeUpdate) {
        this.setTimeUpdate(timeUpdate);
        return this;
    }

    public void setTimeUpdate(ZonedDateTime timeUpdate) {
        this.timeUpdate = timeUpdate;
    }

    public Long getSampleReportId() {
        return this.sampleReportId;
    }

    public InspectionReportTitles sampleReportId(Long sampleReportId) {
        this.setSampleReportId(sampleReportId);
        return this;
    }

    public void setSampleReportId(Long sampleReportId) {
        this.sampleReportId = sampleReportId;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof InspectionReportTitles)) {
            return false;
        }
        return getId() != null && getId().equals(((InspectionReportTitles) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "InspectionReportTitles{" +
            "id=" + getId() +
            ", nameTitle='" + getNameTitle() + "'" +
            ", source='" + getSource() + "'" +
            ", field='" + getField() + "'" +
            ", dataType='" + getDataType() + "'" +
            ", timeCreate='" + getTimeCreate() + "'" +
            ", timeUpdate='" + getTimeUpdate() + "'" +
            ", sampleReportId=" + getSampleReportId() +
            "}";
    }
}
