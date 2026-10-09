/**
 * Validaciones del lado del cliente. Replican las reglas de RegisterRequest,
 * LoginRequest y AuthServiceImpl para avisar antes de llamar al backend.
 * Cada función devuelve un mensaje de error, o null si el valor es válido.
 */
export const EMPLOYEE_ROLES = ['ADMIN', 'CAJERO', 'GESTOR_CLIENTES', 'ASESOR_TECNICO', 'CLIENTE'];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Requisitos de contraseña; se usan también para el indicador en vivo del registro. */
export const PASSWORD_RULES = [
    { id: 'length', label: 'Mínimo 8 caracteres', test: value => value.length >= 8 },
    { id: 'uppercase', label: 'Al menos una letra mayúscula', test: value => /[A-Z]/.test(value) },
    { id: 'number', label: 'Al menos un número', test: value => /[0-9]/.test(value) }
];

export function validateEmail(email) {
    const value = (email ?? '').trim();
    if (!value) return 'El email es obligatorio';
    if (!EMAIL_PATTERN.test(value)) return 'Formato de email inválido';
    return null;
}

/** Solo comprueba que exista; las reglas completas aplican al registrarse. */
export function validateLoginPassword(password) {
    return password ? null : 'La contraseña es obligatoria';
}

export function checkPasswordRules(password) {
    return PASSWORD_RULES.map(rule => ({ ...rule, passed: rule.test(password ?? '') }));
}

export function validatePassword(password) {
    if (!password) return 'La contraseña es obligatoria';
    const failed = checkPasswordRules(password).find(rule => !rule.passed);
    return failed ? `La contraseña debe cumplir: ${failed.label.toLowerCase()}` : null;
}

export function validatePasswordConfirmation(password, confirmation) {
    if (!confirmation) return 'Confirma tu contraseña';
    return password === confirmation ? null : 'Las contraseñas no coinciden';
}

export function validateName(name) {
    const value = (name ?? '').trim();
    if (!value) return 'El nombre es obligatorio';
    if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
    return null;
}

export function validateEmployeeId(employeeId, role) {
    if (!EMPLOYEE_ROLES.includes(role)) return null;
    return (employeeId ?? '').trim() ? null : 'El ID de empleado es requerido para el personal autorizado';
}

export function validatePhone(phone) {
    if (!phone) return null;
    const clean = phone.trim();
    if (clean && !/^[0-9+\s-]{7,15}$/.test(clean)) return 'Formato de teléfono inválido (ej. 0991234567)';
    return null;
}

/** Valida todo el formulario de registro. Devuelve { campo: mensaje } solo con los errores. */
export function validateRegisterForm({ name, email, phone, password, confirmPassword, role, employeeId }) {
    const errors = {
        name: validateName(name),
        email: validateEmail(email),
        phone: validatePhone(phone),
        password: validatePassword(password),
        confirmPassword: validatePasswordConfirmation(password, confirmPassword),
        employeeId: validateEmployeeId(employeeId, role)
    };
    return Object.fromEntries(Object.entries(errors).filter(([, message]) => message));
}
