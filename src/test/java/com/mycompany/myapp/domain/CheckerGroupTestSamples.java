package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class CheckerGroupTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static CheckerGroup getCheckerGroupSample1() {
        return new CheckerGroup().id(1L).name("name1").status("status1").updateBy("updateBy1");
    }

    public static CheckerGroup getCheckerGroupSample2() {
        return new CheckerGroup().id(2L).name("name2").status("status2").updateBy("updateBy2");
    }

    public static CheckerGroup getCheckerGroupRandomSampleGenerator() {
        return new CheckerGroup()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .status(UUID.randomUUID().toString())
            .updateBy(UUID.randomUUID().toString());
    }
}
