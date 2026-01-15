package com.cognivaa.AMS.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AttendanceByEmployeeCodeRequest(
    @NotBlank String employeeCode,
    @NotNull LocalDateTime dateTime
) {}
