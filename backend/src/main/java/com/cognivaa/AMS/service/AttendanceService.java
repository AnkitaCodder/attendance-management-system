package com.cognivaa.AMS.service;

import com.cognivaa.AMS.dto.request.AttendanceByEmployeeCodeRequest;
import com.cognivaa.AMS.dto.request.AttendanceRequest;
import com.cognivaa.AMS.dto.response.AttendanceResponse;
import com.cognivaa.AMS.dto.response.AttendanceSummaryResponse;
import com.cognivaa.AMS.dto.response.AttendanceSummaryResponseWithTime;

import java.util.List;
import java.util.UUID;

public interface AttendanceService {
    AttendanceResponse create(AttendanceRequest request);
    AttendanceResponse getById(UUID id);
    List<AttendanceResponse> getAllAttendances();
    AttendanceResponse update(UUID id, AttendanceRequest request);
    void delete(UUID id);
    AttendanceResponse createByEmployeeCode(AttendanceByEmployeeCodeRequest request);
    AttendanceSummaryResponse getTodaySummaryByEmployeeId(UUID employeeId);
    List<AttendanceSummaryResponseWithTime> getTodaySummaryForAllEmployees();
}
