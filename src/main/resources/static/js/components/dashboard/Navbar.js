import { fromHTML, setText } from '../../utils/dom.js';
import { Brand } from '../common/Brand.js';
import { Avatar } from '../common/Avatar.js';
import { RoleBadge } from './RoleBadge.js';

/**
 * Barra superior fija del dashboard (diseño de Stitch): logo, usuario con su rol
 * y botón de cerrar sesión. Se omiten el buscador y los enlaces de catálogo,
 * ofertas y sucursales porque no existen en el backend.
 * @param {object} props
 * @param {{ name: string, role: string }} props.user
 * @param {Function} props.onLogout
 */
export function Navbar({ user, onLogout }) {
    const el = fromHTML(`
        <header class="fixed top-0 left-0 right-0 z-40 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
            <div class="h-20 max-w-[1360px] mx-auto px-margin md:px-margin-desktop flex items-center justify-between gap-space-lg">
                <div data-brand></div>
                <div class="flex items-center gap-space-sm md:gap-space-md">
                    <div class="flex items-center gap-space-sm bg-surface-container-low p-space-xs rounded-full">
                        <div data-avatar></div>
                        <div class="hidden sm:flex flex-col pr-space-xs">
                            <span data-name class="font-label text-label-sm text-on-surface font-bold leading-none"></span>
                            <div data-role class="flex items-center gap-1 mt-0.5"></div>
                        </div>
                    </div>
                    <button data-logout type="button" title="Cerrar sesión" aria-label="Cerrar sesión"
                        class="h-9 px-2 sm:px-3 rounded-full flex items-center justify-center gap-1.5 text-on-surface-variant hover:bg-error-container/30 hover:text-error transition-colors">
                        <span class="material-symbols-outlined text-xl" aria-hidden="true">logout</span>
                        <span class="hidden md:inline font-label text-label-md">Cerrar sesión</span>
                    </button>
                </div>
            </div>
        </header>
    `);

    el.querySelector('[data-brand]').append(Brand({ size: 'sm', href: '/dashboard.html' }));
    el.querySelector('[data-avatar]').append(Avatar({ name: user.name }));
    setText(el, '[data-name]', user.name);
    el.querySelector('[data-role]').append(RoleBadge({ role: user.role, size: 'sm' }));
    el.querySelector('[data-logout]').addEventListener('click', onLogout);
    return el;
}
