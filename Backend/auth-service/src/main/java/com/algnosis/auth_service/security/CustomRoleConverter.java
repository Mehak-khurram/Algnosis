package com.algnosis.auth_service.security;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Collection;
import java.util.List;

public class CustomRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>>
{
    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        String role = jwt.getClaim("role");
        if (role == null) return List.of();
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));
    }
}