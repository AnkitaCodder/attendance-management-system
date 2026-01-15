package com.cognivaa.AMS.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.qrcode.QRCodeWriter;

import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Path;

public class QRCodeGenerator {

    public static BufferedImage generateQRCodeImage(String text, int width, int height) throws WriterException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        var bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
        return MatrixToImageWriter.toBufferedImage(bitMatrix);
    }

    public static String saveQRCodeImageToFile(String text, String employeeCode) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            var bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, 200, 200);

            String folderPath = "uploads/qrcodes"; // Relative path (create if not exists)
            File dir = new File(folderPath);
            if (!dir.exists()) dir.mkdirs();

            String filePath = folderPath + "/" + employeeCode + ".png";
            Path path = new File(filePath).toPath();

            MatrixToImageWriter.writeToPath(bitMatrix, "PNG", path);
            return filePath;
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate QR code image", e);
        }
    }
}
