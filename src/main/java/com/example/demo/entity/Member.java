package com.example.demo.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "first_ppt_member")   // DB 테이블명 지정
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;     // PK (자동증가)
    private String name;
    private String phone_number;
    private String email;
    private String password;
    private String store_name;
    private String store_manger_name;
    private String store_address;
    private String region;
    private String office_name;
    private String office_number;

}
