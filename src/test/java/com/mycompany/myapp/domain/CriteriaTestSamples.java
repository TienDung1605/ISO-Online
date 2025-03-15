package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class CriteriaTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Criteria getCriteriaSample1() {
        return new Criteria().id(1L).name("name1").criterialGroupId(1L).status("status1").updateBy("updateBy1");
    }

    public static Criteria getCriteriaSample2() {
        return new Criteria().id(2L).name("name2").criterialGroupId(2L).status("status2").updateBy("updateBy2");
    }

    public static Criteria getCriteriaRandomSampleGenerator() {
        return new Criteria()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .criterialGroupId(longCount.incrementAndGet())
            .status(UUID.randomUUID().toString())
            .updateBy(UUID.randomUUID().toString());
    }
}
