package com.cognivaa.AMS.controller;

import com.cognivaa.AMS.service.AttendanceReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
@RestController
@RequestMapping("/api/attendance-report")
public class AttendanceReportController {
    private final AttendanceReportService reportService;

    public AttendanceReportController(AttendanceReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadAttendanceReport(
            @RequestParam("fromDate") @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate fromDate,
            @RequestParam("toDate") @DateTimeFormat(pattern = "dd-MM-yyyy") LocalDate toDate
    ) throws Exception {

        ByteArrayInputStream in = reportService.generateAttendanceReport(fromDate, toDate);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=attendance_report.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(in.readAllBytes());
    }
}
