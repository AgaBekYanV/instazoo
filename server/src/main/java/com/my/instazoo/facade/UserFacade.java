package com.my.instazoo.facade;

import com.my.instazoo.dto.UserDTO;
import com.my.instazoo.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserFacade {

    public UserDTO userToUserDTO(User user){
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setFirstName(user.getName());
        userDTO.setLastName(user.getLastname());
        userDTO.setUsername(user.getUsername());
        userDTO.setBio(user.getBio());

        return userDTO;
    }
}
