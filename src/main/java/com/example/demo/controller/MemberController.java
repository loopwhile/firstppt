package com.example.demo.controller;

import com.example.demo.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MemberController {

    // 로그인 페이지(본사/가맹점 토글 포함 정적 페이지)
    @GetMapping("/login")
    public String loginPage() {
        return "auth/login"; // templates/auth/login.html
    }

    // 회원가입 페이지(본사/가맹점 토글 포함 정적 페이지)
    @GetMapping("/signup")
    public String signupPage() {
        return "auth/signup"; // templates/auth/signup.html
    }

    // 그 외 라우트는 정적 이동만(필요 시 추가)
    @GetMapping("/")
    public String home() {
        return "index"; // templates/index.html
    }
}