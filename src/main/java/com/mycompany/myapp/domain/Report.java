package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A Report.
 */
@Entity
@Table(name = "report")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Report implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "code")
    private String code;

    @Column(name = "sample_report_id")
    private Long sampleReportId;

    @Column(name = "test_of_object")
    private String testOfObject;

    @Column(name = "checker")
    private String checker;

    @Column(name = "status")
    private String status;

    @Column(name = "frequency")
    private String frequency;

    @Column(name = "report_type")
    private String reportType;

    @Column(name = "report_type_id")
    private Long reportTypeId;

    @Column(name = "group_report")
    private Integer groupReport;

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @Column(name = "check_time")
    private ZonedDateTime checkTime;

    @Column(name = "score_scale")
    private String scoreScale;

    @Column(name = "convert_score")
    private String convertScore;

    @Column(name = "update_by")
    private String updateBy;

    @Column(name = "plan_id")
    private Long planId;

    @Column(name = "user")
    private String user;

    @Column(name = "detail")
    private String detail;

    public Integer getGroupReport() {
        return groupReport;
    }

    public void setGroupReport(Integer groupReport) {
        this.groupReport = groupReport;
    }

    public ZonedDateTime getCheckTime() {
        return checkTime;
    }

    public void setCheckTime(ZonedDateTime checkTime) {
        this.checkTime = checkTime;
    }

    public String getConvertScore() {
        return convertScore;
    }

    public void setConvertScore(String convertScore) {
        this.convertScore = convertScore;
    }

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Report id(Long id) {
        this.setId(id);
        return this;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Report name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return this.code;
    }

    public Report code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Long getSampleReportId() {
        return this.sampleReportId;
    }

    public Report sampleReportId(Long sampleReportId) {
        this.setSampleReportId(sampleReportId);
        return this;
    }

    public void setSampleReportId(Long sampleReportId) {
        this.sampleReportId = sampleReportId;
    }

    public String getTestOfObject() {
        return this.testOfObject;
    }

    public Report testOfObject(String testOfObject) {
        this.setTestOfObject(testOfObject);
        return this;
    }

    public void setTestOfObject(String testOfObject) {
        this.testOfObject = testOfObject;
    }

    public String getChecker() {
        return this.checker;
    }

    public Report checker(String checker) {
        this.setChecker(checker);
        return this;
    }

    public void setChecker(String checker) {
        this.checker = checker;
    }

    public String getStatus() {
        return this.status;
    }

    public Report status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFrequency() {
        return this.frequency;
    }

    public Report frequency(String frequency) {
        this.setFrequency(frequency);
        return this;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public String getReportType() {
        return this.reportType;
    }

    public Report reportType(String reportType) {
        this.setReportType(reportType);
        return this;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public Long getReportTypeId() {
        return this.reportTypeId;
    }

    public Report reportTypeId(Long reportTypeId) {
        this.setReportTypeId(reportTypeId);
        return this;
    }

    public void setReportTypeId(Long reportTypeId) {
        this.reportTypeId = reportTypeId;
    }

    public ZonedDateTime getCreatedAt() {
        return this.createdAt;
    }

    public Report createdAt(ZonedDateTime createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ZonedDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    public Report updatedAt(ZonedDateTime updatedAt) {
        this.setUpdatedAt(updatedAt);
        return this;
    }

    public void setUpdatedAt(ZonedDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getScoreScale() {
        return this.scoreScale;
    }

    public Report scoreScale(String scoreScale) {
        this.setScoreScale(scoreScale);
        return this;
    }

    public void setScoreScale(String scoreScale) {
        this.scoreScale = scoreScale;
    }

    public String getUpdateBy() {
        return this.updateBy;
    }

    public Report updateBy(String updateBy) {
        this.setUpdateBy(updateBy);
        return this;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public Long getPlanId() {
        return this.planId;
    }

    public Report planId(Long planId) {
        this.setPlanId(planId);
        return this;
    }

    public void setPlanId(Long planId) {
        this.planId = planId;
    }

    public String getUser() {
        return this.user;
    }

    public Report user(String user) {
        this.setUser(user);
        return this;
    }

    public void setUser(String user) {
        this.user = user;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Report)) {
            return false;
        }
        return getId() != null && getId().equals(((Report) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Report{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", code='" + getCode() + "'" +
            ", sampleReportId=" + getSampleReportId() +
            ", testOfObject='" + getTestOfObject() + "'" +
            ", checker='" + getChecker() + "'" +
            ", status='" + getStatus() + "'" +
            ", frequency='" + getFrequency() + "'" +
            ", reportType='" + getReportType() + "'" +
            ", reportTypeId=" + getReportTypeId() +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            ", scoreScale='" + getScoreScale() + "'" +
            ", updateBy='" + getUpdateBy() + "'" +
            ", planId='" + getPlanId() + "'" +
            ", user='" + getUser() + "'" +
            "}";
    }
}
