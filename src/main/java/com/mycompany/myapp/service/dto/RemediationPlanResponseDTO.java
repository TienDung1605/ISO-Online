package com.mycompany.myapp.service.dto;

import java.time.ZonedDateTime;
import java.util.List;

public class RemediationPlanResponseDTO {

    private Long id;
    private String code;
    private String name;
    private Long reportId;
    private Long planId;
    private ZonedDateTime repairDate;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
    private String createdBy;
    private String type;
    private String status;

    private List<RemediationPlanDetailDTO> details;

    // Constructors
    public RemediationPlanResponseDTO() {}

    public RemediationPlanResponseDTO(
        Long id,
        String code,
        String name,
        Long reportId,
        Long planId,
        ZonedDateTime repairDate,
        ZonedDateTime createdAt,
        ZonedDateTime updatedAt,
        String createdBy,
        String type,
        String status,
        List<RemediationPlanDetailDTO> details
    ) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.reportId = reportId;
        this.planId = planId;
        this.repairDate = repairDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.createdBy = createdBy;
        this.type = type;
        this.status = status;
        this.details = details;
    }

    // Getters and Setters
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

    public Long getReportId() {
        return reportId;
    }

    public void setReportId(Long reportId) {
        this.reportId = reportId;
    }

    public Long getPlanId() {
        return planId;
    }

    public void setPlanId(Long planId) {
        this.planId = planId;
    }

    public ZonedDateTime getRepairDate() {
        return repairDate;
    }

    public void setRepairDate(ZonedDateTime repairDate) {
        this.repairDate = repairDate;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<RemediationPlanDetailDTO> getDetails() {
        return details;
    }

    public void setDetails(List<RemediationPlanDetailDTO> details) {
        this.details = details;
    }
}
