package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class TitleTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Title getTitleSample1() {
        return new Title().id(1L).name("name1").source("source1").dataType("dataType1").updateBy("updateBy1").field("field1");
    }

    public static Title getTitleSample2() {
        return new Title().id(2L).name("name2").source("source2").dataType("dataType2").updateBy("updateBy2").field("field2");
    }

    public static Title getTitleRandomSampleGenerator() {
        return new Title()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .source(UUID.randomUUID().toString())
            .dataType(UUID.randomUUID().toString())
            .updateBy(UUID.randomUUID().toString())
            .field(UUID.randomUUID().toString());
    }
}
