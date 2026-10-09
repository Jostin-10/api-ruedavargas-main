import { fromHTML, setText } from '../../utils/dom.js';

/**
 * Barra superior corporativa para el sistema interno.
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.subtitle
 * @param {Function} props.onToggleSidebar
 */
export function TopNavbar({ title = 'Panel Interno', subtitle = 'AquaInsumos Ecuador', onToggleSidebar }) {
    const el = fromHTML(`
        <header class="h-20 bg-navy-900/90 backdrop-blur-md border-b border-navy-700/50 fixed top-0 right-0 left-0 lg:left-72 z-30 flex items-center justify-between px-4 sm:px-8 shadow-sm">
            <div class="flex items-center gap-3">
                <button type="button" data-toggle-sidebar
                    class="lg:hidden p-2 rounded-xl bg-navy-800 text-celeste-400 hover:text-white hover:bg-navy-700 transition-colors focus:outline-none"
                    aria-label="Abrir menú de navegación">
                    <span class="material-symbols-outlined text-2xl">menu</span>
                </button>
                <div class="flex flex-col">
                    <h1 data-header-title class="font-headline text-headline-sm sm:text-headline-md text-white font-bold tracking-tight"></h1>
                    <p data-header-subtitle class="font-body text-xs text-on-surface-variant flex items-center gap-1.5"></p>
                </div>
            </div>

            <div class="flex items-center gap-3 sm:gap-4">
                <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-950/60 border border-navy-800 text-xs font-label text-celeste-300">
                    <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                    <span>Servidor Operativo · Ecuador</span>
                </div>
                <div class="text-right hidden md:block">
                    <span class="block text-xs font-label text-white" data-current-date></span>
                    <span class="block text-[11px] font-body text-celeste-400">Sucursal Matriz Litoral</span>
                </div>
            </div>
        </header>
    `);

    setText(el, '[data-header-title]', title);
    setText(el, '[data-header-subtitle]', subtitle);

    const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const dateStr = new Date().toLocaleDateString('es-EC', dateOptions);
    const dateEl = el.querySelector('[data-current-date]');
    if (dateEl) dateEl.textContent = dateStr;

    el.querySelector('[data-toggle-sidebar]').addEventListener('click', onToggleSidebar);

    el.updateTitle = (newTitle, newSubtitle) => {
        setText(el, '[data-header-title]', newTitle);
        if (newSubtitle) setText(el, '[data-header-subtitle]', newSubtitle);
    };

    return el;
}
