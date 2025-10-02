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

/**
 * 회원 관련 REST API 컨트롤러
 *
 * - 역할: 회원 가입, 로그인, 이메일 중복 체크 등의 엔드포인트를 제공
 * - 주의: 예제는 교육용으로 간단히 구성되어 있습니다. 실제 서비스에서는
 *         - 입력 검증(@Valid), 예외 처리(ControllerAdvice), 비밀번호 암호화(BCrypt) 등을 반드시 적용해야 합니다.
 */
@RestController
@RequiredArgsConstructor // final 필드(memberService)를 생성자 주입해 줍니다 (Lombok)
@RequestMapping("/api/members")
public class MemberRestController {

    // 서비스 계층 의존성 주입 (비즈니스 로직은 Service에서 담당)
    private final MemberService memberService;

    /**
     * 회원가입 엔드포인트
     * - @RequestBody로 전달된 JSON을 MemberDTO로 바인딩
     * - 성공 시 회원 id를 응답에 담아 반환
     *
     * 개선 포인트: 입력값 검증(@Valid), 예외 처리, Member 엔티티를 직접 반환하지 않고 DTO로 변환하여 반환 권장
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody MemberDTO dto) {
        // service.signup은 비밀번호 암호화, 중복체크 등 모든 비즈니스 로직을 담당해야 함
        Member saved = memberService.signup(dto);

        // 응답은 통일된 형식(ApiResponse)으로 반환
        return ResponseEntity.ok(new ApiResponse(true, "회원가입 완료", saved.getId()));
    }

    /**
     * 로그인 엔드포인트
     * - 간단한 세션 기반 로그인 예제
     * - HttpSession에 LOGIN_MEMBER_ID를 저장하여 로그인 상태를 유지
     *
     * 보안/설계 주의:
     * 1) REST API는 보통 상태 비저장(stateless)이 권장 -> JWT 등 토큰 기반 인증 권장
     * 2) 세션 사용 시 CSRF/세션 고정 공격 대비 필요
     * 3) 로그인 실패(잘못된 이메일/비밀번호) 경우 예외 처리 필요 (현재는 memberService.login에서 예외를 던진다고 가정)
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpSession session) {
        // Service에서 인증(비밀번호 확인, 계정 상태 체크 등)을 수행하고 Member 반환
        Member m = memberService.login(req.getEmail(), req.getPassword());

        // 성공 시 세션에 로그인 멤버 id 저장 (프론트가 세션 쿠키를 받아야 함)
        session.setAttribute("LOGIN_MEMBER_ID", m.getId());

        // 응답에는 민감정보(비밀번호 등)를 절대 포함시키지 말 것
        return ResponseEntity.ok(new ApiResponse(true, "로그인 성공", m.getName()));
    }

    /**
     * 이메일 중복 체크
     * - 쿼리 파라미터로 이메일을 받아 중복 여부를 boolean으로 반환
     * - 프론트에서 회원가입 폼 유효성 검사에 사용
     */
    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam String email) {
        boolean duplicated = memberService.isEmailDuplicated(email);
        return ResponseEntity.ok(new ApiResponse(true, duplicated ? "중복" : "사용 가능", duplicated));
    }

    // ----------------------------------------
    // 내부 DTO (예제용)
    // 실제 프로젝트에서는 별도 파일(dto 패키지)로 분리하는 것이 좋음
    // ----------------------------------------

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
