package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ScriptTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ScriptTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Script.class);
        Script script1 = getScriptSample1();
        Script script2 = new Script();
        assertThat(script1).isNotEqualTo(script2);

        script2.setId(script1.getId());
        assertThat(script1).isEqualTo(script2);

        script2 = getScriptSample2();
        assertThat(script1).isNotEqualTo(script2);
    }
}
