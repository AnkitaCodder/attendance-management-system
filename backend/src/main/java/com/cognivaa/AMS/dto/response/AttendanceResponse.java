package com.cognivaa.AMS.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
public record AttendanceResponse(
        UUID id,
        UUID employeeId,
        String employeeName,
        LocalDateTime dateTime
) {}