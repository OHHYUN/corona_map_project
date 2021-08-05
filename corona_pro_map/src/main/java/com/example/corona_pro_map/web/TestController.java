package com.example.corona_pro_map.web;


import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TestController {

    @GetMapping("/chart")
    public String index(Model model){
        return "chart";
    }
}
