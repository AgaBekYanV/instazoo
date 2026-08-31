package com.my.instazoo.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostDTO {

    Long id;
    String title;
    String caption;
    String location;
    String username;
    Integer likes;
    Set<String> usersLiked;
}
