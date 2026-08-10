package com.my.instazoo.payload.request;

import com.my.instazoo.annotation.PasswordMatches;
import com.my.instazoo.annotation.ValidEmail;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@PasswordMatches
public class SignupRequest {

    @Email(message = "It should have email format")
    @NotBlank(message = "User email is required")
    @ValidEmail
    String email;

    @NotEmpty(message = "Please enter your name")
    String firstname;

    @NotEmpty(message = "Please enter your lastname")
    String lastname;

    @NotEmpty(message = "Please enter your username")
    String username;


    String password;
    String confirmPassword;
}
