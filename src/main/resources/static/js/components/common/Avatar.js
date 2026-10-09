import { fromHTML } from '../../utils/dom.js';

/** Obtiene hasta dos iniciales de un nombre ("Mateo Gómez" → "MG"). */
export function initials(name = '') {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    const letters = parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[parts.length - 1][0];
    return letters.toUpperCase();
}

/**
 * Avatar circular con las iniciales del usuario (reemplaza las fotos de ejemplo de Stitch).
 * @param {object} props
 * @param {string} props.name
 * @param {'sm'|'lg'} [props.size='sm']
 * @param {boolean} [props.online=false] Muestra el punto verde de "en línea"
 */
export function Avatar({ name, size = 'sm', online = false }) {
    const dimension = size === 'lg' ? 'w-16 h-16 text-headline-sm ring-2 ring-primary/20' : 'w-8 h-8 text-label-md';
    const el = fromHTML(`
        <div class="relative shrink-0">
            <div data-initials class="${dimension} rounded-full bg-primary-container text-on-primary-container font-headline font-bold flex items-center justify-center shadow-sm"></div>
            <span data-online class="absolute bottom-0 right-0 w-4 h-4 bg-secondary rounded-full ring-2 ring-surface-container-lowest hidden"></span>
        </div>
    `);
    const circle = el.querySelector('[data-initials]');
    circle.textContent = initials(name);
    circle.setAttribute('aria-hidden', 'true');
    el.querySelector('[data-online]').classList.toggle('hidden', !online);
    return el;
}
