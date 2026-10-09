/**
 * Servicio de autenticación: una función por endpoint de /api/auth.
 */
import { request } from './api.js';
import { saveSession } from '../utils/session.js';

/** Inicia sesión y guarda token + usuario. Devuelve { token, user }. */
export async function login(email, password, remember = true) {
    const { token, user } = await request('/api/auth/login', {
        method: 'POST',
        body: { email: email.trim(), password },
        auth: false
    });
    saveSession(token, user, remember);
    return { token, user };
}

/** Registra un colaborador interno. role: ADMIN | CAJERO | GESTOR_CLIENTES. */
export function register({ name, email, phone, password, role = 'ADMIN', employeeId }) {
    const body = { name: name.trim(), email: email.trim(), password, role };
    if (phone) body.phone = phone.trim();
    if (employeeId) body.employeeId = employeeId.trim();
    return request('/api/auth/register', { method: 'POST', body, auth: false });
}

export function getProfile() {
    return request('/api/auth/profile');
}

/** Requiere rol CAJERO o ADMIN. */
export function getCashierArea() {
    return request('/api/auth/cashier-area');
}

/** Requiere rol ADMIN. */
export function getAdminArea() {
    return request('/api/auth/admin-only');
}

export const authService = {
    login,
    register,
    getProfile,
    getCashierArea,
    getAdminArea
};

export default authService;
