package com.cognivaa.AMS.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS with custom config
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/employees/**").permitAll() // Public access
                        .requestMatchers("/api/attendances/**").permitAll() // Public access
                        .requestMatchers("/api/attendance-report/**").permitAll() // Public access
                        .anyRequest().authenticated() // Everything else needs auth
                )
                .csrf(csrf -> csrf.disable()) // Disable CSRF for stateless API
                .httpBasic(httpBasic -> {}); // ✅ Use lambda style (empty config block is fine)

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("https://altshift.pioneerregis.in"); // Allow this origin
//        configuration.addAllowedOrigin("http://localhost:5173"); // Allow this origin
//       configuration.addAllowedOriginPattern("*");

//        configuration.addAllowedOrigin("https://ujjaldeysarkar.github.io"); // Allow this origin
//        configuration.addAllowedOrigin("*"); // Allow this origin
        configuration.addAllowedMethod("*"); // Allow all HTTP methods (GET, POST, etc.)
        configuration.addAllowedHeader("*"); // Allow all headers
        configuration.setAllowCredentials(true); // Allow credentials (cookies, auth headers)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Apply to all endpoints
        return source;
    }
}
