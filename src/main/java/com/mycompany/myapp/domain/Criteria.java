package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A Criteria.
 */
@Entity
@Table(name = "criteria")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Criteria implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "criterial_group_id")
    private String criterialGroupId;

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

    public Criteria id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Criteria name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCriterialGroupId() {
        return this.criterialGroupId;
    }

    public Criteria criterialGroupId(String criterialGroupId) {
        this.setCriterialGroupId(criterialGroupId);
        return this;
    }

    public void setCriterialGroupId(String criterialGroupId) {
        this.criterialGroupId = criterialGroupId;
    }

    public String getStatus() {
        return this.status;
    }

    public Criteria status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public ZonedDateTime getCreatedAt() {
        return this.createdAt;
    }

    public Criteria createdAt(ZonedDateTime createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ZonedDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    public Criteria updatedAt(ZonedDateTime updatedAt) {
        this.setUpdatedAt(updatedAt);
        return this;
    }

    public void setUpdatedAt(ZonedDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUpdateBy() {
        return this.updateBy;
    }

    public Criteria updateBy(String updateBy) {
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
        if (!(o instanceof Criteria)) {
            return false;
        }
        return getId() != null && getId().equals(((Criteria) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Criteria{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", criterialGroupId='" + getCriterialGroupId() + "'" +
            ", status='" + getStatus() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            ", updateBy='" + getUpdateBy() + "'" +
            "}";
    }
}
