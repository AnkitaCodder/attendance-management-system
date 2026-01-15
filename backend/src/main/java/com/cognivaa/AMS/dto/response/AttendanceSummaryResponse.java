package com.cognivaa.AMS.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record AttendanceSummaryResponse(
        UUID employeeId,
        String employeeName,
        List<InOutPair> attendancePairs
) {
    public record InOutPair(
            LocalDateTime inTime,
            LocalDateTime outTime,
            long hours,
            long minutes,
            long seconds
    ) {}
}