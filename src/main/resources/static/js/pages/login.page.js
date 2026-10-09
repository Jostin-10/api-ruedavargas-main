/**
 * Página de login: arma la vista con componentes y la conecta con el backend.
 * Mensajes por URL:
 *   ?expired=1     → la sesión venció (lo usa el dashboard)
 *   ?registered=1  → cuenta recién creada (lo usa el registro)
 */
import { mount } from '../utils/dom.js';
import { ROUTES, redirectIfAuthenticated } from '../utils/session.js';
import { validateEmail, validateLoginPassword } from '../utils/validators.js';
import { login } from '../services/auth.service.js';
import { AuthLayout } from '../components/auth/AuthLayout.js';
import { LoginForm } from '../components/auth/LoginForm.js';
import { Alert } from '../components/common/Alert.js';

const NOTICES = {
    expired: { type: 'info', title: 'Sesión expirada', message: 'Tu sesión terminó. Vuelve a iniciar sesión para continuar.' },
    registered: { type: 'success', title: 'Cuenta creada', message: 'Tu cuenta se registró correctamente. Ya puedes iniciar sesión.' }
};

function showAlert(layout, props) {
    mount(layout.alertSlot, props ? Alert(props) : null);
}

function initialNotice() {
    const params = new URLSearchParams(window.location.search);
    const key = Object.keys(NOTICES).find(name => params.has(name));
    if (key) window.history.replaceState(null, '', window.location.pathname);
    return key ? NOTICES[key] : null;
}

function init() {
    if (redirectIfAuthenticated()) return;

    const form = LoginForm({ onSubmit: handleSubmit });
    const layout = AuthLayout({
        title: 'Acceso al Sistema Interno',
        subtitle: 'Sistema administrativo de insumos para camaroneras. Exclusivo para trabajadores autorizados.',
        brandSubtitle: 'AquaInsumos Ecuador',
        content: form,
        footerLink: { text: '¿Nuevo trabajador?', label: 'Registrar empleado', href: ROUTES.register }
    });

    mount(document.getElementById('app'), layout);
    showAlert(layout, initialNotice());
    form.querySelector('input[name="email"]').focus();

    async function handleSubmit({ email, password, remember }) {
        showAlert(layout, null);

        const errors = {};
        const emailError = validateEmail(email);
        const passwordError = validateLoginPassword(password);
        if (emailError) errors.email = emailError;
        if (passwordError) errors.password = passwordError;
        form.setErrors(errors);
        if (Object.keys(errors).length) {
            form.focusFirstError();
            return;
        }

        form.setLoading(true);
        try {
            await login(email, password, remember);
            window.location.replace(ROUTES.dashboard);
        } catch (error) {
            form.setLoading(false);
            const unauthorized = error.status === 401;
            showAlert(layout, {
                type: 'error',
                title: unauthorized ? 'Acceso no autorizado' : 'No se pudo iniciar sesión',
                message: unauthorized
                    ? 'Credenciales inválidas. Por favor verifica tu correo o contraseña e inténtalo nuevamente.'
                    : error.message
            });
            if (unauthorized) form.querySelector('input[name="password"]').select();
        }
    }
}

init();
