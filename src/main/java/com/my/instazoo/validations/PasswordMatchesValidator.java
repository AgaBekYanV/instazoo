package com.my.instazoo.validations;

import com.my.instazoo.annotation.PasswordMatches;
import com.my.instazoo.payload.request.SignupRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.lang.annotation.Annotation;

public class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, Object> {

    @Override
    public void initialize(PasswordMatches constraintAnnotation) {

    }

    @Override
    public boolean isValid(Object obj, ConstraintValidatorContext constraintValidatorContext) {
        SignupRequest signupRequest = (SignupRequest) obj;
        return signupRequest.getPassword().equals(signupRequest.getConfirmPassword());
    }

}
