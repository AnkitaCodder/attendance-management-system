package com.cognivaa.AMS.dto.request;
import jakarta.validation.constraints.NotBlank;

public record EmployeeRequest(
        @NotBlank String employeeCode,
        @NotBlank String name,
        @NotBlank String email,
        @NotBlank String phone,
        @NotBlank String password
) {}