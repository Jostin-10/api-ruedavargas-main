import { fromHTML, setText } from '../../utils/dom.js';
import { FeatureTile } from './FeatureTile.js';

const QUICK_ACTIONS = [
    { icon: 'inventory_2', title: 'Despacho de balanceado', description: 'Control de sacos y lotes', iconColor: 'text-primary' },
    { icon: 'science', title: 'Dosificación y biomasa', description: 'Probióticos y químicos' },
    { icon: 'qr_code_scanner', title: 'Escanear lote / QR', description: 'Trazabilidad en piscina', iconColor: 'text-tertiary' },
    { icon: 'water_drop', title: 'Calidad de agua', description: 'Registro de oxígeno y pH', iconColor: 'text-secondary' }
];

/**
 * Panel técnico y de despacho (roles ASESOR_TECNICO, CAJERO y ADMIN).
 * @param {object} props
 * @param {string} props.message
 * @param {string} [props.employeeId]
 */
export function CashierPanel({ message, employeeId }) {
    const el = fromHTML(`
        <section id="area-caja" class="flex flex-col gap-space-lg scroll-mt-28">
            <div class="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                <div class="flex items-center gap-space-md">
                    <div class="w-14 h-14 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center shadow-sm shrink-0">
                        <span class="material-symbols-outlined text-3xl" aria-hidden="true">biotech</span>
                    </div>
                    <div class="flex flex-col">
                        <div class="flex items-center gap-2">
                            <h2 data-message class="font-headline text-headline-md text-on-surface"></h2>
                            <span class="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" aria-hidden="true"></span>
                        </div>
                        <p data-employee class="font-body text-body-md text-on-surface-variant">
                            Código de Asesor / Técnico: <strong data-employee-id class="text-on-surface font-bold"></strong>
                        </p>
                    </div>
                </div>
                <span class="font-label text-label-md bg-surface-container-low px-3 py-1.5 rounded-xl text-secondary flex items-center gap-1.5 self-start md:self-auto">
                    <span class="w-2 h-2 rounded-full bg-secondary" aria-hidden="true"></span>
                    Acceso técnico autorizado
                </span>
            </div>
            <div data-actions class="grid grid-cols-2 md:grid-cols-4 gap-gutter"></div>
        </section>
    `);

    setText(el, '[data-message]', message);
    if (employeeId) setText(el, '[data-employee-id]', employeeId);
    else el.querySelector('[data-employee]').remove();
    el.querySelector('[data-actions]').append(...QUICK_ACTIONS.map(FeatureTile));
    return el;
}
