import { fromHTML, setText } from '../../utils/dom.js';
import { Brand } from '../common/Brand.js';
import { Avatar } from '../common/Avatar.js';
import { RoleBadge } from './RoleBadge.js';

/**
 * Menú lateral (Sidebar) corporativo en azul marino y celeste para el sistema interno.
 * @param {object} props
 * @param {{ name: string, email: string, role: string, employeeId?: string }} props.user
 * @param {string} props.activeTab 'admin' | 'cashier' | 'clients' | 'profile'
 * @param {Function} props.onSelectTab
 * @param {Function} props.onLogout
 */
export function Sidebar({ user, activeTab = 'admin', onSelectTab, onLogout }) {
    const el = fromHTML(`
        <aside class="w-72 bg-navy-900 border-r border-navy-700/60 flex flex-col justify-between h-screen fixed top-0 left-0 z-40 transition-transform duration-300 shadow-2xl">
            <!-- Encabezado con Logo de la Empresa -->
            <div class="flex flex-col">
                <div class="h-20 px-6 border-b border-navy-800/80 flex items-center justify-between">
                    <div data-brand></div>
                    <button type="button" data-close-mobile class="lg:hidden p-2 text-on-surface-variant hover:text-white rounded-lg">
                        <span class="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                <!-- Tarjeta del Trabajador Autenticado -->
                <div class="p-5 border-b border-navy-800/80 bg-navy-950/40">
                    <div class="flex items-center gap-3">
                        <div data-avatar></div>
                        <div class="flex flex-col min-w-0">
                            <span data-user-name class="font-headline text-label-md font-bold text-white truncate"></span>
                            <span data-user-email class="font-body text-[11px] text-on-surface-variant/80 truncate"></span>
                            <div class="flex items-center gap-1.5 mt-1">
                                <div data-role-badge></div>
                            </div>
                        </div>
                    </div>
                    <div data-emp-id-container class="mt-2.5 pt-2 border-t border-navy-800/50 flex items-center justify-between text-[11px] text-celeste-300 font-label">
                        <span class="flex items-center gap-1">
                            <span class="material-symbols-outlined text-[13px]">badge</span>
                            ID Colaborador:
                        </span>
                        <strong data-emp-id class="text-white"></strong>
                    </div>
                </div>

                <!-- Navegación por Módulos Internos -->
                <nav class="p-4 space-y-1.5 overflow-y-auto" aria-label="Navegación interna">
                    <p class="px-3 pt-2 pb-1 text-[10px] font-label font-bold uppercase tracking-widest text-celeste-400/80">
                        Módulos de Trabajo
                    </p>

                    <button type="button" data-tab="admin"
                        class="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-label text-label-md font-semibold transition-all group text-left">
                        <span class="material-symbols-outlined text-xl transition-colors">admin_panel_settings</span>
                        <div class="flex flex-col leading-tight">
                            <span>1. Dashboard Administrador</span>
                            <span class="text-[10px] font-body text-on-surface-variant font-normal group-hover:text-celeste-200">KPIs, personal e inventario</span>
                        </div>
                    </button>

                    <button type="button" data-tab="cashier"
                        class="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-label text-label-md font-semibold transition-all group text-left">
                        <span class="material-symbols-outlined text-xl transition-colors">point_of_sale</span>
                        <div class="flex flex-col leading-tight">
                            <span>2. Dashboard Cajero (POS)</span>
                            <span class="text-[10px] font-body text-on-surface-variant font-normal group-hover:text-celeste-200">Facturación, ventas e IVA</span>
                        </div>
                    </button>

                    <button type="button" data-tab="clients"
                        class="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-label text-label-md font-semibold transition-all group text-left">
                        <span class="material-symbols-outlined text-xl transition-colors">domain</span>
                        <div class="flex flex-col leading-tight">
                            <span>3. Gestor de Camaroneras</span>
                            <span class="text-[10px] font-body text-on-surface-variant font-normal group-hover:text-celeste-200">Cartera de clientes y pedidos</span>
                        </div>
                    </button>

                    <div class="pt-3 pb-1 border-t border-navy-800/60 mt-3">
                        <p class="px-3 pb-1 text-[10px] font-label font-bold uppercase tracking-widest text-celeste-400/80">
                            Opciones Rápidas
                        </p>
                        <button type="button" data-tab="profile"
                            class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-label text-label-md font-medium transition-all group text-left">
                            <span class="material-symbols-outlined text-xl">account_circle</span>
                            <span>Mi Ficha de Empleado</span>
                        </button>
                    </div>
                </nav>
            </div>

            <!-- Pie del Sidebar con Salida de Sesión -->
            <div class="p-4 border-t border-navy-800/80 bg-navy-950/30">
                <div class="flex items-center justify-between text-[11px] text-on-surface-variant/70 mb-3 px-1">
                    <span>AquaInsumos v1.0.0</span>
                    <span class="flex items-center gap-1 text-secondary">
                        <span class="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                        En línea
                    </span>
                </div>
                <button type="button" data-logout
                    class="w-full h-11 px-4 rounded-xl bg-navy-800 hover:bg-error-container/40 text-on-surface-variant hover:text-error border border-navy-700/60 font-label text-label-md font-semibold flex items-center justify-center gap-2 transition-all shadow-sm">
                    <span class="material-symbols-outlined text-lg">logout</span>
                    <span>Cerrar sesión</span>
                </button>
            </div>
        </aside>
    `);

    // Inyectar datos del colaborador
    el.querySelector('[data-brand]').append(Brand({ size: 'sm', subtitle: 'Gestión Camaronera' }));
    el.querySelector('[data-avatar]').append(Avatar({ name: user.name, size: 'md', online: true }));
    setText(el, '[data-user-name]', user.name);
    setText(el, '[data-user-email]', user.email);
    el.querySelector('[data-role-badge]').append(RoleBadge({ role: user.role, size: 'sm' }));

    if (user.employeeId) {
        setText(el, '[data-emp-id]', user.employeeId);
    } else {
        el.querySelector('[data-emp-id-container]').remove();
    }

    // Estilos de botones de navegación
    const navButtons = el.querySelectorAll('[data-tab]');
    function updateActiveState(tab) {
        navButtons.forEach(btn => {
            const isSelected = btn.dataset.tab === tab;
            btn.classList.toggle('bg-celeste-600', isSelected);
            btn.classList.toggle('text-white', isSelected);
            btn.classList.toggle('shadow-md', isSelected);
            btn.classList.toggle('shadow-celeste-600/20', isSelected);
            btn.classList.toggle('text-on-surface-variant', !isSelected);
            btn.classList.toggle('hover:bg-navy-800/80', !isSelected);
            btn.classList.toggle('hover:text-white', !isSelected);
            const icon = btn.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.classList.toggle('text-white', isSelected);
                icon.classList.toggle('text-celeste-400', !isSelected);
            }
        });
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            updateActiveState(tab);
            onSelectTab?.(tab);
        });
    });

    el.querySelector('[data-logout]').addEventListener('click', onLogout);
    updateActiveState(activeTab);

    return el;
}
