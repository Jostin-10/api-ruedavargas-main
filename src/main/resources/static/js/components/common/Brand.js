import { fromHTML, setText } from '../../utils/dom.js';

/**
 * Logo de AquaInsumos: icono acuícola + nombre de marca.
 * @param {object} props
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {string} [props.subtitle] Texto pequeño bajo el nombre (p. ej. "Insumos Camaroneros")
 * @param {string} [props.href] Si se indica, el logo es un enlace
 */
export function Brand({ size = 'md', subtitle, href } = {}) {
    const sizes = {
        sm: { box: 'w-9 h-9 rounded-lg', icon: 'text-xl', text: 'text-headline-sm' },
        md: { box: 'w-12 h-12 rounded-xl', icon: 'text-headline-md', text: 'text-headline-md' },
        lg: { box: 'w-14 h-14 rounded-2xl', icon: 'text-headline-lg', text: 'text-headline-lg' }
    }[size];

    const el = fromHTML(`
        <${href ? 'a' : 'div'} class="inline-flex items-center gap-space-sm group">
            <div class="${sizes.box} bg-gradient-to-br from-primary via-primary-container to-secondary-container flex items-center justify-center text-on-primary shadow-md shadow-primary/20 shrink-0 group-hover:scale-105 transition-transform">
                <span class="material-symbols-outlined icon-filled ${sizes.icon}" aria-hidden="true">water_drop</span>
            </div>
            <div class="flex flex-col leading-none">
                <span class="font-headline ${sizes.text} font-bold tracking-tight text-on-surface">Aqua<span class="text-primary">Insumos</span></span>
                <span data-subtitle class="font-label text-label-md text-on-surface-variant mt-1 hidden"></span>
            </div>
        </${href ? 'a' : 'div'}>
    `);

    if (href) el.setAttribute('href', href);
    if (subtitle) setText(el, '[data-subtitle]', subtitle).classList.remove('hidden');
    return el;
}
