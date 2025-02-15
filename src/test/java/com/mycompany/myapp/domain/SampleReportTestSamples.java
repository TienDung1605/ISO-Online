package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class SampleReportTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static SampleReport getSampleReportSample1() {
        return new SampleReport()
            .id(1L)
            .name("name1")
            .status(1L)
            .updateBy("updateBy1")
            .frequency("frequency1")
            .code("code1")
            .reportType("reportType1")
            .reportTypeId(1L);
    }

    public static SampleReport getSampleReportSample2() {
        return new SampleReport()
            .id(2L)
            .name("name2")
            .status(2L)
            .updateBy("updateBy2")
            .frequency("frequency2")
            .code("code2")
            .reportType("reportType2")
            .reportTypeId(2L);
    }

    public static SampleReport getSampleReportRandomSampleGenerator() {
        return new SampleReport()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .status(longCount.incrementAndGet())
            .updateBy(UUID.randomUUID().toString())
            .frequency(UUID.randomUUID().toString())
            .code(UUID.randomUUID().toString())
            .reportType(UUID.randomUUID().toString())
            .reportTypeId(longCount.incrementAndGet());
    }
}
