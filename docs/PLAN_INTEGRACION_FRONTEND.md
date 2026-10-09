# Plan de integración del frontend (Google Stitch → Rueda Vargas ERP)

Integrar las pantallas diseñadas en Google Stitch (proyecto **Rueda Vargas S.A. — Insumos Acuícolas**, diseño Stitch) al frontend servido por Spring Boot, con desarrollo basado en componentes y conectado al backend JWT existente.

---

## 📊 Estado del proyecto

> Este tablero se actualiza al terminar cada avance. Leyenda: ⬜ Pendiente · 🟡 En progreso · ✅ Completado

| Fase | Descripción | Estado | Avance |
| :--- | :--- | :---: | :---: |
| 0 | Preparación y estructura de carpetas | ✅ | 100 % |
| 1 | Capa base: servicios, sesión y validaciones | ✅ | 100 % |
| 2 | Componentes comunes (UI reutilizable) | ✅ | 100 % |
| 3 | Página de Login | ✅ | 100 % |
| 4 | Página de Registro | ✅ | 100 % |
| 5 | Ajuste de backend: perfil completo | ✅ | 100 % |
| 6 | Dashboard multi-rol | ✅ | 100 % |
| 7 | Pruebas integrales, limpieza y documentación | ✅ | 100 % |

**Avance global:** 8 / 8 fases · ✅ **Integración completada**

**Verificación final:** 11/11 pruebas JUnit del backend · 55/55 pruebas de componentes y páginas (DOM simulado contra el backend real) · 8/8 recorridos de punta a punta en Microsoft Edge (escritorio y móvil), sin errores de consola.

---

## 🧭 Punto de partida

**Backend (ya existe):**

| Endpoint | Acceso | Uso en el frontend |
| :--- | :--- | :--- |
| `POST /api/auth/register` | Público | Formulario de registro |
| `POST /api/auth/login` | Público | Login → devuelve `token` + `user {id, email, name, role}` |
| `GET /api/auth/profile` | Autenticado | Datos del dashboard (hoy solo `userId` y `role`, ver Fase 5) |
| `GET /api/auth/cashier-area` | ADMIN, CAJERO | Panel de caja |
| `GET /api/auth/admin-only` | ADMIN | Panel de administración |

**Frontend actual:** 4 páginas en `src/main/resources/static/` con HTML, CSS y JS mezclados en cada archivo. `SecurityConfig` ya permite `/css/**` y `/js/**`, por lo que la nueva estructura no requiere cambios de seguridad.

**Diseños de Stitch:** Login, Registro y Dashboard Multi-Rol (tema oscuro, Tailwind CDN, fuentes Plus Jakarta Sans + Inter, iconos Material Symbols).

---

## 📁 Distribución de carpetas

Se respeta la ubicación actual del frontend (`static/`), separando responsabilidades:

```text
src/main/resources/static/
├── index.html                  # Redirección según sesión
├── login.html                  # Páginas: solo estructura base + punto de montaje
├── register.html
├── dashboard.html
├── css/
│   └── styles.css              # Estilos propios que Tailwind no cubre
└── js/
    ├── config/
    │   └── tailwind.config.js  # Tokens MarketFresh (colores, tipografía, espaciado) compartidos
    ├── services/
    │   ├── api.js              # Cliente HTTP: base fetch, Bearer token, manejo 401/403
    │   └── auth.service.js     # login, register, getProfile, getCashierArea, getAdminArea
    ├── utils/
    │   ├── session.js          # Token/usuario en storage, guards (requireAuth, redirectIfAuth)
    │   ├── validators.js       # Reglas iguales a las del backend (email, contraseña, nombre)
    │   ├── dom.js              # Utilidades para crear componentes desde plantillas
    │   └── format.js           # Formato de puntos y fechas
    ├── components/
    │   ├── common/             # Brand, Alert, Avatar, Button, FormField, PasswordInput, Spinner, TrustBadges, Footer
    │   ├── auth/               # AuthLayout, LoginForm, RegisterForm, RoleSelector, PasswordRequirements
    │   └── dashboard/          # Navbar, RoleBadge, WelcomeBanner, ProfileCard, LoyaltyCard, FeatureTile,
    │                           # CashierPanel, AdminPanel, LoadingState, SessionExpired
    └── pages/
        ├── login.page.js       # Arma la página con componentes y los conecta al servicio
        ├── register.page.js
        └── dashboard.page.js

docs/
├── PLAN_INTEGRACION_FRONTEND.md  # Este documento (plan + estado)
└── stitch/                       # HTML original exportado de Stitch (solo referencia)
```

