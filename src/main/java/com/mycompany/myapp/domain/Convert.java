package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;

/**
 * A Convert.
 */
@Entity
@Table(name = "jhi_convert")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Convert implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "type")
    private String type;

    @Column(name = "mark")
    private String mark;

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @Column(name = "update_by")
    private String updateBy;

    @Column(name = "score")
    private Integer score;

    @Column(name = "count")
    private Integer count;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Convert id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Convert name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return this.type;
    }

    public Convert type(String type) {
        this.setType(type);
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMark() {
        return this.mark;
    }

    public Convert mark(String mark) {
        this.setMark(mark);
        return this;
    }

    public void setMark(String mark) {
        this.mark = mark;
    }

    public ZonedDateTime getCreatedAt() {
        return this.createdAt;
    }

    public Convert createdAt(ZonedDateTime createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ZonedDateTime getUpdatedAt() {
        return this.updatedAt;
    }

    public Convert updatedAt(ZonedDateTime updatedAt) {
        this.setUpdatedAt(updatedAt);
        return this;
    }

    public void setUpdatedAt(ZonedDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUpdateBy() {
        return this.updateBy;
    }

    public Convert updateBy(String updateBy) {
        this.setUpdateBy(updateBy);
        return this;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public Integer getScore() {
        return this.score;
    }

    public Convert score(Integer score) {
        this.setScore(score);
        return this;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getCount() {
        return this.count;
    }

    public Convert count(Integer count) {
        this.setCount(count);
        return this;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Convert)) {
            return false;
        }
        return getId() != null && getId().equals(((Convert) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Convert{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", type='" + getType() + "'" +
            ", mark='" + getMark() + "'" +
            ", createdAt='" + getCreatedAt() + "'" +
            ", updatedAt='" + getUpdatedAt() + "'" +
            ", updateBy='" + getUpdateBy() + "'" +
            ", score=" + getScore() +
            ", count=" + getCount() +
            "}";
    }
}
