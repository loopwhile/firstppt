package com.example.demo.service;


import com.example.demo.dto.MemberDTO;
import com.example.demo.entity.Member;
import com.example.demo.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public Member signup(MemberDTO dto) {
        if (memberRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        Member m = new Member(
                dto.getId(),
                dto.getName(),
                dto.getPhone_number(),
                dto.getEmail(),
                dto.getPassword(),   // 평문 그대로 저장
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