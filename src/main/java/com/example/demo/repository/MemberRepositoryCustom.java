package com.example.demo.repository;

import com.example.demo.entity.Member;

import java.util.Optional;

public interface MemberRepositoryCustom {

    Optional<Member> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<Member> findByNameAndPhone(String name, String phoneNumber);
}
