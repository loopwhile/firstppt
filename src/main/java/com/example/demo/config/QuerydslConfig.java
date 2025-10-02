package com.example.demo.config;

import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * QueryDSL 설정 클래스
 *
 * - 목적: 애플리케이션 전역에서 QueryDSL의 JPAQueryFactory를 DI 받아 사용할 수 있게 빈으로 등록합니다.
 * - JPAQueryFactory는 EntityManager를 사용해 type-safe한 쿼리를 생성하는 중심 객체입니다.
 * - 보통 싱글톤 빈으로 등록해서 애플리케이션 전체에서 재사용합니다.
 */
@Configuration
public class QuerydslConfig {

    /**
     * JPAQueryFactory 빈 등록
     *
     * Spring이 관리하는 EntityManager(프록시, 트랜잭션 범위에 따라 동작)를 주입받아
     * JPAQueryFactory를 생성합니다.
     *
     * @param em Spring이 주입해주는 EntityManager
     * @return 애플리케이션 전역에서 재사용할 JPAQueryFactory 빈
     */
    @Bean
    public JPAQueryFactory jpaQueryFactory(EntityManager em) {
        // JPAQueryFactory는 내부적으로 thread-safe 하여 싱글톤으로 등록해도 안전합니다.
        // (EntityManager는 트랜잭션 경계에서 동작하는 프록시 객체로 제공되므로 문제 없음)
        return new JPAQueryFactory(em);
    }
}
