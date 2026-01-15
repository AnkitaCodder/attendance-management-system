package com.cognivaa.AMS.repository;

import com.cognivaa.AMS.entity.Attendance;
import com.cognivaa.AMS.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface AttendanceRepository extends JpaRepository<Attendance, UUID> {
    List<Attendance> findByEmployeeAndDateTimeBetweenOrderByDateTimeAsc(Employee employee, LocalDateTime startOfDay, LocalDateTime endOfDay);

}
