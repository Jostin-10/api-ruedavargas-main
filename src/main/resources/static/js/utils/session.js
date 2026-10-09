/**
 * Manejo de la sesión del usuario (token JWT + datos básicos).
 * Guarda la sesión en localStorage y sessionStorage de forma segura.
 */
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const ROUTES = {
    login: '/login.html',
    register: '/register.html',
    dashboard: '/dashboard.html'
};

function readStorage(key) {
    const val = localStorage.getItem(key) ?? sessionStorage.getItem(key);
    if (!val || val === 'undefined' || val === 'null') return null;
    return val;
}

export function saveSession(token, user, remember = true) {
    if (!token || token === 'undefined' || token === 'null') return;
    clearSession();
    // Guardamos en ambos o en el elegido para evitar desincronización
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, typeof user === 'string' ? user : JSON.stringify(user));
}

export function setSession({ token, user, remember = true }) {
    saveSession(token, user, remember);
}

export function clearSession() {
    [localStorage, sessionStorage].forEach(storage => {
        storage.removeItem(TOKEN_KEY);
        storage.removeItem(USER_KEY);
    });
}

export function getToken() {
    return readStorage(TOKEN_KEY);
}

export function getUser() {
    try {
        const raw = readStorage(USER_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function getSession() {
    return {
        token: getToken(),
        user: getUser()
    };
}

/** 
 * Decodifica de forma segura la parte Base64URL de un JWT agregando padding si es necesario.
 */
function safeBase64UrlDecode(str) {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
        case 0:
            break;
        case 2:
            output += '==';
            break;
        case 3:
            output += '=';
            break;
        default:
            return null;
    }
    return atob(output);
}

/** Lee el campo "exp" del JWT para saber si venció sin llamar al backend. */
export function isTokenExpired(token) {
    if (!token || typeof token !== 'string' || token.length < 15) return true;
    try {
        const parts = token.split('.');
        if (parts.length < 2) return false;
        const decoded = safeBase64UrlDecode(parts[1]);
        if (!decoded) return false;
        const payload = JSON.parse(decoded);
        if (typeof payload.exp === 'number') {
            return payload.exp * 1000 <= Date.now();
        }
        return false;
    } catch (e) {
        // En caso de cualquier duda o fallo de parseo local, no desloguear prematuramente
        return false;
    }
}

export function isAuthenticated() {
    const token = getToken();
    return Boolean(token) && !isTokenExpired(token);
}

export function hasRole(...roles) {
    const user = getUser();
    return Boolean(user) && roles.includes(user.role);
}

/** Guard para páginas privadas: sin sesión válida, vuelve al login. */
export function requireAuth() {
    if (!isAuthenticated()) {
        const expired = Boolean(getToken());
        clearSession();
        window.location.replace(expired ? `${ROUTES.login}?expired=1` : ROUTES.login);
        return false;
    }
    return true;
}

/** Guard para login/registro: si ya hay sesión, va directo al dashboard. */
export function redirectIfAuthenticated() {
    if (isAuthenticated()) {
        window.location.replace(ROUTES.dashboard);
        return true;
    }
    return false;
}

/** Cierra la sesión. Con expired=true el login muestra el aviso de sesión expirada. */
export function logout({ expired = false } = {}) {
    clearSession();
    window.location.replace(expired ? `${ROUTES.login}?expired=1` : ROUTES.login);
}
