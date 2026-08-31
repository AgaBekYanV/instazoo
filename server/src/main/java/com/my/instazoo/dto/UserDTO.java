package com.my.instazoo.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserDTO {

    Long id;

    @NotEmpty
    String firstName;

    @NotEmpty
    String lastName;


    String username;

    String bio;
}
