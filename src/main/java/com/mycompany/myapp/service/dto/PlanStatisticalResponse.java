package com.mycompany.myapp.service.dto;

public interface PlanStatisticalResponse {
    Integer getPlanGroupHistoryId();
    String getPlanGroupHistoryCode();
    String getPlanGroupHistoryName();
    String getCheckDate();
    Integer getReportId();
    String getReportName();
    String getReportCode();
    String getTestOfObject();
    Integer getSumOfAudit();
    String getConvertScore();
    Integer getScoreScale();
    Integer getSumOfNc();
    Integer getSumOfLy();
    Integer getSumOfFail();
}
