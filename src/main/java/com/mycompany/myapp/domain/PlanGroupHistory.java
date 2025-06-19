package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.ZonedDateTime;

@Entity
@Table(name = "plan_group_history")
public class PlanGroupHistory implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "code")
    private String code; // mã kế hoạch gộp

    @Column(name = "name")
    private String name; // tên kế hoạch gộp

    @Column(name = "plan_id")
    private Long planId; // mã kế hoạch

    @Column(name = "check_date")
    private ZonedDateTime checkDate; // ngày kiểm tra

    @Column(name = "type")
    private String type; // loại (Multiple: Trong kế hoạch)

    @Column(name = "created_at")
    private ZonedDateTime createdAt; // ngày tạo

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt; // ngày cập nhật

    @Column(name = "created_by")
    private String createdBy;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getPlanId() {
        return planId;
    }

    public void setPlanId(Long planId) {
        this.planId = planId;
    }

    public ZonedDateTime getCheckDate() {
        return checkDate;
    }

    public void setCheckDate(ZonedDateTime checkDate) {
        this.checkDate = checkDate;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
}
