import { fromHTML } from '../../utils/dom.js';
import { FormField } from '../common/FormField.js';
import { PasswordInput } from '../common/PasswordInput.js';
import { Button } from '../common/Button.js';

/**
 * Formulario de inicio de sesión (diseño de Stitch).
 * No llama a la API: entrega los datos a onSubmit y la página decide qué hacer.
 * El elemento devuelto expone:
 *   - setLoading(boolean)
 *   - setErrors({ email?, password? })
 *   - focusFirstError()
 * @param {object} props
 * @param {Function} props.onSubmit Recibe { email, password, remember }
 * @param {boolean} [props.rememberDefault=true]
 */
export function LoginForm({ onSubmit, rememberDefault = true }) {
    const el = fromHTML(`<form class="flex flex-col space-y-space-md" novalidate></form>`);

    const email = FormField({
        name: 'email', label: 'Correo electrónico institucional', icon: 'mail', type: 'email',
        placeholder: 'empleado@aquainsumos.ec', autocomplete: 'email', hint: 'Requerido', required: true
    });
    const password = PasswordInput({
        name: 'password', label: 'Contraseña corporativa', placeholder: '••••••••',
        autocomplete: 'current-password', required: true
    });

    const remember = fromHTML(`
        <div class="flex items-center justify-between pt-1 flex-wrap gap-2">
            <label class="flex items-center gap-2.5 cursor-pointer select-none group">
                <input type="checkbox" name="remember" class="w-4 h-4 rounded accent-primary cursor-pointer">
                <span class="font-body text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                    Recordar sesión
                </span>
            </label>
            <button type="button" data-forgot class="font-label text-label-sm text-primary hover:text-celeste-300 hover:underline transition-colors focus:outline-none">
                ¿Olvidaste tu contraseña?
            </button>
        </div>
    `);
    const rememberInput = remember.querySelector('input');
    rememberInput.checked = rememberDefault;

    // Modal de recuperación de contraseña
    remember.querySelector('[data-forgot]').addEventListener('click', () => {
        const modal = fromHTML(`
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
                <div class="w-full max-w-md bg-surface-container rounded-2xl p-6 shadow-2xl border border-celeste-500/20 flex flex-col gap-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2 text-primary">
                            <span class="material-symbols-outlined text-2xl">lock_reset</span>
                            <h3 class="font-headline text-headline-sm text-on-surface">Recuperar Contraseña</h3>
                        </div>
                        <button type="button" data-close class="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <p class="font-body text-body-sm text-on-surface-variant">
                        Ingresa tu correo institucional registrado en <strong>AquaInsumos</strong> para recibir un enlace de restablecimiento de contraseña temporal.
                    </p>
                    <div class="space-y-3">
                        <input type="email" data-recovery-email placeholder="empleado@aquainsumos.ec" value="${email.value || ''}"
                            class="w-full h-11 px-3.5 rounded-xl bg-surface-container-low border border-outline/30 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary text-body-sm">
                        <div data-recovery-msg class="hidden p-3 rounded-xl bg-secondary-container/40 text-on-secondary-container text-body-sm flex items-center gap-2">
                            <span class="material-symbols-outlined text-lg text-secondary">check_circle</span>
                            <span>Enlace enviado. Revisa tu bandeja institucional.</span>
                        </div>
                        <button type="button" data-send-recovery
                            class="w-full h-11 bg-primary text-on-primary font-label text-label-md font-bold rounded-xl hover:bg-primary-container transition-all flex items-center justify-center gap-2">
                            <span class="material-symbols-outlined text-lg">send</span>
                            Enviar enlace de recuperación
                        </button>
                    </div>
                </div>
            </div>
        `);
        modal.querySelector('[data-close]').addEventListener('click', () => modal.remove());
        modal.querySelector('[data-send-recovery]').addEventListener('click', () => {
            const val = modal.querySelector('[data-recovery-email]').value.trim();
            if (!val) return;
            modal.querySelector('[data-recovery-msg]').classList.remove('hidden');
            modal.querySelector('[data-send-recovery]').disabled = true;
            modal.querySelector('[data-send-recovery]').classList.add('opacity-50');
            setTimeout(() => modal.remove(), 2500);
        });
        document.body.append(modal);
    });

    const submit = Button({ label: 'Ingresar al sistema', icon: 'arrow_forward', type: 'submit', fullWidth: true });
    const submitWrapper = fromHTML(`<div class="pt-2"></div>`);
    submitWrapper.append(submit);

    el.append(email, password, remember, submitWrapper);

    const fields = { email, password };

    el.addEventListener('submit', event => {
        event.preventDefault();
        if (submit.disabled) return;
        onSubmit({ email: email.value, password: password.input.value, remember: rememberInput.checked });
    });

    el.setLoading = loading => {
        submit.setLoading(loading, 'Ingresando…');
        [email.input, password.input, rememberInput].forEach(input => { input.disabled = loading; });
    };

    el.setErrors = (errors = {}) => {
        Object.entries(fields).forEach(([name, field]) => field.setError(errors[name] ?? null));
    };

    el.focusFirstError = () => {
        const invalid = Object.values(fields).find(field => field.input.getAttribute('aria-invalid') === 'true');
        (invalid ?? email).input.focus();
    };

    return el;
}
