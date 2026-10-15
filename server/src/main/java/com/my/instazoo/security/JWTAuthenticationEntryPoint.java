package com.my.instazoo.security;

import com.google.gson.Gson;
import com.my.instazoo.payload.response.InvalidLoginResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JWTAuthenticationEntryPoint implements AuthenticationEntryPoint {
// поправить отслеживание ошибок

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
     /*   InvalidLoginResponse loginResponse = new InvalidLoginResponse();
        String jsonLoginResponse = new Gson().toJson(loginResponse);
        response.setContentType(SecurityConstants.CONTENT_TYPE);
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.getWriter().println(jsonLoginResponse);*/

        response.setContentType("application/json");
        response.setStatus(HttpStatus.UNAUTHORIZED.value());

        String errorMessage = authException.getMessage() != null ? authException.getMessage() : "Unauthorized";
        String jsonResponse = String.format("{\"error\": \"%s\"}", errorMessage);
        response.getWriter().write(jsonResponse);
    }
}
