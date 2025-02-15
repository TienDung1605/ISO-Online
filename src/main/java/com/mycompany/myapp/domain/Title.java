package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A Title.
 */
@Entity
@Table(name = "title")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Title implements Serializable {

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

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @Column(name = "data_type")
    private String dataType;

    @Column(name = "update_by")
    private String updateBy;

    @Column(name = "field")
    private String field;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Title id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Title name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSource() {
        return this.source;
    }

    public Title source(String source) {
        this.setSource(source);
        return this;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public ZonedDateTime getCreatedAt() {
        return this.createdAt;
    }

    public Title createdAt(ZonedDateTime createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ZonedDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    public Title updatedAt(ZonedDateTime updatedAt) {
        this.setUpdatedAt(updatedAt);
        return this;
    }

    public void setUpdatedAt(ZonedDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getDataType() {
        return this.dataType;
    }

    public Title dataType(String dataType) {
        this.setDataType(dataType);
        return this;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public String getUpdateBy() {
        return this.updateBy;
    }

    public Title updateBy(String updateBy) {
        this.setUpdateBy(updateBy);
        return this;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public String getField() {
        return this.field;
    }

    public Title field(String field) {
        this.setField(field);
        return this;
    }

    public void setField(String field) {
        this.field = field;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Title)) {
            return false;
        }
        return getId() != null && getId().equals(((Title) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Title{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", source='" + getSource() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            ", dataType='" + getDataType() + "'" +
            ", updateBy='" + getUpdateBy() + "'" +
            ", field='" + getField() + "'" +
            "}";
    }
}
