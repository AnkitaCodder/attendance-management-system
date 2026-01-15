package com.cognivaa.AMS.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String employeeCode;

    private String name;
    private String email;
    private String phone;

    private String password; // Encrypted (BCrypt)

    private String qrCodePath;

    @OneToMany(mappedBy = "employee")
    private List<Attendance> attendances = new ArrayList<>();
}