import { fromHTML } from '../../utils/dom.js';
import { EMPLOYEE_ROLES } from '../../utils/validators.js';
import { FormField } from '../common/FormField.js';
import { PasswordInput } from '../common/PasswordInput.js';
import { Button } from '../common/Button.js';
import { RoleSelector } from './RoleSelector.js';
import { PasswordRequirements } from './PasswordRequirements.js';

/**
 * Formulario de registro (diseño de Stitch): selector de rol, ID de empleado
 * condicional, datos personales, requisitos de contraseña en vivo y confirmación.
 * No llama a la API: entrega los datos a onSubmit.
 * El elemento devuelto expone:
 *   - setLoading(boolean)
 *   - setErrors({ name?, email?, password?, confirmPassword?, employeeId? })
 *   - focusFirstError()
 * @param {object} props
 * @param {Function} props.onSubmit Recibe { role, employeeId, name, email, password, confirmPassword }
 * @param {string} [props.initialRole='CLIENTE']
 */
export function RegisterForm({ onSubmit, initialRole = 'CLIENTE' }) {
    const el = fromHTML(`<form class="space-y-space-md" novalidate></form>`);

    const employeeId = FormField({
        name: 'employeeId', label: 'ID de empleado', icon: 'badge', placeholder: 'Ej. EMP-00000',
        autocomplete: 'off', hint: 'Requerido'
    });
    const employeePanel = fromHTML(`
        <div class="bg-surface-container-low p-space-sm rounded-xl space-y-1 transition-all">
            <p class="font-body text-body-sm text-outline px-1 flex items-center gap-1">
                <span class="material-symbols-outlined text-[16px] text-primary" aria-hidden="true">verified</span>
                Requerido para Administrador, Cajero o Gestor de Clientes de AquaInsumos.
            </p>
        </div>
    `);
    employeePanel.prepend(employeeId);

    const role = RoleSelector({ value: initialRole, onChange: updateEmployeeVisibility });

    const name = FormField({
        name: 'name', label: 'Nombres y apellidos completos', icon: 'person',
        placeholder: 'Ingresa nombres y apellidos', autocomplete: 'name', required: true
    });
    const email = FormField({
        name: 'email', label: 'Correo institucional', icon: 'mail', type: 'email',
        placeholder: 'empleado@aquainsumos.ec', autocomplete: 'email', required: true
    });
    const phone = FormField({
        name: 'phone', label: 'Teléfono de contacto', icon: 'call', type: 'tel',
        placeholder: '0991234567', autocomplete: 'tel', hint: 'Ecuador'
    });

    const password = PasswordInput({
        name: 'password', label: 'Contraseña', placeholder: '••••••••',
        autocomplete: 'new-password', required: true
    });
    const requirements = PasswordRequirements();
    password.append(requirements);

    const confirmPassword = PasswordInput({
        name: 'confirmPassword', label: 'Confirmar contraseña', icon: 'lock_reset', placeholder: '••••••••',
        autocomplete: 'new-password', required: true
    });
    const matchHint = fromHTML(`
        <p class="hidden items-center gap-1.5 px-1 pt-1 text-primary" aria-live="polite">
            <span class="material-symbols-outlined icon-filled text-[16px]" aria-hidden="true">check</span>
            <span class="font-label text-label-sm font-semibold">Coincide con la contraseña ingresada</span>
        </p>
    `);
    confirmPassword.append(matchHint);

    const submit = Button({ label: 'Registrar empleado', icon: 'person_add', type: 'submit', fullWidth: true });
    const submitWrapper = fromHTML(`<div class="pt-2"></div>`);
    submitWrapper.append(submit);

    el.append(role, employeePanel, name, email, phone, password, confirmPassword, submitWrapper);

    const fields = { employeeId, name, email, phone, password, confirmPassword };

    function updateEmployeeVisibility(selectedRole) {
        const visible = EMPLOYEE_ROLES.includes(selectedRole);
        employeePanel.classList.toggle('hidden', !visible);
        employeeId.input.required = visible;
        if (!visible) employeeId.setError(null);
    }

    function updateMatch() {
        const matches = confirmPassword.input.value !== '' && confirmPassword.input.value === password.input.value;
        matchHint.classList.toggle('hidden', !matches);
        matchHint.classList.toggle('flex', matches);
    }

    password.input.addEventListener('input', () => {
        requirements.update(password.input.value);
        updateMatch();
    });
    confirmPassword.input.addEventListener('input', updateMatch);

    el.addEventListener('submit', event => {
        event.preventDefault();
        if (submit.disabled) return;
        onSubmit({
            role: role.value,
            employeeId: EMPLOYEE_ROLES.includes(role.value) ? employeeId.value : '',
            name: name.value,
            email: email.value,
            phone: phone.value,
            password: password.input.value,
            confirmPassword: confirmPassword.input.value
        });
    });

    el.setLoading = loading => {
        submit.setLoading(loading, 'Creando cuenta…');
        role.setDisabled(loading);
        Object.values(fields).forEach(field => { field.input.disabled = loading; });
    };

    el.setErrors = (errors = {}) => {
        Object.entries(fields).forEach(([key, field]) => field.setError(errors[key] ?? null));
    };

    el.focusFirstError = () => {
        const invalid = Object.values(fields).find(field => field.input.getAttribute('aria-invalid') === 'true');
        invalid?.input.focus();
    };

    updateEmployeeVisibility(role.value);
    return el;
}

