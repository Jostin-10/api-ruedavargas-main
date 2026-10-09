import { fromHTML, setText } from '../../utils/dom.js';
import { formatPoints } from '../../utils/format.js';

/**
 * Tarjeta del programa SuperPuntos (vista Cliente) con los puntos reales del usuario.
 * Se omiten la meta, el progreso y el vencimiento del diseño porque el backend no los maneja.
 * @param {object} props
 * @param {number} props.points
 */
export function LoyaltyCard({ points = 0 }) {
    const el = fromHTML(`
        <section class="bg-surface-container-lowest rounded-2xl p-space-lg md:p-space-xl shadow-md flex flex-col justify-between relative overflow-hidden">
            <div class="absolute -right-8 -top-8 w-44 h-44 bg-secondary-fixed/10 rounded-full blur-2xl pointer-events-none"></div>
            <div class="flex flex-col gap-space-md">
                <div class="flex items-center gap-space-xs">
                    <span class="material-symbols-outlined icon-filled text-tertiary text-2xl" aria-hidden="true">stars</span>
                    <h2 class="font-label text-label-lg uppercase tracking-wide text-tertiary font-bold">Programa AquaPuntos</h2>
                </div>
                <p class="flex items-baseline gap-space-xs flex-wrap my-space-xs">
                    <span data-points class="font-headline text-headline-xl-mobile md:text-headline-xl text-primary font-bold tracking-tight"></span>
                    <span class="font-headline text-headline-sm text-secondary">AquaPuntos acumulados</span>
                </p>
                <p data-message class="font-body text-body-sm text-on-surface-variant bg-surface-container-low p-space-md rounded-xl"></p>
            </div>
            <div class="flex flex-wrap items-center gap-space-sm mt-space-lg">
                <button type="button" disabled
                    class="h-12 px-space-lg bg-primary text-on-primary font-label text-label-lg rounded-xl flex items-center gap-2 opacity-60 cursor-not-allowed">
                    <span class="material-symbols-outlined text-lg" aria-hidden="true">redeem</span>
                    Canjear beneficios
                </button>
                <span class="font-label text-label-sm text-on-surface-variant">Canjes por análisis de agua o descuentos: próximamente</span>
            </div>
        </section>
    `);

    setText(el, '[data-points]', formatPoints(points));
    setText(el, '[data-message]', points > 0
        ? 'Sigue sumando AquaPuntos en cada compra de balanceado o probióticos para canjearlos por análisis de agua o beneficios en despacho.'
        : 'Aún no tienes AquaPuntos. Empieza a acumularlos en tu próximo pedido de insumos en AquaInsumos.');
    return el;
}
