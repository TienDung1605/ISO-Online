package com.mycompany.myapp.domain;

import java.time.LocalDateTime;

public interface ReportResponse {
    Long getId();
    String getName();
    String getCode();
    Long getSampleReportId();
    String getTestOfObject();
    String getChecker();
    String getStatus();
    String getFrequency();
    String getReportType();
    Long getReportTypeId();
    Integer getGroupReport();
    LocalDateTime getCreatedAt();
    LocalDateTime getUpdatedAt();
    LocalDateTime getCheckTime();
    String getScoreScale();
    String getConvertScore();
    String getUpdateBy();
    Long getPlanId();
    String getUser();
    String getDetail();
    Long getSumOfAudit();
    Long getSumOfNc();
    Long getSumOfLy();
    Long getSumOfFail();
}
