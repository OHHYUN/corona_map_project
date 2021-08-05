package com.example.corona_pro_map;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import static org.assertj.core.api.Assertions.*;
@SpringBootTest
public class TestSample {

    @Test
    public void test_testing(){
        String a = "test";

        assertThat(a).isEqualTo("test");
    }
}
