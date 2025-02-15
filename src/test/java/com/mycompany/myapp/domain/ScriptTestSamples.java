package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ScriptTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Script getScriptSample1() {
        return new Script()
            .id(1L)
            .scriptCode("scriptCode1")
            .scriptName("scriptName1")
            .status("status1")
            .updateBy("updateBy1")
            .frequency("frequency1")
            .subjectOfAssetmentPlan("subjectOfAssetmentPlan1")
            .codePlan("codePlan1")
            .namePlan("namePlan1")
            .participant("participant1");
    }

    public static Script getScriptSample2() {
        return new Script()
            .id(2L)
            .scriptCode("scriptCode2")
            .scriptName("scriptName2")
            .status("status2")
            .updateBy("updateBy2")
            .frequency("frequency2")
            .subjectOfAssetmentPlan("subjectOfAssetmentPlan2")
            .codePlan("codePlan2")
            .namePlan("namePlan2")
            .participant("participant2");
    }

    public static Script getScriptRandomSampleGenerator() {
        return new Script()
            .id(longCount.incrementAndGet())
            .scriptCode(UUID.randomUUID().toString())
            .scriptName(UUID.randomUUID().toString())
            .status(UUID.randomUUID().toString())
            .updateBy(UUID.randomUUID().toString())
            .frequency(UUID.randomUUID().toString())
            .subjectOfAssetmentPlan(UUID.randomUUID().toString())
            .codePlan(UUID.randomUUID().toString())
            .namePlan(UUID.randomUUID().toString())
            .participant(UUID.randomUUID().toString());
    }
}
