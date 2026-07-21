package com.sistemkasir.transaksi_jual.config;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;

public class UserDetailsPrincipals implements UserDetails {
    private String email;
    private String password;
    private String kodeCabang;
    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsPrincipals(String email, String kodeCabang, Collection<? extends GrantedAuthority> authorities) {
        this.email = email;
        this.kodeCabang = kodeCabang;
        this.authorities = authorities;
    }

    public String getKodeCabang() {
        return kodeCabang;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() { return password; }
    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}
