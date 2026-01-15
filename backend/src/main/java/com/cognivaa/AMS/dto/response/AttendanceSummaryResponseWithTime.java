package com.cognivaa.AMS.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record AttendanceSummaryResponseWithTime (
        UUID employeeId,
        String employeeName,
        LocalDateTime firstInTime,
        LocalDateTime lastOutTime,
        long totalHours,
        long totalMinutes,
        long totalSeconds,
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