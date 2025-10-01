package com.example.demo.controller;

import com.example.demo.dto.MemberDTO;
import com.example.demo.entity.Member;
import com.example.demo.service.MemberService;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members")
public class MemberRestController {

    private final MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody MemberDTO dto) {
        Member saved = memberService.signup(dto);
        return ResponseEntity.ok(new ApiResponse(true, "회원가입 완료", saved.getId()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpSession session) {
        Member m = memberService.login(req.getEmail(), req.getPassword());
        session.setAttribute("LOGIN_MEMBER_ID", m.getId());
        return ResponseEntity.ok(new ApiResponse(true, "로그인 성공", m.getName()));
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean duplicated = memberService.isEmailDuplicated(email);
        return ResponseEntity.ok(new ApiResponse(true, duplicated ? "중복" : "사용 가능", duplicated));
    }

    // 내부 DTO
    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    @AllArgsConstructor
    public static class ApiResponse {
        private boolean success;
        private String message;
        private Object data;
    }
}