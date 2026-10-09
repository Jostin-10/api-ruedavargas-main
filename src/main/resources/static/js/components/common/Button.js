import { fromHTML, setText, icon as createIcon } from '../../utils/dom.js';
import { Spinner } from './Spinner.js';

const VARIANTS = {
    primary: 'bg-primary hover:bg-primary-container text-on-primary shadow-lg shadow-primary/20 hover:shadow-primary/30',
    secondary: 'bg-surface-container-high hover:bg-surface-container-highest text-on-surface',
    ghost: 'bg-transparent hover:bg-surface-container text-on-surface-variant hover:text-on-surface',
    danger: 'bg-transparent hover:bg-error-container/40 text-error'
};

/**
 * Botón con icono opcional y estado de carga.
 * El elemento devuelto expone setLoading(boolean, textoDeCarga?).
 * @param {object} props
 * @param {string} props.label
 * @param {string} [props.icon] Nombre del icono Material Symbols (a la derecha)
 * @param {'button'|'submit'} [props.type='button']
 * @param {'primary'|'secondary'|'ghost'|'danger'} [props.variant='primary']
 * @param {boolean} [props.fullWidth=false]
 * @param {Function} [props.onClick]
 */
export function Button({ label, icon, type = 'button', variant = 'primary', fullWidth = false, onClick } = {}) {
    const el = fromHTML(`
        <button class="${fullWidth ? 'w-full' : ''} h-12 px-space-lg ${VARIANTS[variant] ?? VARIANTS.primary}
            font-label text-label-lg rounded-xl flex items-center justify-center gap-2 transition-all duration-200
            group active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100">
            <span data-label></span>
            <span data-icon class="contents"></span>
        </button>
    `);

    el.type = type;
    setText(el, '[data-label]', label);
    const iconSlot = el.querySelector('[data-icon]');
    const idleIcon = icon ? createIcon(icon, 'text-lg group-hover:translate-x-0.5 transition-transform') : null;
    if (idleIcon) iconSlot.append(idleIcon);
    if (onClick) el.addEventListener('click', onClick);

    el.setLoading = (loading, loadingLabel = 'Procesando…') => {
        el.disabled = loading;
        el.setAttribute('aria-busy', String(loading));
        setText(el, '[data-label]', loading ? loadingLabel : label);
        iconSlot.replaceChildren(...(loading ? [Spinner({ size: 'sm' })] : idleIcon ? [idleIcon] : []));
    };
    return el;
}
