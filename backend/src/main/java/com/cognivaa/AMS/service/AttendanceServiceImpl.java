package com.cognivaa.AMS.service;

import com.cognivaa.AMS.dto.request.AttendanceByEmployeeCodeRequest;
import com.cognivaa.AMS.dto.request.AttendanceRequest;
import com.cognivaa.AMS.dto.response.AttendanceResponse;
import com.cognivaa.AMS.dto.response.AttendanceSummaryResponse;
import com.cognivaa.AMS.dto.response.AttendanceSummaryResponseWithTime;
import com.cognivaa.AMS.entity.Attendance;
import com.cognivaa.AMS.entity.Employee;
import com.cognivaa.AMS.exception.ResourceNotFoundException;
import com.cognivaa.AMS.repository.AttendanceRepository;
import com.cognivaa.AMS.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Override
    public AttendanceResponse create(AttendanceRequest request) {
        Employee employee = employeeRepository.findById(request.employeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        Attendance attendance = new Attendance();
        attendance.setEmployee(employee);
        attendance.setDateTime(request.dateTime());

        attendance = attendanceRepository.save(attendance);
        return mapToResponse(attendance);
    }

    @Override
    public AttendanceResponse getById(UUID id) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found"));
        return mapToResponse(attendance);
    }

    @Override
    public List<AttendanceResponse> getAllAttendances() {
        return attendanceRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AttendanceResponse update(UUID id, AttendanceRequest request) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found"));

        Employee employee = employeeRepository.findById(request.employeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        attendance.setEmployee(employee);
        attendance.setDateTime(request.dateTime());

        attendance = attendanceRepository.save(attendance);
        return mapToResponse(attendance);
    }

    @Override
    public void delete(UUID id) {
        attendanceRepository.deleteById(id);
    }

    @Override
    public AttendanceResponse createByEmployeeCode(AttendanceByEmployeeCodeRequest request) {
        Employee employee = employeeRepository.findByEmployeeCode(request.employeeCode())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with code: " + request.employeeCode()));

        Attendance attendance = new Attendance();
        attendance.setEmployee(employee);
        attendance.setDateTime(request.dateTime());

        attendance = attendanceRepository.save(attendance);
        return mapToResponse(attendance);
    }

    @Override
    public AttendanceSummaryResponse getTodaySummaryByEmployeeId(UUID employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        List<Attendance> todayAttendances = attendanceRepository
                .findByEmployeeAndDateTimeBetweenOrderByDateTimeAsc(employee, startOfDay, endOfDay);

        List<AttendanceSummaryResponse.InOutPair> pairs = new ArrayList<>();

        int i = 0;
        while (i < todayAttendances.size()) {
            LocalDateTime in = todayAttendances.get(i).getDateTime();
            LocalDateTime out = null;

            if (i + 1 < todayAttendances.size()) {
                out = todayAttendances.get(i + 1).getDateTime();
            }

            // If out is missing, use current time for duration
            LocalDateTime effectiveOut = (out != null) ? out : LocalDateTime.now();

            long seconds = Duration.between(in, effectiveOut).getSeconds();
            long hours = seconds / 3600;
            long minutes = (seconds % 3600) / 60;
            long remSeconds = seconds % 60;

            pairs.add(new AttendanceSummaryResponse.InOutPair(in, (out != null ? out : null), hours, minutes, remSeconds));

            i += 2; // move to next in-out pair
        }

        return new AttendanceSummaryResponse(employee.getId(), employee.getName(), pairs);
    }

    @Override
    public List<AttendanceSummaryResponseWithTime> getTodaySummaryForAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        List<AttendanceSummaryResponseWithTime> result = new ArrayList<>();

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        for (Employee employee : employees) {
            List<Attendance> attendances = attendanceRepository
                    .findByEmployeeAndDateTimeBetweenOrderByDateTimeAsc(employee, startOfDay, endOfDay);

            if (attendances.isEmpty()) continue;

            List<AttendanceSummaryResponseWithTime.InOutPair> pairs = new ArrayList<>();
            LocalDateTime firstInTime = null;
            LocalDateTime lastOutTime = null;
            long totalSeconds = 0;

            int i = 0;
            while (i < attendances.size()) {
                LocalDateTime in = attendances.get(i).getDateTime();
                LocalDateTime out = null;

                if (i + 1 < attendances.size()) {
                    out = attendances.get(i + 1).getDateTime();
                }

                LocalDateTime effectiveOut = (out != null) ? out : LocalDateTime.now();
                long seconds = Duration.between(in, effectiveOut).getSeconds();
                long hours = seconds / 3600;
                long minutes = (seconds % 3600) / 60;
                long remSeconds = seconds % 60;

                totalSeconds += seconds;
                pairs.add(new AttendanceSummaryResponseWithTime.InOutPair(in, out, hours, minutes, remSeconds));

                if (firstInTime == null) {
                    firstInTime = in;
                }
                if (out != null) {
                    lastOutTime = out;
                }

                i += 2;
            }

            if (attendances.size() % 2 != 0) {
                lastOutTime = null;
            }

            long totalHours = totalSeconds / 3600;
            long totalMinutes = (totalSeconds % 3600) / 60;
            long totalRemSeconds = totalSeconds % 60;

            result.add(new AttendanceSummaryResponseWithTime(
                    employee.getId(),
                    employee.getName(),
                    firstInTime,
                    lastOutTime,
                    totalHours,
                    totalMinutes,
                    totalRemSeconds,
                    pairs
            ));
        }

        return result;
    }




    private AttendanceResponse mapToResponse(Attendance attendance) {
        return new AttendanceResponse(
                attendance.getId(),
                attendance.getEmployee().getId(),
                attendance.getEmployee().getName(),
                attendance.getDateTime()
        );
    }
}