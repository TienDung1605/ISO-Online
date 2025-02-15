package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class CheckLevelTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static CheckLevel getCheckLevelSample1() {
        return new CheckLevel().id(1L).name("name1").status("status1").updateBy("updateBy1");
    }

    public static CheckLevel getCheckLevelSample2() {
        return new CheckLevel().id(2L).name("name2").status("status2").updateBy("updateBy2");
    }

    public static CheckLevel getCheckLevelRandomSampleGenerator() {
        return new CheckLevel()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .status(UUID.randomUUID().toString())
            .updateBy(UUID.randomUUID().toString());
    }
}
