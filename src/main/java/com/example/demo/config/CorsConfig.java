package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS 설정 클래스
 *
 * - 목적: 브라우저에서 다른 출처(origin)로부터 온 요청(예: React 개발서버 http://localhost:3000)을 허용하기 위함.
 * - 사용 시기: 프론트엔드(별도 포트/도메인)와 백엔드를 분리해서 개발/배포할 때 주로 필요합니다.
 *
 * 1) CORS는 브라우저의 보안 정책(동일 출처 정책)을 우회하기 위해 서버가 명시적으로 허용해야 동작합니다.
 * 2) 서버에서 허용한 출처(Origin)와 요청 메서드만 브라우저가 허용합니다.
 */
@Configuration
public class CorsConfig {

    /**
     * WebMvcConfigurer 빈을 등록하여 전역 CORS 설정을 수행합니다.
     *
     * 반환되는 WebMvcConfigurer 내부에서 addCorsMappings를 오버라이드해 CORS 규칙을 등록합니다.
     * 이 방법은 Spring MVC 기반 애플리케이션에서 전역적으로 작동합니다.
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            /**
             * CORS 매핑을 추가하는 메서드
             *
             * registry.addMapping("/api/**") :
             *   - "/api/**"로 시작하는 모든 엔드포인트에 대해 CORS 규칙을 적용
             *   - 필요에 따라 "/**"로 전체 경로에 적용할 수도 있음(보안상 주의)
             *
             * .allowedOrigins("http://localhost:3000") :
             *   - 허용할 출처(Origin)를 명시. 개발 중 React(또는 다른 프론트)에서 오는 요청을 허용.
             *   - 와일드카드("*") 사용 시 allowCredentials(true)와 함께 사용할 수 없음(브라우저 정책).
             *
             * .allowedMethods("GET","POST","PUT","DELETE","OPTIONS") :
             *   - 브라우저가 보낼 수 있는 HTTP 메서드(특히 preflight(OPTIONS) 포함).
             *
             * .allowCredentials(true) :
             *   - 쿠키, 인증 헤더 같은 자격증명(credential)을 포함하는 요청을 허용.
             *   - true로 설정하면 allowedOrigins가 "*"이면 안 됨(보안/명세 상의 제한).
             */
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET","POST","PUT","DELETE","OPTIONS")
                        .allowCredentials(true);
            }
        };
    }
}
