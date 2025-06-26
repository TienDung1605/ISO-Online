package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A CheckTarget.
 */
@Entity
@Table(name = "check_target")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CheckTarget implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "inspection_target")
    private String inspectionTarget;

    @Column(name = "evaluation_level_id")
    private Long evaluationLevelId;

    @Column(name = "check_group_id")
    private Long checkGroupId;

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

    public CheckTarget id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public CheckTarget name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getInspectionTarget() {
        return this.inspectionTarget;
    }

    public CheckTarget inspectionTarget(String inspectionTarget) {
        this.setInspectionTarget(inspectionTarget);
        return this;
    }

    public void setInspectionTarget(String inspectionTarget) {
        this.inspectionTarget = inspectionTarget;
    }

    public Long getEvaluationLevelId() {
        return this.evaluationLevelId;
    }

    public CheckTarget evaluationLevelId(Long evaluationLevelId) {
        this.setEvaluationLevelId(evaluationLevelId);
        return this;
    }

    public void setEvaluationLevelId(Long evaluationLevelId) {
        this.evaluationLevelId = evaluationLevelId;
    }

    public Long getCheckGroupId() {
        return checkGroupId;
    }

    public void setCheckGroupId(Long checkGroupId) {
        this.checkGroupId = checkGroupId;
    }

    public String getStatus() {
        return this.status;
    }

    public CheckTarget status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public ZonedDateTime getCreatedAt() {
        return this.createdAt;
    }

    public CheckTarget createdAt(ZonedDateTime createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ZonedDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    public CheckTarget updatedAt(ZonedDateTime updatedAt) {
        this.setUpdatedAt(updatedAt);
        return this;
    }

    public void setUpdatedAt(ZonedDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUpdateBy() {
        return this.updateBy;
    }

    public CheckTarget updateBy(String updateBy) {
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
        if (!(o instanceof CheckTarget)) {
            return false;
        }
        return getId() != null && getId().equals(((CheckTarget) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CheckTarget{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", inspectionTarget='" + getInspectionTarget() + "'" +
            ", evaluationLevelId=" + getEvaluationLevelId() +
            ", status='" + getStatus() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            ", updateBy='" + getUpdateBy() + "'" +
            "}";
    }
}
