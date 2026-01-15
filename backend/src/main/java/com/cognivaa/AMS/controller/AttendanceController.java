package com.cognivaa.AMS.controller;

import com.cognivaa.AMS.dto.request.AttendanceByEmployeeCodeRequest;
import com.cognivaa.AMS.dto.request.AttendanceRequest;
import com.cognivaa.AMS.dto.response.AttendanceResponse;
import com.cognivaa.AMS.dto.response.AttendanceSummaryResponse;
import com.cognivaa.AMS.dto.response.AttendanceSummaryResponseWithTime;
import com.cognivaa.AMS.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/attendances")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping
    public AttendanceResponse create(@Valid @RequestBody AttendanceRequest request) {
        return attendanceService.create(request);
    }

    @PostMapping("/by-employee-code")
    public AttendanceResponse createByEmployeeCode(@Valid @RequestBody AttendanceByEmployeeCodeRequest request) {
        return attendanceService.createByEmployeeCode(request);
    }

    @GetMapping("/{id}")
    public AttendanceResponse getById(@PathVariable UUID id) {
        return attendanceService.getById(id);
    }

    @GetMapping
    public List<AttendanceResponse> getAll() {
        return attendanceService.getAllAttendances();
    }

    @PutMapping("/{id}")
    public AttendanceResponse update(@PathVariable UUID id, @Valid @RequestBody AttendanceRequest request) {
        return attendanceService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        attendanceService.delete(id);
    }

    @GetMapping("/summary/today/{employeeId}")
    public AttendanceSummaryResponse getTodaySummary(@PathVariable UUID employeeId) {
        return attendanceService.getTodaySummaryByEmployeeId(employeeId);
    }

    @GetMapping("/summary/today")
    public List<AttendanceSummaryResponseWithTime> getTodaySummaryForAllEmployees() {
        return attendanceService.getTodaySummaryForAllEmployees();
    }

}
