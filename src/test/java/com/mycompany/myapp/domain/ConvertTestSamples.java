package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ConvertTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Convert getConvertSample1() {
        return new Convert().id(1L).name("name1").type("type1").mark("mark1").updateBy("updateBy1").score(1).count(1);
    }

    public static Convert getConvertSample2() {
        return new Convert().id(2L).name("name2").type("type2").mark("mark2").updateBy("updateBy2").score(2).count(2);
    }

    public static Convert getConvertRandomSampleGenerator() {
        return new Convert()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .type(UUID.randomUUID().toString())
            .mark(UUID.randomUUID().toString())
            .updateBy(UUID.randomUUID().toString())
            .score(intCount.incrementAndGet())
            .count(intCount.incrementAndGet());
    }
}
