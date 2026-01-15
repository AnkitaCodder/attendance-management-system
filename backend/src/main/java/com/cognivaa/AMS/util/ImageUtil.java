package com.cognivaa.AMS.util;

import java.io.File;
import java.io.FileInputStream;
import java.util.Base64;

public class ImageUtil {
    public static String encodeFileToBase64(String filePath) {
        try (FileInputStream fis = new FileInputStream(new File(filePath))) {
            byte[] bytes = fis.readAllBytes();
            return Base64.getEncoder().encodeToString(bytes);
        } catch (Exception e) {
            throw new RuntimeException("Failed to encode image to Base64", e);
        }
    }
}
