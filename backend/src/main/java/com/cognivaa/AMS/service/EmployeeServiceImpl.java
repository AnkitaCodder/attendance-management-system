package com.cognivaa.AMS.service;

import com.cognivaa.AMS.dto.request.EmployeeRequest;
import com.cognivaa.AMS.dto.response.EmployeeResponse;
import com.cognivaa.AMS.entity.Employee;
import com.cognivaa.AMS.exception.ResourceNotFoundException;
import com.cognivaa.AMS.repository.EmployeeRepository;
import com.cognivaa.AMS.util.ImageUtil;
import com.cognivaa.AMS.util.QRCodeGenerator;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.util.Units;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public EmployeeResponse create(EmployeeRequest request) {
        Employee employee = new Employee();
        employee.setEmployeeCode(request.employeeCode());
        employee.setName(request.name());
        employee.setEmail(request.email());
        employee.setPhone(request.phone());
        employee.setPassword(passwordEncoder.encode(request.password()));
        employee = employeeRepository.save(employee);

        String qrFilePath = QRCodeGenerator.saveQRCodeImageToFile(employee.getEmployeeCode(), employee.getEmployeeCode());
        employee.setQrCodePath(qrFilePath);
        employee = employeeRepository.save(employee); // update with QR path

        return mapToResponse(employee);
    }

    @Override
    public EmployeeResponse update(UUID id, EmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        employee.setEmployeeCode(request.employeeCode());
        employee.setName(request.name());
        employee.setEmail(request.email());
        employee.setPhone(request.phone());
        employee.setPassword(passwordEncoder.encode(request.password()));
        return mapToResponse(employeeRepository.save(employee));
    }

    @Override
    public void delete(UUID id) {
        employeeRepository.deleteById(id);
    }

    @Override
    public Page<EmployeeResponse> getAllEmployees(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Employee> employeesPage = employeeRepository.findAll(pageable);

        return employeesPage.map(this::mapToResponse);
    }

    @Override
    public Optional<EmployeeResponse> findByEmployeeCode(String employeeCode) {
        return employeeRepository.findByEmployeeCode(employeeCode)
                .map(this::mapToResponse);
    }

    @Override
    public Optional<EmployeeResponse> findByEmail(String email) {
        return employeeRepository.findByEmail(email)
                .map(this::mapToResponse);
    }

    @Override
    public List<EmployeeResponse> findByName(String name) {
        return employeeRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmployeeResponse> findByPhone(String phone) {
        return employeeRepository.findByPhone(phone)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private EmployeeResponse mapToResponse(Employee employee) {
        String qrBase64 = "";
        if (employee.getQrCodePath() != null) {
            qrBase64 = ImageUtil.encodeFileToBase64(employee.getQrCodePath());
        }

        return new EmployeeResponse(
                employee.getId(),
                employee.getEmployeeCode(),
                employee.getName(),
                employee.getEmail(),
                employee.getPhone(),
                employee.getQrCodePath(),  // stored on disk
                qrBase64                  // returned to frontend
        );
    }

    @Override
    public EmployeeResponse getById(UUID id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        return mapToResponse(employee);
    }

    @Override
    public List<EmployeeResponse> uploadEmployeesFromExcel(MultipartFile file) {
        List<EmployeeResponse> savedEmployees = new ArrayList<>();
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            boolean firstRow = true;
            for (Row row : sheet) {
                if (firstRow) {
                    firstRow = false; // skip header
                    continue;
                }

                String name = getCellValue(row.getCell(0));
                String code = getCellValue(row.getCell(1));
                String designation = getCellValue(row.getCell(2));
                String phone = getCellValue(row.getCell(3));

                EmployeeRequest request = new EmployeeRequest(
                        code,
                        name,
                        code.toLowerCase() + "@company.com", // dummy email
                        phone,
                        "password" // default password
                );

                // Check duplicate by employee code
                if (employeeRepository.findByEmployeeCode(code).isEmpty()) {
                    savedEmployees.add(create(request));
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to process Excel file", e);
        }
        return savedEmployees;
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> "";
        };
    }

    @Override
    public byte[] generateQRCodeDoc() {
        try (XWPFDocument document = new XWPFDocument()) {
            List<Employee> employees = employeeRepository.findAll();

            XWPFTable table = document.createTable();
            table.setWidth("100%");

            for (Employee emp : employees) {
                if (emp.getQrCodePath() == null) continue;

                XWPFTableRow row = table.createRow();
                row.getCell(0).setText(""); // Initialize first cell
                row.addNewTableCell();      // Create second cell manually

                // --- Column 1: QR Code Image ---
                XWPFParagraph imageParagraph = row.getCell(0).addParagraph();
                row.getCell(0).removeParagraph(0); // remove default
                XWPFRun imageRun = imageParagraph.createRun();

                File qrFile = new File(emp.getQrCodePath());
                if (qrFile.exists()) {
                    InputStream pic = new FileInputStream(qrFile);
                    imageRun.addPicture(
                            pic,
                            Document.PICTURE_TYPE_PNG,
                            qrFile.getName(),
                            Units.toEMU(100),  // width
                            Units.toEMU(100)   // height
                    );
                    pic.close();
                }

                // --- Column 2: Employee Code and Name ---
                XWPFParagraph textParagraph = row.getCell(1).addParagraph();
                row.getCell(1).removeParagraph(0);
                XWPFRun textRun = textParagraph.createRun();
                textRun.setText("Employee Code: " + emp.getEmployeeCode());
                textRun.addBreak();
                textRun.setText("Name: " + emp.getName());
                textRun.setFontSize(12);
            }

            // Write to byte array
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.write(out);
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Word document", e);
        }
    }

    @Override
    public List<EmployeeResponse> regenerateAllQRCodes() {
        List<Employee> employees = employeeRepository.findAll();
        List<EmployeeResponse> updatedList = new ArrayList<>();

        String folderPath = "uploads/qrcodes";
        File dir = new File(folderPath);
        if (!dir.exists()) {
            dir.mkdirs(); // create folder if not exists
        }

        for (Employee emp : employees) {
            if (emp.getEmployeeCode() == null || emp.getEmployeeCode().isBlank()) continue;

            // Generate QR and save file
            String qrFilePath = QRCodeGenerator.saveQRCodeImageToFile(emp.getEmployeeCode(), emp.getEmployeeCode());
            emp.setQrCodePath(qrFilePath);
            employeeRepository.save(emp);

            updatedList.add(mapToResponse(emp));
        }

        return updatedList;
    }

    @Override
    public long getEmployeeCount() {
        return employeeRepository.count();
    }
}