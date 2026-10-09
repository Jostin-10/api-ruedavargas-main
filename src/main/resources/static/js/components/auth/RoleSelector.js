import { fromHTML, setText } from '../../utils/dom.js';

export const ROLE_OPTIONS = [
    { value: 'ADMIN', label: 'Administrador', icon: 'admin_panel_settings', description: 'Control general y métricas' },
    { value: 'CAJERO', label: 'Cajero / Facturación', icon: 'point_of_sale', description: 'Ventas, cobros e IVA' },
    { value: 'GESTOR_CLIENTES', label: 'Gestor de Clientes', icon: 'domain', description: 'Camaroneras y pedidos' }
];

const STYLES = {
    selected: {
        button: 'bg-secondary-container text-on-secondary-container shadow-sm',
        circle: 'bg-primary text-on-primary shadow-sm',
        label: 'font-bold'
    },
    idle: {
        button: 'bg-surface-container-low text-on-surface hover:bg-surface-container',
        circle: 'bg-surface-container text-on-surface-variant',
        label: ''
    }
};

/**
 * Selector de perfil (Cliente / Cajero / Administrador) con semántica de radio
 * accesible: clic, flechas del teclado y aria-checked.
 * El elemento devuelto expone `value` (getter) y setDisabled(boolean).
 * @param {object} props
 * @param {string} [props.value='CLIENTE']
 * @param {Function} [props.onChange] Recibe el nuevo rol
 */
export function RoleSelector({ value = 'CLIENTE', onChange } = {}) {
    let current = value;
    const el = fromHTML(`
        <fieldset>
            <legend class="block font-label text-label-md text-on-surface font-semibold mb-2">Selecciona tu perfil de acceso</legend>
            <div data-options role="radiogroup" aria-label="Perfil de acceso" class="grid grid-cols-3 gap-space-sm"></div>
        </fieldset>
    `);
    const group = el.querySelector('[data-options]');

    const buttons = ROLE_OPTIONS.map(option => {
        const button = fromHTML(`
            <button type="button" role="radio"
                class="relative flex flex-col items-center justify-center p-3 rounded-xl transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <div data-circle class="w-10 h-10 rounded-full flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                    <span data-icon class="material-symbols-outlined text-[20px]" aria-hidden="true"></span>
                </div>
                <span data-label class="font-label text-label-md"></span>
                <span data-description class="hidden sm:block font-body text-[11px] text-on-surface-variant mt-0.5 text-center leading-tight"></span>
                <span data-dot class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary hidden"></span>
            </button>
        `);
        button.dataset.value = option.value;
        setText(button, '[data-icon]', option.icon);
        setText(button, '[data-label]', option.label);
        setText(button, '[data-description]', option.description);
        button.addEventListener('click', () => select(option.value, true));
        button.addEventListener('keydown', event => handleKeys(event, option.value));
        group.append(button);
        return button;
    });

    function render() {
        buttons.forEach(button => {
            const selected = button.dataset.value === current;
            const style = selected ? STYLES.selected : STYLES.idle;
            const other = selected ? STYLES.idle : STYLES.selected;
            button.classList.remove(...other.button.split(' '));
            button.classList.add(...style.button.split(' '));
            const circle = button.querySelector('[data-circle]');
            circle.classList.remove(...other.circle.split(' '));
            circle.classList.add(...style.circle.split(' '));
            button.querySelector('[data-label]').classList.toggle('font-bold', selected);
            button.querySelector('[data-icon]').classList.toggle('icon-filled', selected);
            button.querySelector('[data-dot]').classList.toggle('hidden', !selected);
            button.setAttribute('aria-checked', String(selected));
            button.tabIndex = selected ? 0 : -1;
        });
    }

    function select(role, focus = false) {
        if (role !== current) {
            current = role;
            render();
            onChange?.(role);
        }
        if (focus) buttons.find(button => button.dataset.value === role)?.focus();
    }

    function handleKeys(event, role) {
        const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        if (!(event.key in keys)) return;
        event.preventDefault();
        const index = ROLE_OPTIONS.findIndex(option => option.value === role);
        const next = ROLE_OPTIONS[(index + keys[event.key] + ROLE_OPTIONS.length) % ROLE_OPTIONS.length];
        select(next.value, true);
    }

    render();
    Object.defineProperty(el, 'value', { get: () => current });
    el.setDisabled = disabled => { el.disabled = disabled; };
    return el;
}
