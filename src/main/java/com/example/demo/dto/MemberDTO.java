package com.example.demo.dto;

import lombok.Data;

@Data
public class MemberDTO {

    private Long id;
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
