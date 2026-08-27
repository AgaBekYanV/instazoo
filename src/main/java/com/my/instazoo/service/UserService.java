package com.my.instazoo.service;

import com.my.instazoo.dto.UserDTO;
import com.my.instazoo.entity.User;
import com.my.instazoo.entity.enums.ERole;
import com.my.instazoo.exception.UserExistException;
import com.my.instazoo.payload.request.SignupRequest;
import com.my.instazoo.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;

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

    public User updateUser(UserDTO userDTO, Principal principal){
        log.info("Обновляю User-а");
        User user = getUserByPrincipal(principal);
        user.setName(userDTO.getFirstName());
        user.setLastname(userDTO.getLastName());
        user.setBio(userDTO.getBio());

        return userRepository.save(user);
    }

    public User getCurrentUser(Principal principal){
        return getUserByPrincipal(principal);
    }

    private User getUserByPrincipal(Principal principal){
        String username = principal.getName();
        return userRepository.findUserByUsername(username)
                .orElseThrow(()-> new UsernameNotFoundException("Username not found with username: " + username));
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(()-> new UsernameNotFoundException("User not found with id: " + id));
    }
}
