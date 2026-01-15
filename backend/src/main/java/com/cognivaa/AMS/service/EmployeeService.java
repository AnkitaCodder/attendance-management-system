package com.cognivaa.AMS.service;

import com.cognivaa.AMS.dto.request.EmployeeRequest;
import com.cognivaa.AMS.dto.response.EmployeeResponse;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EmployeeService {
    EmployeeResponse create(EmployeeRequest request);
    EmployeeResponse update(UUID id, EmployeeRequest request);
    void delete(UUID id);

    Page<EmployeeResponse> getAllEmployees(int page, int size, String sortBy, String sortDir);

    EmployeeResponse getById(UUID id); // new method

    Optional<EmployeeResponse> findByEmployeeCode(String employeeCode);
    Optional<EmployeeResponse> findByEmail(String email);
    List<EmployeeResponse> findByName(String name);
    List<EmployeeResponse> findByPhone(String phone);
    List<EmployeeResponse> uploadEmployeesFromExcel(MultipartFile file);
    byte[] generateQRCodeDoc();
    List<EmployeeResponse> regenerateAllQRCodes();
    long getEmployeeCount();
}
