/**
 * Página de registro: arma la vista con componentes y la conecta con el backend.
 * Al crear la cuenta redirige al login con el aviso ?registered=1.
 */
import { mount } from '../utils/dom.js';
import { ROUTES, redirectIfAuthenticated } from '../utils/session.js';
import { validateRegisterForm } from '../utils/validators.js';
import { register } from '../services/auth.service.js';
import { AuthLayout } from '../components/auth/AuthLayout.js';
import { RegisterForm } from '../components/auth/RegisterForm.js';
import { Alert } from '../components/common/Alert.js';

/** Asocia los mensajes de error del backend con el campo correspondiente. */
const BACKEND_FIELD_ERRORS = [
    { pattern: /email/i, field: 'email' },
    { pattern: /employeeId/i, field: 'employeeId', message: text => text.replace('employeeId', 'ID de empleado') },
    { pattern: /contraseña/i, field: 'password' },
    { pattern: /nombre/i, field: 'name' }
];

function init() {
    if (redirectIfAuthenticated()) return;

    const form = RegisterForm({ onSubmit: handleSubmit, initialRole: 'ADMIN' });
    const layout = AuthLayout({
        title: 'Registro de Empleados',
        subtitle: 'Alta de personal en el sistema administrativo interno de AquaInsumos.',
        brandSubtitle: 'AquaInsumos Ecuador',
        content: form,
        footerLink: { text: '¿Ya estás registrado?', label: 'Inicia sesión', href: ROUTES.login },
        maxWidth: 'max-w-2xl'
    });

    mount(document.getElementById('app'), layout);

    function showAlert(props) {
        mount(layout.alertSlot, props ? Alert(props) : null);
    }

    async function handleSubmit(data) {
        showAlert(null);

        const errors = validateRegisterForm(data);
        form.setErrors(errors);
        if (Object.keys(errors).length) {
            form.focusFirstError();
            return;
        }

        form.setLoading(true);
        try {
            await register(data);
            window.location.replace(`${ROUTES.login}?registered=1`);
        } catch (error) {
            form.setLoading(false);
            const match = error.status === 400 && BACKEND_FIELD_ERRORS.find(rule => rule.pattern.test(error.message));
            if (match) {
                form.setErrors({ [match.field]: match.message ? match.message(error.message) : error.message });
                form.focusFirstError();
            } else {
                showAlert({ type: 'error', title: 'No se pudo crear la cuenta', message: error.message });
            }
        }
    }
}

init();
