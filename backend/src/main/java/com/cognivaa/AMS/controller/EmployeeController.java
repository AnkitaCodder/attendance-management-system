package com.cognivaa.AMS.controller;

import com.cognivaa.AMS.dto.request.EmployeeRequest;
import com.cognivaa.AMS.dto.response.EmployeeResponse;
import com.cognivaa.AMS.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PostMapping
    public EmployeeResponse create(@Valid @RequestBody EmployeeRequest request) {
        return employeeService.create(request);
    }

    @PutMapping("/{id}")
    public EmployeeResponse update(@PathVariable UUID id, @Valid @RequestBody EmployeeRequest request) {
        return employeeService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        employeeService.delete(id);
    }

    @GetMapping
    public Page<EmployeeResponse> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        return employeeService.getAllEmployees(page, size, sortBy, sortDir);
    }


    @GetMapping("/{id}")
    public EmployeeResponse getById(@PathVariable UUID id) {
        return employeeService.getById(id);
    }

    @PostMapping("/upload")
    public List<EmployeeResponse> uploadExcel(@RequestParam("file") MultipartFile file) {
        return employeeService.uploadEmployeesFromExcel(file);
    }

    @GetMapping("/qrcodes-doc")
    public ResponseEntity<byte[]> generateQRCodeDoc() {
        byte[] document = employeeService.generateQRCodeDoc();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDisposition(ContentDisposition.attachment().filename("Employee_QRCodes.docx").build());
        return new ResponseEntity<>(document, headers, HttpStatus.OK);
    }

    @GetMapping("/generate-qrcodes")
    public List<EmployeeResponse> generateQRCodesForAllEmployees() {
        return employeeService.regenerateAllQRCodes();
    }

    @GetMapping("/count")
    public long getEmployeeCount() {
        return employeeService.getEmployeeCount();
    }


}