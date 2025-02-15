package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class EvaluatorTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Evaluator getEvaluatorSample1() {
        return new Evaluator().id(1L).name("name1").userGroupId(1L).status("status1").updateBy("updateBy1");
    }

    public static Evaluator getEvaluatorSample2() {
        return new Evaluator().id(2L).name("name2").userGroupId(2L).status("status2").updateBy("updateBy2");
    }

    public static Evaluator getEvaluatorRandomSampleGenerator() {
        return new Evaluator()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .userGroupId(longCount.incrementAndGet())
            .status(UUID.randomUUID().toString())
            .updateBy(UUID.randomUUID().toString());
    }
}
