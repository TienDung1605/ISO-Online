package com.mycompany.myapp;

import com.mycompany.myapp.config.AsyncSyncConfiguration;
import com.mycompany.myapp.config.EmbeddedSQL;
import com.mycompany.myapp.config.JacksonConfiguration;
import com.mycompany.myapp.config.TestSecurityConfiguration;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = { IsoApp.class, JacksonConfiguration.class, AsyncSyncConfiguration.class, TestSecurityConfiguration.class })
@EmbeddedSQL
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public @interface IntegrationTest {
}
