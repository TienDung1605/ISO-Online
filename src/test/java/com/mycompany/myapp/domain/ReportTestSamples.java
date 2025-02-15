package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ReportTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Report getReportSample1() {
        return new Report()
            .id(1L)
            .name("name1")
            .code("code1")
            .sampleReportId(1L)
            .testOfObject("testOfObject1")
            .checker("checker1")
            .status("status1")
            .frequency("frequency1")
            .reportType("reportType1")
            .reportTypeId(1L)
            .scoreScale("scoreScale1")
            .updateBy("updateBy1")
            .planId(1L)
            .user("user1");
    }

    public static Report getReportSample2() {
        return new Report()
            .id(2L)
            .name("name2")
            .code("code2")
            .sampleReportId(2L)
            .testOfObject("testOfObject2")
            .checker("checker2")
            .status("status2")
            .frequency("frequency2")
            .reportType("reportType2")
            .reportTypeId(2L)
            .scoreScale("scoreScale2")
            .updateBy("updateBy2")
            .planId(2L)
            .user("user2");
    }

    public static Report getReportRandomSampleGenerator() {
        return new Report()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .code(UUID.randomUUID().toString())
            .sampleReportId(longCount.incrementAndGet())
            .testOfObject(UUID.randomUUID().toString())
            .checker(UUID.randomUUID().toString())
            .status(UUID.randomUUID().toString())
            .frequency(UUID.randomUUID().toString())
            .reportType(UUID.randomUUID().toString())
            .reportTypeId(longCount.incrementAndGet())
            .scoreScale(UUID.randomUUID().toString())
            .updateBy(UUID.randomUUID().toString())
            .planId(longCount.incrementAndGet())
            .user(UUID.randomUUID().toString());
    }
}