### Convención de componentes

JavaScript nativo con **ES Modules**, sin frameworks ni paso de compilación (el proyecto sigue construyéndose solo con Maven).

```js
// js/components/common/Alert.js
export function Alert({ type = 'error', title, message, onClose }) {
  const el = document.createElement('div');
  el.className = '...';               // clases Tailwind tomadas de Stitch
  el.innerHTML = `...`;               // estructura visual del diseño
  el.querySelector('[data-close]')?.addEventListener('click', onClose);
  return el;                          // cada componente devuelve un elemento DOM
}
```

- Un componente = un archivo, nombre en PascalCase.
- Recibe datos por parámetros (`props`) y comunica eventos mediante callbacks (`onSubmit`, `onClose`).
- Los componentes **no** llaman a la API; eso lo hacen las páginas (`pages/`) a través de `services/`.
- Los textos dinámicos se insertan con `textContent` para evitar inyección de HTML.

---

## 🛠 Fases de desarrollo

### Fase 0 — Preparación y estructura
- Crear carpetas `css/` y `js/` con la estructura definida.
- Guardar el HTML original de Stitch en `docs/stitch/` como referencia.
- Extraer la configuración de Tailwind de Stitch a `js/config/tailwind.config.js` para que las 3 páginas compartan colores y tipografía.

**Criterio de aceptación:** la estructura existe y una página de prueba carga Tailwind con los tokens MarketFresh.

### Fase 1 — Capa base
- `api.js`: función `request()` que agrega `Authorization: Bearer`, parsea la respuesta `{status, message, data}` y, ante un **401**, limpia la sesión y avisa de sesión expirada.
- `auth.service.js`: una función por endpoint.
- `session.js`: guardar/leer token y usuario; **“Recordarme”** usa `localStorage`, y sin marcar usa `sessionStorage`.
- `validators.js`: mismas reglas que `RegisterRequest` (mín. 8 caracteres, una mayúscula, un número; nombre mín. 2).

**Criterio de aceptación:** desde la consola del navegador se puede hacer login y obtener el perfil usando los servicios.

### Fase 2 — Componentes comunes
- `Brand`, `Alert` (error/éxito), `Button` (con estado de carga), `FormField` (campo con icono y error), `PasswordInput` (mostrar/ocultar), `Spinner`, `TrustBadges`, `Footer`.

**Criterio de aceptación:** los componentes se ven igual que en Stitch y funcionan de forma aislada.

### Fase 3 — Login
- `LoginForm` con el diseño de Stitch, conectado a `POST /api/auth/login`.
- Mensaje de error del backend en el `Alert` (“Credenciales inválidas”).
- Si ya hay sesión, redirigir al dashboard.

**Criterio de aceptación:** login correcto lleva al dashboard; credenciales incorrectas muestran el error sin recargar.

### Fase 4 — Registro
- `RoleSelector` (Cliente / Cajero / Administrador) que muestra u oculta el campo **ID de empleado**.
- `PasswordRequirements` con validación en vivo y confirmación de contraseña.
- Conectado a `POST /api/auth/register`; muestra los errores de validación del backend.

**Criterio de aceptación:** se registran los 3 roles; un cajero sin ID de empleado muestra el error correspondiente.

### Fase 5 — Ajuste de backend: perfil completo
El dashboard de Stitch muestra nombre, email, puntos de fidelidad, ID de empleado y fecha de alta, pero `GET /api/auth/profile` solo devuelve `userId` y `role`.
- Modificar el endpoint para que consulte al usuario en la base de datos y devuelva `UserResponseDto` dentro del formato estándar `ApiResponse`.
- Actualizar la sección correspondiente del `README.md`.

**Criterio de aceptación:** `GET /api/auth/profile` devuelve `name`, `email`, `role`, `loyaltyPoints`, `employeeId` y `createdAt`.

### Fase 6 — Dashboard multi-rol
- `Navbar` (nombre, insignia de rol, cerrar sesión), `WelcomeBanner` y `ProfileCard` para todos los roles.
- **CLIENTE:** `LoyaltyCard` con los puntos reales.
- **CAJERO:** `CashierPanel` con el mensaje de `/api/auth/cashier-area` e ID de empleado.
- **ADMIN:** `AdminPanel` con el mensaje de `/api/auth/admin-only`, además del panel de caja.
- Estados de **carga** y **sesión expirada** (`SessionExpired`) con botón para volver al login.

