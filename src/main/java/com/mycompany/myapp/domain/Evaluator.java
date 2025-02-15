package com.mycompany.myapp.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * not an ignored comment
 */
@Schema(description = "not an ignored comment")
@Entity
@Table(name = "evaluator")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Evaluator implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "user_group_id")
    private Long userGroupId;

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @Column(name = "status")
    private String status;

    @Column(name = "update_by")
    private String updateBy;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Evaluator id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Evaluator name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getUserGroupId() {
        return this.userGroupId;
    }

    public Evaluator userGroupId(Long userGroupId) {
        this.setUserGroupId(userGroupId);
        return this;
    }

    public void setUserGroupId(Long userGroupId) {
        this.userGroupId = userGroupId;
    }

    public ZonedDateTime getCreatedAt() {
        return this.createdAt;
    }

    public Evaluator createdAt(ZonedDateTime createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ZonedDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    public Evaluator updatedAt(ZonedDateTime updatedAt) {
        this.setUpdatedAt(updatedAt);
        return this;
    }

    public void setUpdatedAt(ZonedDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getStatus() {
        return this.status;
    }

    public Evaluator status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUpdateBy() {
        return this.updateBy;
    }

    public Evaluator updateBy(String updateBy) {
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
        if (!(o instanceof Evaluator)) {
            return false;
        }
        return getId() != null && getId().equals(((Evaluator) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Evaluator{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", userGroupId=" + getUserGroupId() +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            ", status='" + getStatus() + "'" +
            ", updateBy='" + getUpdateBy() + "'" +
            "}";
    }
}
