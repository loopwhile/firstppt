package com.example.demo.repository;

import com.example.demo.entity.Member;

import java.util.Optional;

/**
 * MemberRepositoryCustom
 *
 * - 목적: Spring Data JPA의 기본 인터페이스(JpaRepository)로 표현하기 애매한
 *   복잡한 쿼리(또는 QueryDSL 사용)를 분리해 구현하기 위한 커스텀 레포지토리 인터페이스입니다.
 *
 * - 주의:
 *   1) 단순 조회(예: findByEmail, existsByEmail)는 Spring Data의 파생 쿼리(derived query)로
 *      JpaRepository에서 바로 선언해도 됩니다. (간단하고 유지보수 쉬움)
 *   2) 이 인터페이스를 구현하려면 구현 클래스 이름 규칙을 지켜야 합니다.
 *      예: MemberRepositoryCustomImpl (또는 Spring Data가 기대하는 규칙)
 *
 * - 반환 타입 설명:
 *   Optional<T> : 값이 없을 수 있는 결과를 안전하게 처리할 때 사용.
 *   boolean     : 존재 여부만 확인할 때 사용 (exists).
 */
public interface MemberRepositoryCustom {

    /**
     * 이메일로 회원 조회 (존재할 수도/없을 수도 있음 -> Optional)
     * - QueryDSL이나 복잡한 JPQL로 구현할 경우 이 커스텀 메서드에 구현.
     */
    Optional<Member> findByEmail(String email);

    /**
     * 이메일 중복(존재) 확인
     * - DB에 존재하는지 여부만 빠르게 확인할 때 사용.
     * - 대량 데이터에서 count 쿼리보다 exists 최적화 고려.
     */
    boolean existsByEmail(String email);

    /**
     * 이름 + 전화번호로 회원 조회 (회원 찾기/비밀번호 찾기 등에 사용)
     * - 전화번호 컬럼명이 DB에 따라 다를 수 있으므로 매핑 주의.
     */
    Optional<Member> findByNameAndPhone(String name, String phoneNumber);
}
