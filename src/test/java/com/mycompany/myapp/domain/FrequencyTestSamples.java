package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class FrequencyTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Frequency getFrequencySample1() {
        return new Frequency().id(1L).name("name1").status("status1").updateBy("updateBy1");
    }

    public static Frequency getFrequencySample2() {
        return new Frequency().id(2L).name("name2").status("status2").updateBy("updateBy2");
    }

    public static Frequency getFrequencyRandomSampleGenerator() {
        return new Frequency()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .status(UUID.randomUUID().toString())
            .updateBy(UUID.randomUUID().toString());
    }
}
