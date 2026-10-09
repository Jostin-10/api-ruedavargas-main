import { fromHTML, setText } from '../../utils/dom.js';
import { FeatureTile } from './FeatureTile.js';

const MODULES = [
    { icon: 'inventory_2', title: 'Inventario de Insumos', description: 'Balanceados y aditivos', iconColor: 'text-primary' },
    { icon: 'manage_accounts', title: 'Camaroneras y Técnicos', description: 'Fincas, clientes y asesores' },
    { icon: 'monitoring', title: 'Métricas de Despacho', description: 'Toneladas por sector', iconColor: 'text-tertiary' },
    { icon: 'fact_check', title: 'Control de Calidad', description: 'Lotes y trazabilidad', iconColor: 'text-secondary' }
];

/**
 * Panel de administración (rol ADMIN). El mensaje viene de GET /api/auth/admin-only.
 * @param {object} props
 * @param {string} props.message
 * @param {Function} [props.onGoToCashier] Acción del botón "Ir al área de caja"
 */
export function AdminPanel({ message, onGoToCashier }) {
    const el = fromHTML(`
        <section class="flex flex-col gap-space-lg">
            <div class="bg-gradient-to-r from-surface-container-lowest via-surface-container-low to-surface-container-lowest rounded-2xl p-space-lg shadow-md flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                <div>
                    <div class="flex items-center gap-space-xs">
                        <span class="material-symbols-outlined text-primary text-2xl" aria-hidden="true">admin_panel_settings</span>
                        <span class="font-label text-label-sm uppercase tracking-widest text-primary font-bold">Mando central de operaciones</span>
                    </div>
                    <h2 data-message class="font-headline text-headline-md text-on-surface mt-1"></h2>
                    <p class="font-body text-body-md text-on-surface-variant">Panel de control central de AquaInsumos.</p>
                </div>
                <button data-cashier type="button"
                    class="h-12 px-space-md bg-secondary text-on-secondary hover:bg-tertiary font-label text-label-md font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0">
                    <span class="material-symbols-outlined text-lg" aria-hidden="true">biotech</span>
                    Ir al área técnica y despacho
                </button>
            </div>
            <div data-modules class="grid grid-cols-2 md:grid-cols-4 gap-gutter"></div>
        </section>
    `);

    setText(el, '[data-message]', message);
    const cashierButton = el.querySelector('[data-cashier]');
    if (onGoToCashier) cashierButton.addEventListener('click', onGoToCashier);
    else cashierButton.remove();
    el.querySelector('[data-modules]').append(...MODULES.map(FeatureTile));
    return el;
}
