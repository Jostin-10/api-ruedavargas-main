import { fromHTML } from '../../utils/dom.js';
import { FormField } from './FormField.js';

/**
 * Campo de contraseña con botón para mostrar u ocultar el texto.
 * Acepta las mismas props que FormField (icono por defecto: lock).
 */
export function PasswordInput({ icon = 'lock', autocomplete = 'current-password', ...props } = {}) {
    const toggle = fromHTML(`
        <button type="button" aria-label="Mostrar contraseña" aria-pressed="false"
            class="absolute right-3 p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center">
            <span class="material-symbols-outlined text-xl" aria-hidden="true">visibility</span>
        </button>
    `);

    const field = FormField({ ...props, icon, autocomplete, type: 'password', trailing: toggle });

    toggle.addEventListener('click', () => {
        const visible = field.input.type === 'password';
        field.input.type = visible ? 'text' : 'password';
        toggle.querySelector('span').textContent = visible ? 'visibility_off' : 'visibility';
        toggle.setAttribute('aria-pressed', String(visible));
        toggle.setAttribute('aria-label', visible ? 'Ocultar contraseña' : 'Mostrar contraseña');
    });
    return field;
}
