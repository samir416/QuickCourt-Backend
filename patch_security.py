import re

with open('backend/src/main/java/com/quickcourt/quickcourt_backend/config/SecurityConfig.java', 'r') as f:
    text = f.read()

text = text.replace('.requestMatchers("/api/auth/**", "/api/home/**", "/error").permitAll()', '.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()\n                        .requestMatchers("/api/auth/**", "/api/home/**", "/error").permitAll()')

with open('backend/src/main/java/com/quickcourt/quickcourt_backend/config/SecurityConfig.java', 'w') as f:
    f.write(text)
