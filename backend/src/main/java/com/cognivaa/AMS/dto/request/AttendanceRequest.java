package com.cognivaa.AMS.dto.request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record AttendanceRequest(
        @NotNull UUID employeeId,
        @NotNull LocalDateTime dateTime
) {}