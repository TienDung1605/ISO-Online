package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ReportCriteriaTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static ReportCriteria getReportCriteriaSample1() {
        return new ReportCriteria()
            .id(1L)
            .criteriaName("criteriaName1")
            .criteriaGroupName("criteriaGroupName1")
            .criteriaId(1L)
            .criteriaGroupId(1L)
            .status("status1")
            .updateBy("updateBy1")
            .frequency("frequency1")
            .reportId(1L);
    }

    public static ReportCriteria getReportCriteriaSample2() {
        return new ReportCriteria()
            .id(2L)
            .criteriaName("criteriaName2")
            .criteriaGroupName("criteriaGroupName2")
            .criteriaId(2L)
            .criteriaGroupId(2L)
            .status("status2")
            .updateBy("updateBy2")
            .frequency("frequency2")
            .reportId(2L);
    }

    public static ReportCriteria getReportCriteriaRandomSampleGenerator() {
        return new ReportCriteria()
            .id(longCount.incrementAndGet())
            .criteriaName(UUID.randomUUID().toString())
            .criteriaGroupName(UUID.randomUUID().toString())
            .criteriaId(longCount.incrementAndGet())
            .criteriaGroupId(longCount.incrementAndGet())
            .status(UUID.randomUUID().toString())
            .updateBy(UUID.randomUUID().toString())
            .frequency(UUID.randomUUID().toString())
            .reportId(longCount.incrementAndGet());
    }
}
