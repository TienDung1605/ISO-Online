package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class PlanTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Plan getPlanSample1() {
        return new Plan()
            .id(1L)
            .code("code1")
            .name("name1")
            .subjectOfAssetmentPlan("subjectOfAssetmentPlan1")
            .frequency("frequency1")
            .statusPlan("statusPlan1")
            .testObject("testObject1")
            .reportTypeId(1L)
            .reportTypeName("reportTypeName1")
            .numberOfCheck("numberOfCheck1")
            .implementer("implementer1")
            .paticipant("paticipant1")
            .checkerGroup("checkerGroup1")
            .checkerName("checkerName1")
            .checkerGroupId(1L)
            .checkerId(1L)
            .gross("gross1")
            .timeCheck("timeCheck1")
            .nameResult("nameResult1")
            .scriptId(1L)
            .createBy("createBy1")
            .status("status1")
            .updateBy("updateBy1");
    }

    public static Plan getPlanSample2() {
        return new Plan()
            .id(2L)
            .code("code2")
            .name("name2")
            .subjectOfAssetmentPlan("subjectOfAssetmentPlan2")
            .frequency("frequency2")
            .statusPlan("statusPlan2")
            .testObject("testObject2")
            .reportTypeId(2L)
            .reportTypeName("reportTypeName2")
            .numberOfCheck("numberOfCheck2")
            .implementer("implementer2")
            .paticipant("paticipant2")
            .checkerGroup("checkerGroup2")
            .checkerName("checkerName2")
            .checkerGroupId(2L)
            .checkerId(2L)
            .gross("gross2")
            .timeCheck("timeCheck2")
            .nameResult("nameResult2")
            .scriptId(2L)
            .createBy("createBy2")
            .status("status2")
            .updateBy("updateBy2");
    }

    public static Plan getPlanRandomSampleGenerator() {
        return new Plan()
            .id(longCount.incrementAndGet())
            .code(UUID.randomUUID().toString())
            .name(UUID.randomUUID().toString())
            .subjectOfAssetmentPlan(UUID.randomUUID().toString())
            .frequency(UUID.randomUUID().toString())
            .statusPlan(UUID.randomUUID().toString())
            .testObject(UUID.randomUUID().toString())
            .reportTypeId(longCount.incrementAndGet())
            .reportTypeName(UUID.randomUUID().toString())
            .numberOfCheck(UUID.randomUUID().toString())
            .implementer(UUID.randomUUID().toString())
            .paticipant(UUID.randomUUID().toString())
            .checkerGroup(UUID.randomUUID().toString())
            .checkerName(UUID.randomUUID().toString())
            .checkerGroupId(longCount.incrementAndGet())
            .checkerId(longCount.incrementAndGet())
            .gross(UUID.randomUUID().toString())
            .timeCheck(UUID.randomUUID().toString())
            .nameResult(UUID.randomUUID().toString())
            .scriptId(longCount.incrementAndGet())
            .createBy(UUID.randomUUID().toString())
            .status(UUID.randomUUID().toString())
            .updateBy(UUID.randomUUID().toString());
    }
}
