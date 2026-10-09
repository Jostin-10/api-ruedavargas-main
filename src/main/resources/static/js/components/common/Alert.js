import { fromHTML, setText } from '../../utils/dom.js';

const VARIANTS = {
    error: { icon: 'error', box: 'bg-error-container/60 text-on-error-container', accent: 'text-error' },
    success: { icon: 'check_circle', box: 'bg-secondary-container/40 text-on-secondary-container', accent: 'text-primary' },
    info: { icon: 'info', box: 'bg-surface-container-high text-on-surface-variant', accent: 'text-primary' }
};

/**
 * Mensaje de notificación (error, éxito o información).
 * @param {object} props
 * @param {'error'|'success'|'info'} [props.type='error']
 * @param {string} [props.title]
 * @param {string} props.message
 * @param {boolean} [props.dismissible=true] Muestra el botón de cerrar
 * @param {Function} [props.onClose] Se llama después de cerrar la alerta
 */
export function Alert({ type = 'error', title, message, dismissible = true, onClose } = {}) {
    const variant = VARIANTS[type] ?? VARIANTS.error;
    const el = fromHTML(`
        <div class="w-full ${variant.box} rounded-xl p-space-md flex items-start gap-space-sm transition-all duration-300">
            <span class="material-symbols-outlined icon-filled ${variant.accent} shrink-0" aria-hidden="true">${variant.icon}</span>
            <div class="flex-1 min-w-0 pt-0.5">
                <p data-title class="font-label text-label-lg font-semibold ${variant.accent} mb-0.5"></p>
                <p data-message class="font-body text-body-sm"></p>
            </div>
            <button data-close type="button" aria-label="Cerrar notificación"
                class="${variant.accent} opacity-70 hover:opacity-100 transition-opacity p-1 rounded-lg shrink-0">
                <span class="material-symbols-outlined text-lg leading-none" aria-hidden="true">close</span>
            </button>
        </div>
    `);

    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
    if (title) setText(el, '[data-title]', title);
    else el.querySelector('[data-title]').remove();
    setText(el, '[data-message]', message);

    const closeButton = el.querySelector('[data-close]');
    if (dismissible) {
        closeButton.addEventListener('click', () => {
            el.remove();
            onClose?.();
        });
    } else {
        closeButton.remove();
    }
    return el;
}
