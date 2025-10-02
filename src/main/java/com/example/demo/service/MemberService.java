package com.example.demo.service;

import com.example.demo.dto.MemberDTO;
import com.example.demo.entity.Member;
import com.example.demo.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 기존(원본) MemberService - 교육용 주석 추가
 *
 * 주의사항:
 * - 현재 코드에서는 비밀번호를 평문(plain text)으로 DB에 저장합니다. 절대 실무에서는 이렇게 하면 안 됩니다.
 * - 입력 검증(@Valid), 트랜잭션 경계(@Transactional), 예외 종류(IllegalArgumentException 대신 커스텀 예외)를 적용하는 것을 권장합니다.
 */
@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public Member signup(MemberDTO dto) {
        // 이메일 중복 체크(동시성 문제: DB unique 제약으로도 방어 필요)
        if (memberRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        // Member 엔티티 생성
        Member m = new Member(
                dto.getId(),
                dto.getName(),
                dto.getPhone_number(),
                dto.getEmail(),
                dto.getPassword(),
                dto.getStore_name(),
                dto.getStore_manger_name(),
                dto.getStore_address(),
                dto.getRegion(),
                dto.getOffice_name(),
                dto.getOffice_number()
        );

        return memberRepository.save(m);
    }

    public Member login(String email, String password) {
        // 이메일로 회원 조회
        Member m = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 계정입니다."));
        if (!m.getPassword().equals(password)) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }
        return m;
    }

    public boolean isEmailDuplicated(String email) {
        return memberRepository.existsByEmail(email);
    }
}
