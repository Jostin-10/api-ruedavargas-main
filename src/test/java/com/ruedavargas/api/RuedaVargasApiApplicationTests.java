package com.ruedavargas.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ruedavargas.api.dto.LoginRequest;
import com.ruedavargas.api.dto.RegisterRequest;
import com.ruedavargas.api.entity.Role;
import com.ruedavargas.api.security.JwtService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class RuedaVargasApiApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtService jwtService;

    @Test
    @DisplayName("Contexto de Spring carga correctamente")
    void contextLoads() {
    }

    @Test
    @DisplayName("GET /health responde 200 OK y estado correcto")
    void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("OK")))
                .andExpect(jsonPath("$.message", is("API funcionando correctamente")));
    }

    @Test
    @DisplayName("Un archivo estático inexistente responde 404 y no 500")
    void testMissingStaticResourceReturnsNotFound() throws Exception {
        mockMvc.perform(get("/favicon.ico"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is("error")))
                .andExpect(jsonPath("$.message", is("Recurso no encontrado")));

        mockMvc.perform(get("/js/no-existe.js"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Las páginas y módulos del frontend se sirven sin autenticación")
    void testFrontendAssetsArePublic() throws Exception {
        for (String path : new String[]{"/login.html", "/register.html", "/dashboard.html",
                "/favicon.svg", "/css/styles.css", "/js/config/tailwind.config.js", "/js/pages/dashboard.page.js"}) {
            mockMvc.perform(get(path)).andExpect(status().isOk());
        }
    }

    @Test
    @DisplayName("POST /api/auth/register registra cliente exitosamente")
    void testRegisterClientSuccess() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email("cliente@correo.com")
                .password("Password123")
                .name("Juan Perez")
                .role(Role.CLIENTE)
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status", is("success")))
                .andExpect(jsonPath("$.message", is("Usuario registrado exitosamente")))
                .andExpect(jsonPath("$.data.email", is("cliente@correo.com")))
                .andExpect(jsonPath("$.data.name", is("Juan Perez")))
                .andExpect(jsonPath("$.data.role", is("CLIENTE")))
                .andExpect(jsonPath("$.data.loyaltyPoints", is(0)));
    }

    @Test
    @DisplayName("POST /api/auth/register rechaza ADMIN sin employeeId")
    void testRegisterAdminWithoutEmployeeIdFails() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email("admin@correo.com")
                .password("Password123")
                .name("Admin User")
                .role(Role.ADMIN)
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is("error")))
                .andExpect(jsonPath("$.message", is("El employeeId es requerido para el personal autorizado")));
    }

    @Test
    @DisplayName("POST /api/auth/register registra ADMIN con employeeId exitosamente")
    void testRegisterAdminWithEmployeeIdSuccess() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .email("admin@correo.com")
                .password("Password123")
                .name("Admin User")
                .role(Role.ADMIN)
                .employeeId("EMP-001")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status", is("success")))
                .andExpect(jsonPath("$.data.employeeId", is("EMP-001")));
    }

    @Test
    @DisplayName("POST /api/auth/login genera token JWT y permite acceso a endpoints protegidos")
    void testLoginAndProtectedEndpoints() throws Exception {
        // 1. Registrar un Admin
        RegisterRequest adminReq = RegisterRequest.builder()
                .email("boss@correo.com")
                .password("AdminPass123")
                .name("Jefe Admin")
                .role(Role.ADMIN)
                .employeeId("EMP-999")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(adminReq)))
                .andExpect(status().isCreated());

        // 2. Iniciar sesión con Admin
        LoginRequest loginReq = LoginRequest.builder()
                .email("boss@correo.com")
                .password("AdminPass123")
                .build();

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("success")))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andReturn();

        JsonNode responseJson = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        String token = responseJson.get("data").get("token").asText();

        // 3. Probar /api/auth/profile con el token
        mockMvc.perform(get("/api/auth/profile")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("success")))
                .andExpect(jsonPath("$.message", is("Perfil de usuario")))
                .andExpect(jsonPath("$.data.role", is("ADMIN")))
                .andExpect(jsonPath("$.data.email", is("boss@correo.com")))
                .andExpect(jsonPath("$.data.name", is("Jefe Admin")))
                .andExpect(jsonPath("$.data.employeeId", is("EMP-999")));

        // 4. Probar /api/auth/admin-only con el token
        mockMvc.perform(get("/api/auth/admin-only")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Bienvenido, Administrador")));

        // 5. Probar /api/auth/cashier-area con el token
        mockMvc.perform(get("/api/auth/cashier-area")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message", is("Área técnica y despacho de insumos")));

        // 6. Probar /api/auth/profile sin token -> 401 Unauthorized
        mockMvc.perform(get("/api/auth/profile"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/auth/profile devuelve el perfil completo del cliente")
    void testProfileReturnsFullClientData() throws Exception {
        RegisterRequest clientReq = RegisterRequest.builder()
                .email("perfil@correo.com")
                .password("Password123")
                .name("Cliente Perfil")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(clientReq)))
                .andExpect(status().isCreated());

        LoginRequest loginReq = LoginRequest.builder()
                .email("perfil@correo.com")
                .password("Password123")
                .build();

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn();

        String token = objectMapper.readTree(loginResult.getResponse().getContentAsString())
                .get("data").get("token").asText();

        mockMvc.perform(get("/api/auth/profile")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id", notNullValue()))
                .andExpect(jsonPath("$.data.name", is("Cliente Perfil")))
                .andExpect(jsonPath("$.data.email", is("perfil@correo.com")))
                .andExpect(jsonPath("$.data.role", is("CLIENTE")))
                .andExpect(jsonPath("$.data.loyaltyPoints", is(0)))
                .andExpect(jsonPath("$.data.createdAt", notNullValue()))
                .andExpect(jsonPath("$.data.passwordHash").doesNotExist());
    }

    @Test
    @DisplayName("GET /api/auth/profile con token válido de un usuario inexistente responde 401")
    void testProfileWithTokenOfMissingUserIsUnauthorized() throws Exception {
        String token = jwtService.generateToken(UUID.randomUUID().toString(), "CLIENTE");

        mockMvc.perform(get("/api/auth/profile")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is("error")))
                .andExpect(jsonPath("$.message", is("La sesión ya no es válida. Inicia sesión nuevamente")));
    }

    @Test
    @DisplayName("Cliente autenticado no puede acceder a /api/auth/admin-only (403 Forbidden)")
    void testClientForbiddenOnAdminOnly() throws Exception {
        // 1. Registrar cliente
        RegisterRequest clientReq = RegisterRequest.builder()
                .email("cliente2@correo.com")
                .password("Password123")
                .name("Cliente Regular")
                .role(Role.CLIENTE)
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(clientReq)))
                .andExpect(status().isCreated());

        // 2. Login
        LoginRequest loginReq = LoginRequest.builder()
                .email("cliente2@correo.com")
                .password("Password123")
                .build();

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode responseJson = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        String token = responseJson.get("data").get("token").asText();

        // 3. Acceder a admin-only -> 403 Forbidden
        mockMvc.perform(get("/api/auth/admin-only")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status", is("error")));
    }
}
