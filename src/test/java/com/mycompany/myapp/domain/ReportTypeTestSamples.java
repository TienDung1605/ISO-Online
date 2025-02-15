package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ReportTypeTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ReportType getReportTypeSample1() {
        return new ReportType().id(1L).code("code1").name("name1").status("status1").updateBy("updateBy1");
    }

    public static ReportType getReportTypeSample2() {
        return new ReportType().id(2L).code("code2").name("name2").status("status2").updateBy("updateBy2");
    }

    public static ReportType getReportTypeRandomSampleGenerator() {
        return new ReportType()
            .id(longCount.incrementAndGet())
            .code(UUID.randomUUID().toString())
            .name(UUID.randomUUID().toString())
            .status(UUID.randomUUID().toString())
            .updateBy(UUID.randomUUID().toString());
    }
}
