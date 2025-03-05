package com.mycompany.myapp.service.dto;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A DTO for the {@link com.mycompany.myapp.domain.Fields} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FieldsDTO implements Serializable {

    private Long id;

    private String name;

    private String fieldName;

    private Long sourceId;

    private ZonedDateTime createdAt;

    private ZonedDateTime updatedAt;

    private String createBy;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public Long getSourceId() {
        return sourceId;
    }

    public void setSourceId(Long sourceId) {
        this.sourceId = sourceId;
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

    public String getCreateBy() {
        return createBy;
    }

    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FieldsDTO)) {
            return false;
        }

        FieldsDTO fieldsDTO = (FieldsDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, fieldsDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FieldsDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", fieldName='" + getFieldName() + "'" +
            ", sourceId=" + getSourceId() +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            ", createBy='" + getCreateBy() + "'" +
            "}";
    }
}
