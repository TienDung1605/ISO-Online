package com.mycompany.myapp.service.dto;

import java.time.ZonedDateTime;

public class RecheckRemediationPlanDetailDTO {

    private Long id;
    private String result;
    private String image;
    private String reason;
    private String note;
    private String createdBy;
    private ZonedDateTime createdAt;
    private String status;

    // Constructors
    public RecheckRemediationPlanDetailDTO() {}

    public RecheckRemediationPlanDetailDTO(
        Long id,
        String result,
        String image,
        String reason,
        String note,
        String createdBy,
        ZonedDateTime createdAt,
        String status
    ) {
        this.id = id;
        this.result = result;
        this.image = image;
        this.reason = reason;
        this.note = note;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
