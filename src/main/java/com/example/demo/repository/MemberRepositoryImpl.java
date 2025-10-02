package com.example.demo.repository;

import com.example.demo.entity.Member;
import com.example.demo.entity.QMember;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 커스텀 레포지토리 구현체 (QueryDSL 사용)
 *
 * 역할:
 *  - MemberRepositoryCustom 인터페이스에 선언된 복잡한 DB 조회 로직을 QueryDSL로 구현.
 *  - JPAQueryFactory를 주입받아 type-safe한 쿼리를 작성.
 *
 * 주의:
 *  - 클래스명(MemberRepositoryImpl)은 스프링 데이터의 커스텀 구현체 네이밍 규칙에 맞게 작성되어야
 *    스프링이 자동으로 이 구현체를 MemberRepository와 연결합니다.
 *    (규칙: 리포지토리 인터페이스명 + "Impl" 또는 커스텀 네임 규칙; 프로젝트 설정/스프링 버전에 따라 다를 수 있으므로 확인 필요)
 */
@Repository
@RequiredArgsConstructor // final 필드를 생성자 주입해 줌 (Lombok)
public class MemberRepositoryImpl implements MemberRepositoryCustom {

    // QueryDSL의 핵심 객체(JPAQueryFactory)를 주입받음
    private final JPAQueryFactory queryFactory;

    // Q 타입은 static으로 재사용하면 편리 (QMember.member는 Q 클래스에서 제공되는 싱글톤 표현)
    private static final QMember m = QMember.member;

    /**
     * 이메일로 회원 조회 (Optional 반환)
     * - fetchFirst(): 결과 중 첫 번째(=limit 1)를 가져옴. 결과가 없으면 null 반환.
     * - fetchOne()과 다른점: fetchOne()은 결과가 2개 이상이면 예외(NonUniqueResultException)를 던짐.
     */
    @Override
    public Optional<Member> findByEmail(String email) {
        // 입력값 null/빈문자에 대한 방어로직 추가 권장(예: StringUtils.hasText)
        Member result = queryFactory
                .selectFrom(m)
                .where(m.email.eq(email))
                .fetchFirst(); // limit 1
        return Optional.ofNullable(result);
    }

    /**
     * 이메일 존재 여부 확인 (exists)
     * - id 컬럼만 조회(fetchFirst)해서 null 체크: 존재 여부만 빠르게 확인하려는 최적화 기법
     * - DB에 인덱스(email)에 유니크/인덱스가 있어야 성능이 좋음
     */
    @Override
    public boolean existsByEmail(String email) {
        Long id = queryFactory
                .select(m.id)
                .from(m)
                .where(m.email.eq(email))
                .fetchFirst(); // id가 하나라도 있으면 리턴
        return id != null;
    }

    /**
     * 이름 + 전화번호로 회원 조회 (예: 본인확인, 비밀번호 찾기)
     * - 엔티티 필드명이 snake_case로 정의되어 있다면 Q 클래스 필드도 동일 이름으로 생성됨.
     *   (예: entity의 필드가 phone_number라면 QMember.phone_number 가 존재함)
     * - 주의: 필드 네이밍 컨벤션(camelCase 권장)과 Q 클래스 생성 결과를 함께 설명해줄 것
     */
    @Override
    public Optional<Member> findByNameAndPhone(String name, String phoneNumber) {
        Member result = queryFactory
                .selectFrom(m)
                .where(
                        m.name.eq(name),
                        m.phone_number.eq(phoneNumber) // 엔티티 필드명이 phone_number이면 Q 필드도 이 이름
                )
                .fetchFirst();
        return Optional.ofNullable(result);
    }
}