**Criterio de aceptación:** cada rol ve solo sus secciones con datos reales; un token vencido muestra la pantalla de sesión expirada.

### Fase 7 — Pruebas integrales y cierre
- Recorrido completo por rol: registro → login → dashboard → cerrar sesión.
- Revisión responsive (móvil y escritorio).
- Eliminar el código antiguo en línea de las páginas.
- Actualizar `README.md` con la sección del frontend.

**Criterio de aceptación:** los 3 flujos funcionan de punta a punta sin errores en la consola.

---

## ⚖️ Decisiones sobre el diseño de Stitch

Stitch generó elementos sin soporte en el backend actual. Se tratan así:

| Elemento del diseño | Decisión |
| :--- | :--- |
| “¿Olvidaste tu contraseña?” | Se oculta (no existe endpoint) |
| “Recordarme en este dispositivo” | Se implementa (`localStorage` vs `sessionStorage`) |
| Selector “Simular rol” del dashboard | Se elimina; el rol viene del token |
| Pedidos, cupones, teléfono, dirección, sucursal | Se omiten hasta que existan los módulos en el backend |
| Métricas de caja, tickets, accesos rápidos POS | Tarjetas con la etiqueta **“Próximamente”** |
| Progreso hacia una meta de puntos | Se muestran solo los puntos reales (`loyaltyPoints`) |

---

## 📝 Bitácora de avances

