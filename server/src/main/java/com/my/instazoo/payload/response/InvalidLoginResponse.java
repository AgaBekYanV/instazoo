package com.my.instazoo.payload.response;

import lombok.Getter;

@Getter
public class InvalidLoginResponse {

    private String login;
    private String password;

    public InvalidLoginResponse() {
        this.login = "Invalid Login";
        this.password = "Invalid password";
    }
}
