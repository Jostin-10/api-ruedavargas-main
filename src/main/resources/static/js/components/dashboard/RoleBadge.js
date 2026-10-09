import { fromHTML, setText } from '../../utils/dom.js';

export const ROLE_INFO = {
    ADMIN: { label: 'Administrador General', icon: 'admin_panel_settings' },
    CAJERO: { label: 'Cajero / Facturación', icon: 'point_of_sale' },
    GESTOR_CLIENTES: { label: 'Gestor de Camaroneras', icon: 'domain' },
    CLIENTE: { label: 'Colaborador', icon: 'badge' }
};

/**
 * Insignia con el rol del usuario.
 * @param {object} props
 * @param {string} props.role CLIENTE | CAJERO | ADMIN
 * @param {'sm'|'md'} [props.size='md']
 */
export function RoleBadge({ role, size = 'md' }) {
    const info = ROLE_INFO[role] ?? { label: role, icon: 'person' };
    const sizing = size === 'sm' ? 'text-label-sm px-1.5 py-0.5' : 'text-label-md px-3 py-1 shadow-sm';
    const el = fromHTML(`
        <span class="bg-secondary-container text-on-secondary-container font-label ${sizing} rounded-full font-bold inline-flex items-center gap-1">
            <span data-icon class="material-symbols-outlined text-[16px] ${size === 'sm' ? 'hidden' : ''}" aria-hidden="true"></span>
            <span data-label></span>
        </span>
    `);
    setText(el, '[data-icon]', info.icon);
    setText(el, '[data-label]', size === 'sm' ? info.label : `Rol: ${info.label}`);
    return el;
}
