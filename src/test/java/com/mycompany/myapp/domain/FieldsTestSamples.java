package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class FieldsTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Fields getFieldsSample1() {
        return new Fields().id(1L).name("name1").fieldName("fieldName1").sourceId(1L).createBy("createBy1");
    }

    public static Fields getFieldsSample2() {
        return new Fields().id(2L).name("name2").fieldName("fieldName2").sourceId(2L).createBy("createBy2");
    }

    public static Fields getFieldsRandomSampleGenerator() {
        return new Fields()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .fieldName(UUID.randomUUID().toString())
            .sourceId(longCount.incrementAndGet())
            .createBy(UUID.randomUUID().toString());
    }
}
