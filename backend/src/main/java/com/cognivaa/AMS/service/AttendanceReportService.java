package com.cognivaa.AMS.service;

import com.cognivaa.AMS.entity.Attendance;
import com.cognivaa.AMS.entity.Employee;
import com.cognivaa.AMS.repository.AttendanceRepository;
import com.cognivaa.AMS.repository.EmployeeRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class AttendanceReportService {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;

    // Modern Color Palette (RGB values)
    private static final byte[] CORPORATE_BLUE = {(byte) 31, (byte) 81, (byte) 156};      // #1F519C
    private static final byte[] LIGHT_BLUE = {(byte) 173, (byte) 216, (byte) 230};       // #ADD8E6
    private static final byte[] SUCCESS_GREEN = {(byte) 76, (byte) 175, (byte) 80};      // #4CAF50
    private static final byte[] ERROR_RED = {(byte) 244, (byte) 67, (byte) 54};          // #F44336
    private static final byte[] NEUTRAL_GRAY = {(byte) 245, (byte) 245, (byte) 245};     // #F5F5F5
    private static final byte[] ACCENT_ORANGE = {(byte) 255, (byte) 152, (byte) 0};      // #FF9800
    private static final byte[] DARK_GRAY = {(byte) 97, (byte) 97, (byte) 97};           // #616161
    private static final byte[] WHITE = {(byte) 255, (byte) 255, (byte) 255};            // #FFFFFF

    public AttendanceReportService(EmployeeRepository employeeRepository, AttendanceRepository attendanceRepository) {
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
    }

    public ByteArrayInputStream generateAttendanceReport(LocalDate startDate, LocalDate endDate) throws Exception {
        List<Employee> employees = employeeRepository.findAll();

        XSSFWorkbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Attendance Report");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

        // ====== Enhanced Modern Styles ======

        // Corporate Title Style
        XSSFCellStyle titleStyle = workbook.createCellStyle();
        XSSFFont titleFont = workbook.createFont();
        titleFont.setBold(true);
        titleFont.setFontHeightInPoints((short) 18);
        titleFont.setColor(new XSSFColor(CORPORATE_BLUE, null));
        titleFont.setFontName("Calibri");
        titleStyle.setFont(titleFont);
        titleStyle.setAlignment(HorizontalAlignment.CENTER);
        titleStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        titleStyle.setFillForegroundColor(new XSSFColor(WHITE, null));
        titleStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        addBorders(titleStyle, BorderStyle.MEDIUM, new XSSFColor(CORPORATE_BLUE, null));

        // Modern Header Style
        XSSFCellStyle headerStyle = workbook.createCellStyle();
        XSSFFont headerFont = workbook.createFont();
        headerFont.setBold(true);
        headerFont.setFontHeightInPoints((short) 11);
        headerFont.setColor(new XSSFColor(WHITE, null));
        headerFont.setFontName("Calibri");
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(new XSSFColor(CORPORATE_BLUE, null));
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headerStyle.setAlignment(HorizontalAlignment.CENTER);
        headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        addBorders(headerStyle, BorderStyle.THIN, new XSSFColor(WHITE, null));

        // Employee Name Column Style
        XSSFCellStyle nameStyle = workbook.createCellStyle();
        XSSFFont nameFont = workbook.createFont();
        nameFont.setBold(true);
        nameFont.setFontHeightInPoints((short) 10);
        nameFont.setColor(new XSSFColor(DARK_GRAY, null));
        nameFont.setFontName("Calibri");
        nameStyle.setFont(nameFont);
        nameStyle.setFillForegroundColor(new XSSFColor(LIGHT_BLUE, null));
        nameStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        nameStyle.setAlignment(HorizontalAlignment.LEFT);
        nameStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        addBorders(nameStyle, BorderStyle.THIN, new XSSFColor(CORPORATE_BLUE, null));

        // Present Status Style
        XSSFCellStyle presentStyle = workbook.createCellStyle();
        XSSFFont presentFont = workbook.createFont();
        presentFont.setBold(true);
        presentFont.setFontHeightInPoints((short) 12);
        presentFont.setColor(new XSSFColor(SUCCESS_GREEN, null));
        presentFont.setFontName("Segoe UI Symbol");
        presentStyle.setFont(presentFont);
        presentStyle.setAlignment(HorizontalAlignment.CENTER);
        presentStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        presentStyle.setFillForegroundColor(new XSSFColor(WHITE, null));
        presentStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        addBorders(presentStyle, BorderStyle.THIN, new XSSFColor(SUCCESS_GREEN, null));

        // Absent Status Style
        XSSFCellStyle absentStyle = workbook.createCellStyle();
        XSSFFont absentFont = workbook.createFont();
        absentFont.setBold(true);
        absentFont.setFontHeightInPoints((short) 12);
        absentFont.setColor(new XSSFColor(ERROR_RED, null));
        absentFont.setFontName("Segoe UI Symbol");
        absentStyle.setFont(absentFont);
        absentStyle.setAlignment(HorizontalAlignment.CENTER);
        absentStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        absentStyle.setFillForegroundColor(new XSSFColor(WHITE, null));
        absentStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        addBorders(absentStyle, BorderStyle.THIN, new XSSFColor(ERROR_RED, null));

        // Alternating Row Style for Better Readability
        XSSFCellStyle altRowNameStyle = workbook.createCellStyle();
        altRowNameStyle.cloneStyleFrom(nameStyle);
        altRowNameStyle.setFillForegroundColor(new XSSFColor(NEUTRAL_GRAY, null));

        XSSFCellStyle altRowPresentStyle = workbook.createCellStyle();
        altRowPresentStyle.cloneStyleFrom(presentStyle);
        altRowPresentStyle.setFillForegroundColor(new XSSFColor(NEUTRAL_GRAY, null));

        XSSFCellStyle altRowAbsentStyle = workbook.createCellStyle();
        altRowAbsentStyle.cloneStyleFrom(absentStyle);
        altRowAbsentStyle.setFillForegroundColor(new XSSFColor(NEUTRAL_GRAY, null));

        // Summary Row Style
        XSSFCellStyle summaryStyle = workbook.createCellStyle();
        XSSFFont summaryFont = workbook.createFont();
        summaryFont.setBold(true);
        summaryFont.setFontHeightInPoints((short) 10);
        summaryFont.setColor(new XSSFColor(WHITE, null));
        summaryFont.setFontName("Calibri");
        summaryStyle.setFont(summaryFont);
        summaryStyle.setFillForegroundColor(new XSSFColor(ACCENT_ORANGE, null));
        summaryStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        summaryStyle.setAlignment(HorizontalAlignment.CENTER);
        summaryStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        addBorders(summaryStyle, BorderStyle.MEDIUM, new XSSFColor(DARK_GRAY, null));

        // Summary Label Style
        XSSFCellStyle summaryLabelStyle = workbook.createCellStyle();
        summaryLabelStyle.cloneStyleFrom(summaryStyle);
        summaryLabelStyle.setAlignment(HorizontalAlignment.LEFT);

        // ====== Create Report Content ======

        int totalDays = (int) (endDate.toEpochDay() - startDate.toEpochDay()) + 1;

        // Title Row with Enhanced Formatting
        Row titleRow = sheet.createRow(0);
        titleRow.setHeightInPoints(35);
        Cell titleCell = titleRow.createCell(0);
        titleCell.setCellValue("📊 ATTENDANCE REPORT | " +
                formatter.format(startDate) + " → " + formatter.format(endDate));
        titleCell.setCellStyle(titleStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, totalDays));

        // Add empty row for spacing
        sheet.createRow(1);

        // Header Row
        Row headerRow = sheet.createRow(2);
        headerRow.setHeightInPoints(25);
        Cell empHeaderCell = headerRow.createCell(0);
        empHeaderCell.setCellValue("👤 EMPLOYEE NAME");
        empHeaderCell.setCellStyle(headerStyle);

        int colIndex = 1;
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            Cell dateCell = headerRow.createCell(colIndex++);
            dateCell.setCellValue("📅 " + formatter.format(date));
            dateCell.setCellStyle(headerStyle);
        }

        // Data Rows with Enhanced Formatting
        int rowIndex = 3;
        for (int eIndex = 0; eIndex < employees.size(); eIndex++) {
            Employee employee = employees.get(eIndex);
            Row row = sheet.createRow(rowIndex++);
            row.setHeightInPoints(22);

            Cell nameCell = row.createCell(0);
            nameCell.setCellValue("👨‍💼 " + employee.getName());
            nameCell.setCellStyle(eIndex % 2 == 0 ? nameStyle : altRowNameStyle);

            colIndex = 1;
            for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                LocalDateTime startOfDay = date.atStartOfDay();
                LocalDateTime endOfDay = date.atTime(23, 59, 59);

                List<Attendance> attendanceList = attendanceRepository
                        .findByEmployeeAndDateTimeBetweenOrderByDateTimeAsc(employee, startOfDay, endOfDay);

                Cell attendanceCell = row.createCell(colIndex++);
                if (attendanceList.isEmpty()) {
                    attendanceCell.setCellValue("✗");
                    attendanceCell.setCellStyle(eIndex % 2 == 0 ? absentStyle : altRowAbsentStyle);
                } else {
                    attendanceCell.setCellValue("✓");
                    attendanceCell.setCellStyle(eIndex % 2 == 0 ? presentStyle : altRowPresentStyle);
                }
            }
        }

        // Add spacing row before summary
        sheet.createRow(rowIndex++);

        // Enhanced Summary Row
        Row summaryRow = sheet.createRow(rowIndex);
        summaryRow.setHeightInPoints(28);
        Cell summaryCell = summaryRow.createCell(0);
        summaryCell.setCellValue("📈 DAILY ATTENDANCE SUMMARY");
        summaryCell.setCellStyle(summaryLabelStyle);

        colIndex = 1;
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            int presentCount = 0;

            for (Employee emp : employees) {
                LocalDateTime startOfDay = date.atStartOfDay();
                LocalDateTime endOfDay = date.atTime(23, 59, 59);
                List<Attendance> attendanceList = attendanceRepository
                        .findByEmployeeAndDateTimeBetweenOrderByDateTimeAsc(emp, startOfDay, endOfDay);
                if (!attendanceList.isEmpty()) {
                    presentCount++;
                }
            }

            Cell sumCell = summaryRow.createCell(colIndex++);
            double attendancePercentage = (double) presentCount / employees.size() * 100;
            sumCell.setCellValue(String.format("%d/%d (%.1f%%)", presentCount, employees.size(), attendancePercentage));
            sumCell.setCellStyle(summaryStyle);
        }

        // ====== Advanced Formatting ======

        // Auto-size columns with optimal widths
        sheet.autoSizeColumn(0); // Employee name column
        sheet.setColumnWidth(0, Math.max(sheet.getColumnWidth(0), 4000)); // Minimum width

        for (int i = 1; i <= totalDays; i++) {
            sheet.autoSizeColumn(i);
            sheet.setColumnWidth(i, Math.max(sheet.getColumnWidth(i), 2800)); // Consistent date column width
        }

        // Create freeze panes for better navigation
        sheet.createFreezePane(1, 3); // Freeze employee names and headers

        // Set print area and page setup for professional printing
        sheet.setPrintGridlines(false);
        sheet.setDisplayGridlines(true);

        // Add sheet protection (optional - can be enabled if needed)
        // sheet.protectSheet("password");

        // Write to output stream
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        return new ByteArrayInputStream(out.toByteArray());
    }

    /**
     * Helper method to add consistent borders to cell styles
     */
    private void addBorders(XSSFCellStyle style, BorderStyle borderStyle, XSSFColor borderColor) {
        style.setBorderTop(borderStyle);
        style.setBorderBottom(borderStyle);
        style.setBorderLeft(borderStyle);
        style.setBorderRight(borderStyle);
        style.setTopBorderColor(borderColor);
        style.setBottomBorderColor(borderColor);
        style.setLeftBorderColor(borderColor);
        style.setRightBorderColor(borderColor);
    }
}
