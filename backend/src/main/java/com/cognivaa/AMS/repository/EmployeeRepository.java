package com.cognivaa.AMS.repository;

import com.cognivaa.AMS.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EmployeeRepository extends JpaRepository<Employee, UUID> {
    Optional<Employee> findByEmployeeCode(String employeeCode);
    Optional<Employee> findByEmail(String email);
    List<Employee> findByNameContainingIgnoreCase(String name);
    List<Employee> findByPhone(String phone);
}