| Fecha | Fase | Avance |
| :--- | :---: | :--- |
| 2026-10-05 | — | Plan de trabajo creado. Stitch conectado vía MCP (`.mcp.json`). |
| 2026-10-05 | 0 | Estructura `static/css` y `static/js/{config,services,utils,components/{common,auth,dashboard},pages}` creada. HTML original de Stitch guardado en `docs/stitch/`. Tokens MarketFresh centralizados en `js/config/tailwind.config.js` (verificados contra el original de Stitch, sin diferencias). Fuentes e iconos en `css/styles.css` (Stitch no cargaba Plus Jakarta Sans ni Inter). Página de prueba `styleguide.html`. Verificado: Spring sirve `/css/**`, `/js/**` y `/styleguide.html` sin token (HTTP 200). |
| 2026-10-05 | 1 | Capa base creada: `services/api.js` (cliente HTTP con Bearer token y `ApiError`), `services/auth.service.js` (login, register, getProfile, getCashierArea, getAdminArea), `utils/session.js` (sesión, “Recordarme”, detección de token vencido y guards) y `utils/validators.js` (mismas reglas que el backend). Un 401 solo se trata como sesión expirada en rutas privadas, ya que el login también responde 401 con credenciales inválidas. Verificado con 15 pruebas contra el backend real: registro de los 3 roles, errores de validación, login correcto e incorrecto, permisos 403 por rol y token inválido. |
| 2026-10-05 | 2 | Componentes comunes en `js/components/common/`: `Brand`, `Alert`, `Button` (con `setLoading`), `FormField` (con `setError` y errores accesibles), `PasswordInput` (compone `FormField`), `Spinner`, `TrustBadges` y `Footer`, más `utils/dom.js`. Marcado y clases tomados del login de Stitch; el logo usa el icono del diseño de registro en lugar de la imagen remota de Stitch. Los textos se insertan con `textContent`. Galería en `styleguide.html` para probarlos por separado. Verificado con 13 pruebas de comportamiento en DOM simulado (jsdom) y carga de todos los módulos desde Spring (HTTP 200). |
| 2026-10-05 | 3 | Login con el diseño de Stitch: `components/auth/AuthLayout.js` (tarjeta, encabezado, enlace inferior, insignias y pie; se reutilizará en el registro), `components/auth/LoginForm.js` y `pages/login.page.js`. `login.html` queda solo como punto de montaje. Validación antes de enviar, alerta “Acceso no autorizado” ante un 401, “Recordarme” activo por defecto, redirección si ya hay sesión y avisos por URL (`?expired=1`, `?registered=1`). “¿Olvidaste tu contraseña?” omitido según las decisiones. `index.html` ahora valida que el token no esté vencido. **Transición:** el `dashboard.html` antiguo lee la sesión de `sessionStorage` o `localStorage` hasta que se reemplace en la Fase 6. Verificado con 9 pruebas contra el backend real (más las 28 de las fases 1 y 2, sin regresiones). |
| 2026-10-05 | 4 | Registro con el diseño de Stitch: `RoleSelector` (radio accesible con clic y flechas; Cliente por defecto), `PasswordRequirements` (requisitos en vivo), `RegisterForm` (ID de empleado solo para Cajero/Administrador y aviso de contraseña coincidente) y `pages/register.page.js`. Los errores del backend se muestran en su campo (email o ID de empleado duplicado); al registrarse redirige a `login.html?registered=1`. `AuthLayout` acepta `brandSubtitle` (“Portal de Acceso”). **Corrección de la Fase 3:** `AuthLayout` y `Brand` compartían el marcador `data-subtitle`, por lo que el subtítulo del login quedaba oculto dentro del logo; se renombraron los marcadores de `AuthLayout` y las pruebas ahora verifican la ubicación exacta del texto. Verificado con 9 pruebas contra el backend real (37 anteriores sin regresiones). |
| 2026-10-05 | 5 | `GET /api/auth/profile` ahora consulta la base de datos (`AuthService.getProfile`) y devuelve `UserResponseDto` en el formato estándar `ApiResponse` (`id`, `name`, `email`, `role`, `loyaltyPoints`, `employeeId`, `createdAt`, `updatedAt`). Si el token es válido pero el usuario ya no existe (la base H2 en memoria se reinicia), responde 401 para que el frontend vuelva al login. README actualizado. Pruebas JUnit: se actualizó la prueba existente del perfil y se agregaron 2 (perfil completo sin exponer `passwordHash`; usuario inexistente → 401). Resultado: 9/9 JUnit y 46/46 pruebas del frontend. |
| 2026-10-05 | 6 | Dashboard multi-rol con el diseño de Stitch y datos reales: `Navbar`, `RoleBadge`, `WelcomeBanner`, `ProfileCard`, `LoyaltyCard` (Cliente), `CashierPanel` (Cajero y Admin, mensaje de `/cashier-area`), `AdminPanel` (Admin, mensaje de `/admin-only` y botón al área de caja), `FeatureTile` (accesos y módulos “Próximamente”), `LoadingState` y `SessionExpired` (ventana con cuenta regresiva), más `common/Avatar.js` (iniciales en lugar de las fotos remotas de Stitch) y `utils/format.js`. `pages/dashboard.page.js` carga en paralelo los datos de cada rol, muestra error con “Reintentar” si falla la conexión y la ventana de sesión expirada si el backend rechaza el token. `requireAuth` y `logout` ahora llevan a `login.html?expired=1` cuando la sesión venció. Se eliminó el dashboard antiguo (y con él el ajuste de transición de la Fase 3). Verificado con 9 pruebas contra el backend real (46 anteriores sin regresiones). |
| 2026-10-05 | 7 | Pruebas de punta a punta en Microsoft Edge real (headless): registro → login → dashboard → cerrar sesión para los 3 roles, credenciales inválidas, errores de validación, sesión expirada, redirecciones de `/` y `/dashboard`, y ausencia de desborde horizontal a 390 px. Problemas encontrados y corregidos: **(1)** un archivo estático inexistente (p. ej. `/favicon.ico`, que el navegador pide en cada página) respondía **500**; ahora `GlobalExceptionHandler` maneja `NoResourceFoundException` con **404**, y se agregó `favicon.svg` (permitido en `SecurityConfig`). **(2)** El login se desbordaba 16 px en móvil por los círculos decorativos de Stitch; `AuthLayout` recorta el desborde horizontal. Se agregaron 2 pruebas JUnit (404 de recursos inexistentes y acceso público a las páginas). README reescrito: su formato estaba dañado desde antes (bloques de código sin delimitar, comillas eliminadas, caracteres de control en `name` y `role`); ahora incluye la sección del frontend y la estructura real de paquetes. Resultado final: 11/11 JUnit, 55/55 pruebas de frontend y 8/8 recorridos en Edge sin errores de consola. |
| 2026-10-08 | — | README reescrito como informe del proyecto, con 18 capturas en `docs/screenshots/`: login (normal y con error), registro (normal y de empleado), dashboard de los 3 roles, vista móvil, guía de estilos y respuestas reales de la API (health, registro, login, perfil, áreas por rol y errores 400/401/403). Las capturas se tomaron con Edge headless contra la app en local. Pendiente detectado: `POST /api/auth/register` devuelve `createdAt` y `updatedAt` en `null` (en `/profile` sí aparecen). |
