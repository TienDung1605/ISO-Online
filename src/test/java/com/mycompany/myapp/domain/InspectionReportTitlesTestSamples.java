package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class InspectionReportTitlesTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static InspectionReportTitles getInspectionReportTitlesSample1() {
        return new InspectionReportTitles()
            .id(1L)
            .nameTitle("nameTitle1")
            .source("source1")
            .field("field1")
            .dataType("dataType1")
            .sampleReportId(1L);
    }

    public static InspectionReportTitles getInspectionReportTitlesSample2() {
        return new InspectionReportTitles()
            .id(2L)
            .nameTitle("nameTitle2")
            .source("source2")
            .field("field2")
            .dataType("dataType2")
            .sampleReportId(2L);
    }

    public static InspectionReportTitles getInspectionReportTitlesRandomSampleGenerator() {
        return new InspectionReportTitles()
            .id(longCount.incrementAndGet())
            .nameTitle(UUID.randomUUID().toString())
            .source(UUID.randomUUID().toString())
            .field(UUID.randomUUID().toString())
            .dataType(UUID.randomUUID().toString())
            .sampleReportId(longCount.incrementAndGet());
    }
}
