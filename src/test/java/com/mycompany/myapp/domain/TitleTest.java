package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.TitleTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TitleTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Title.class);
        Title title1 = getTitleSample1();
        Title title2 = new Title();
        assertThat(title1).isNotEqualTo(title2);

        title2.setId(title1.getId());
        assertThat(title1).isEqualTo(title2);

        title2 = getTitleSample2();
        assertThat(title1).isNotEqualTo(title2);
    }
}
