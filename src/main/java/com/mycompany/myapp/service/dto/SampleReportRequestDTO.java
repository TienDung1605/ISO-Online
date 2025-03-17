package com.mycompany.myapp.service.dto;

public class SampleReportRequestDTO {

    private String source_table;
    private String field_name;

    public SampleReportRequestDTO() {}

    public String getSource_table() {
        return source_table;
    }

    public void setSource_table(String source_table) {
        this.source_table = source_table;
    }

    public String getField_name() {
        return field_name;
    }

    public void setField_name(String field_name) {
        this.field_name = field_name;
    }
}
