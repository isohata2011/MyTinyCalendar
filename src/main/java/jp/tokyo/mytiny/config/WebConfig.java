package jp.tokyo.mytiny.config;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.embedded.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class WebConfig extends WebMvcConfigurerAdapter {

    @Autowired
    DataSourceProperties properties;

    @Bean
    public FilterRegistrationBean getFilterRegistrationBean() {
        FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean();
        filterRegistrationBean.setFilter(new CharacterEncodingFilter());
        return filterRegistrationBean;
    }

    /**
     * リクエストエンコーディングをUTF-8にします。
     */
    private static class CharacterEncodingFilter implements Filter {
        protected String encoding;

        public void init(FilterConfig filterConfig) throws ServletException {
            encoding = "UTF-8";
        }

        public void doFilter(ServletRequest servletRequest,
                ServletResponse servletResponse, FilterChain filterChain)
                throws IOException, ServletException {

            HttpServletRequest request = (HttpServletRequest) servletRequest;
            request.setCharacterEncoding(encoding);
            filterChain.doFilter(servletRequest, servletResponse);
        }

        public void destroy() {
            encoding = null;
        }
    }

    @Bean(destroyMethod = "close")
    DataSource dataSource() throws URISyntaxException {
        String url, username, password;
        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl != null) {
            URI dbUri = new URI(databaseUrl);
            url = "jdbc:postgresql://" + dbUri.getHost() + dbUri.getPath()
                    + ":" + dbUri.getPort() + dbUri.getPath();
            username = dbUri.getUserInfo().split(":")[0];
            password = dbUri.getUserInfo().split(":")[1];
        } else {
            url = this.properties.getUrl();
            username = this.properties.getUsername();
            password = this.properties.getPassword();
        }
        DataSourceBuilder factory = DataSourceBuilder
                .create(this.properties.getClassLoader()).url(url)
                .username(username).password(password);
        return factory.build();
    }
}
