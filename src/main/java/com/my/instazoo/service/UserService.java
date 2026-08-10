package com.my.instazoo.service;

import com.my.instazoo.entity.User;
import com.my.instazoo.entity.enums.ERole;
import com.my.instazoo.exception.UserExistException;
import com.my.instazoo.payload.request.SignupRequest;
import com.my.instazoo.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(SignupRequest userIn){
        User user = new User();
        user.setEmail(userIn.getEmail());
        user.setName(userIn.getFirstname());
        user.setLastname(userIn.getLastname());
        user.setUsername(userIn.getUsername());
        user.setPassword(passwordEncoder.encode(userIn.getPassword()));
        user.getRoles().add(ERole.ROLE_USER);

        try{
            log.info("Saving user {}", userIn.getEmail());
            return userRepository.save(user);
        } catch(Exception e){
            log.error("Error saving user {} + Error: {}", userIn.getEmail(), e.getMessage());
            throw new UserExistException("The user " + user.getUsername() + " already exist.");
        }
    }
}
