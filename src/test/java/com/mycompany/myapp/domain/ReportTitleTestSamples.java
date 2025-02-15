package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ReportTitleTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ReportTitle getReportTitleSample1() {
        return new ReportTitle()
            .id(1L)
            .name("name1")
            .source("source1")
            .field("field1")
            .dataType("dataType1")
            .index(1L)
            .updateBy("updateBy1")
            .reportId(1L);
    }

    public static ReportTitle getReportTitleSample2() {
        return new ReportTitle()
            .id(2L)
            .name("name2")
            .source("source2")
            .field("field2")
            .dataType("dataType2")
            .index(2L)
            .updateBy("updateBy2")
            .reportId(2L);
    }

    public static ReportTitle getReportTitleRandomSampleGenerator() {
        return new ReportTitle()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .source(UUID.randomUUID().toString())
            .field(UUID.randomUUID().toString())
            .dataType(UUID.randomUUID().toString())
            .index(longCount.incrementAndGet())
            .updateBy(UUID.randomUUID().toString())
            .reportId(longCount.incrementAndGet());
    }
}
