package com.my.instazoo.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.my.instazoo.entity.enums.ERole;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.GrantedAuthority;

import java.time.LocalDateTime;
import java.util.*;

@Data
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@Table (name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false)
    String name;

    @Column(unique = true, updatable = true)
    String username;

    @Column(nullable = false)
    String lastname;

    @Column(unique = true)
    String email;

    @Column(columnDefinition = "text")
    String bio;

    @Column(length = 3000)
    String password;

    @ElementCollection(targetClass = ERole.class)
    @CollectionTable(name="user_role",
        joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "role_name")
    Set<ERole> roles =  new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY,mappedBy = "user", orphanRemoval = true)
    List<Post> posts = new ArrayList<>();

    @JsonFormat(pattern = "yyyy-mm-dd HH:mm:ss")
    @Column(updatable = false)
    LocalDateTime createdDate;

    @Transient
    Collection<? extends GrantedAuthority> authorities;

    @PrePersist
    protected void onCreate(){
        this.createdDate = LocalDateTime.now();
    }
}
