package com.quickcourt.quickcourt_backend.config;

import com.quickcourt.quickcourt_backend.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**", "/api/home/**", "/error").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/venues/**", "/api/courts/**", "/api/matches/**", "/api/reviews/**", "/api/time-slots/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/owner/**").hasRole("FACILITY_OWNER")
                        .requestMatchers(HttpMethod.POST, "/api/venues/**", "/api/courts/**", "/api/time-slots/**").hasRole("FACILITY_OWNER")
                        .requestMatchers(HttpMethod.PUT, "/api/venues/**", "/api/courts/**", "/api/time-slots/**").hasRole("FACILITY_OWNER")
                        .requestMatchers(HttpMethod.DELETE, "/api/venues/**", "/api/courts/**", "/api/time-slots/**").hasRole("FACILITY_OWNER")
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
