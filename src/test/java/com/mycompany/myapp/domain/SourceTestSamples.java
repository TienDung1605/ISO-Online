package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class SourceTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Source getSourceSample1() {
        return new Source().id(1L).name("name1").source("source1").createBy("createBy1");
    }

    public static Source getSourceSample2() {
        return new Source().id(2L).name("name2").source("source2").createBy("createBy2");
    }

    public static Source getSourceRandomSampleGenerator() {
        return new Source()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .source(UUID.randomUUID().toString())
            .createBy(UUID.randomUUID().toString());
    }
}
