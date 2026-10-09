import { fromHTML } from '../../utils/dom.js';

/** Estado de carga del dashboard (diseño de Stitch): aviso con spinner y tarjetas esqueleto. */
export function LoadingState() {
    return fromHTML(`
        <div class="flex flex-col gap-space-lg" role="status" aria-live="polite">
            <div class="bg-surface-container-lowest rounded-2xl p-space-xl shadow-md flex flex-col items-center justify-center text-center gap-space-md">
                <div class="relative w-16 h-16 flex items-center justify-center text-primary">
                    <span class="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></span>
                    <span class="material-symbols-outlined text-xl" aria-hidden="true">shopping_basket</span>
                </div>
                <div class="flex flex-col items-center">
                    <h2 class="font-headline text-headline-md text-on-surface">Cargando los datos de tu cuenta…</h2>
                    <p class="font-body text-body-md text-on-surface-variant max-w-md mt-1">Estamos preparando tu panel operativo de Rueda Vargas S.A.</p>
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop" aria-hidden="true">
                <div class="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-space-xl shadow-md flex flex-col gap-space-md animate-pulse">
                    <div class="h-6 w-36 bg-surface-container-high rounded-lg"></div>
                    <div class="h-12 w-48 bg-surface-container-high rounded-xl my-space-xs"></div>
                    <div class="h-16 w-full bg-surface-container-low rounded-xl"></div>
                </div>
                <div class="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-space-lg shadow-md flex flex-col gap-space-md animate-pulse">
                    <div class="h-6 w-32 bg-surface-container-high rounded-lg"></div>
                    <div class="h-10 w-full bg-surface-container-low rounded-xl"></div>
                    <div class="h-10 w-full bg-surface-container-low rounded-xl"></div>
                    <div class="h-10 w-full bg-surface-container-low rounded-xl"></div>
                </div>
            </div>
        </div>
    `);
}
