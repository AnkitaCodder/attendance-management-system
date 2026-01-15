package com.cognivaa.AMS.dto.response;

import java.util.UUID;

public record EmployeeResponse(
        UUID id,
        String employeeCode,
        String name,
        String email,
        String phone,
        String qrCodePath,
        String qrCodeBase64
) {}