package com.mycompany.myapp.service.dto;

public interface ReportResponse {
    Integer getId();
    String getName();
    String getCode();
    Integer getSampleReportId();
    String getTestOfObject();
    String getChecker();
    String getStatus();
    String getFrequency();
    String getReportType();
    Integer getReportTypeId();
    Integer getGroupReport();
    String getCreatedAt();
    String getUpdatedAt();
    String getCheckTime();
    Integer getScoreScale();
    String getConvertScore();
    String getUpdateBy();
    Integer getPlanId();
    String getUser();
    String getDetail();
    Integer getSumOfAudit();
    Integer getSumOfNc();
    Integer getSumOfLy();
    Integer getSumOfFail();
}
