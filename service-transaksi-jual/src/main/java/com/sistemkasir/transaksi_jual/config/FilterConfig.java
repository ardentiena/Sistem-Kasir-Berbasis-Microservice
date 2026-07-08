package com.sistemkasir.transaksi_jual.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {
    @Value("${internal.api.key}")
    private String internalApiKey;

    @Bean
    public FilterRegistrationBean<InternalKeyFilter> internalKeyFilter() {
        FilterRegistrationBean<InternalKeyFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new InternalKeyFilter(internalApiKey));
        registrationBean.addUrlPatterns("/api/transactions/*");
        return registrationBean;
    }
}
