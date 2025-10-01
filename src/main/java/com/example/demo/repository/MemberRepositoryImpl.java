package com.example.demo.repository;

import com.example.demo.entity.Member;
import com.example.demo.entity.QMember;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class MemberRepositoryImpl implements MemberRepositoryCustom {

    private final JPAQueryFactory queryFactory;
    private static final QMember m = QMember.member;

    @Override
    public Optional<Member> findByEmail(String email) {
        Member result = queryFactory
                .selectFrom(m)
                .where(m.email.eq(email))
                .fetchFirst();
        return Optional.ofNullable(result);
    }

    @Override
    public boolean existsByEmail(String email) {
        Long id = queryFactory
                .select(m.id)
                .from(m)
                .where(m.email.eq(email))
                .fetchFirst();
        return id != null;
    }

    @Override
    public Optional<Member> findByNameAndPhone(String name, String phoneNumber) {
        Member result = queryFactory
                .selectFrom(m)
                .where(
                        m.name.eq(name),
                        m.phone_number.eq(phoneNumber) // 이제 String이므로 OK
                )
                .fetchFirst();
        return Optional.ofNullable(result);
    }
}