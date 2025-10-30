package com.azship.fretes.service;

import com.azship.fretes.repository.UserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        com.azship.fretes.model.User user = userRepository.findByUserName(userName)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Usuário não encontrado: " + userName)
                );

        System.out.println("Hash da senha no banco: " + user.getPassword());
        return new User(user.getUserName(), user.getPassword(), new ArrayList<>());
    }
}