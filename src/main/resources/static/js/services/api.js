/**
 * Cliente HTTP base. Todas las llamadas al backend pasan por aquí.
 * El backend responde con el formato { status, message, data }.
 */
import { getToken, clearSession } from '../utils/session.js';

/** Se emite en window cuando el backend rechaza el token (401 en una ruta privada). */
export const SESSION_EXPIRED_EVENT = 'session:expired';

export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

/**
 * @param {string} path   Ruta del endpoint, p. ej. '/api/auth/login'
 * @param {object} opts   method, body (objeto JS) y auth (enviar token, por defecto true)
 * @returns {Promise<any>} El campo "data" de la respuesta, o el JSON completo si no lo trae
 */
export async function request(path, { method = 'GET', body, auth = true } = {}) {
    const headers = { 'Accept': 'application/json' };
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    if (auth) {
        const token = getToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    let response;
    try {
        response = await fetch(path, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined
        });
    } catch {
        throw new ApiError('No se pudo conectar con el servidor. Verifica que la API esté en ejecución.', 0);
    }

    const json = await response.json().catch(() => ({}));

    if (!response.ok || json.status === 'error') {
        // En login un 401 significa credenciales inválidas; solo en rutas privadas es sesión vencida
        if (response.status === 401 && auth) {
            clearSession();
            window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
        }
        throw new ApiError(json.message || `Error inesperado (HTTP ${response.status})`, response.status);
    }

    return json.data !== undefined ? json.data : json;
}
