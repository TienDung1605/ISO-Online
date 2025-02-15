package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class SampleReportCriteriaTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static SampleReportCriteria getSampleReportCriteriaSample1() {
        return new SampleReportCriteria()
            .id(1L)
            .criteriaName("criteriaName1")
            .criteriaGroupName("criteriaGroupName1")
            .criteriaId(1L)
            .criteriaGroupId(1L)
            .status("status1")
            .updateBy("updateBy1")
            .frequency("frequency1")
            .sampleReportId(1L)
            .detail("detail1");
    }

    public static SampleReportCriteria getSampleReportCriteriaSample2() {
        return new SampleReportCriteria()
            .id(2L)
            .criteriaName("criteriaName2")
            .criteriaGroupName("criteriaGroupName2")
            .criteriaId(2L)
            .criteriaGroupId(2L)
            .status("status2")
            .updateBy("updateBy2")
            .frequency("frequency2")
            .sampleReportId(2L)
            .detail("detail2");
    }

    public static SampleReportCriteria getSampleReportCriteriaRandomSampleGenerator() {
        return new SampleReportCriteria()
            .id(longCount.incrementAndGet())
            .criteriaName(UUID.randomUUID().toString())
            .criteriaGroupName(UUID.randomUUID().toString())
            .criteriaId(longCount.incrementAndGet())
            .criteriaGroupId(longCount.incrementAndGet())
            .status(UUID.randomUUID().toString())
            .updateBy(UUID.randomUUID().toString())
            .frequency(UUID.randomUUID().toString())
            .sampleReportId(longCount.incrementAndGet())
            .detail(UUID.randomUUID().toString());
    }
}
