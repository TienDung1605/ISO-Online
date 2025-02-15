package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.EvaluatorTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EvaluatorTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Evaluator.class);
        Evaluator evaluator1 = getEvaluatorSample1();
        Evaluator evaluator2 = new Evaluator();
        assertThat(evaluator1).isNotEqualTo(evaluator2);

        evaluator2.setId(evaluator1.getId());
        assertThat(evaluator1).isEqualTo(evaluator2);

        evaluator2 = getEvaluatorSample2();
        assertThat(evaluator1).isNotEqualTo(evaluator2);
    }
}
