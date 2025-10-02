package com.example.demo.repository;

import com.example.demo.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * MemberRepository
 *
 * - JpaRepository<T, ID>를 상속하면 기본적인 CRUD, 페이징, 정렬 메서드를 모두 사용할 수 있습니다.
 *   예: save, findById, findAll, deleteById, findAll(Pageable) 등
 *
 * - MemberRepositoryCustom을 추가 상속하고 있으므로, 커스텀 구현체를 통해 복잡한 쿼리(QueryDSL 등)를 확장할 수 있습니다.
 *   Spring Data JPA는 "인터페이스명 + Impl" 규칙으로 커스텀 구현체를 자동으로 연결합니다.
 *   예: MemberRepositoryCustomImpl 클래스가 있어야 스프링이 자동으로 주입합니다.
 *
 * 사용 예:
 *   - memberRepository.findById(1L)
 *   - memberRepository.save(member)
 *   - memberRepository.customFindBySomeCondition(...)
 *
 * 주의:
 *   - 커스텀 구현체 이름 규칙을 지키지 않으면(Impl 누락 등) 스프링이 구현체를 찾지 못해 NoSuchBeanDefinition 예외가 발생합니다.
 *   - 테스트 시 @DataJpaTest 등으로 레포지토리를 로드하면 커스텀 구현체도 함께 로드되는지 확인하세요.
 */
public interface MemberRepository extends JpaRepository<Member, Long>, MemberRepositoryCustom {
    // (선택) 간단한 파생 쿼리 메서드 예시 (메소드 이름으로 쿼리 생성)
    // Optional<Member> findByEmail(String email);
    // boolean existsByEmail(String email);
}
