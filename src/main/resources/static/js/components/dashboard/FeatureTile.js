import { fromHTML, setText } from '../../utils/dom.js';

/**
 * Acceso a una funcionalidad que aún no existe en el backend.
 * Mantiene el aspecto de los botones de Stitch, pero deshabilitado y con la etiqueta "Próximamente".
 * @param {object} props
 * @param {string} props.icon
 * @param {string} props.title
 * @param {string} props.description
 * @param {string} [props.iconColor='text-secondary']
 */
export function FeatureTile({ icon, title, description, iconColor = 'text-secondary' }) {
    const el = fromHTML(`
        <div aria-disabled="true"
            class="relative p-space-lg bg-surface-container-lowest text-on-surface rounded-2xl shadow-md flex flex-col items-center text-center gap-space-xs opacity-75 cursor-not-allowed">
            <span class="absolute top-2 right-2 font-label text-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant">Próximamente</span>
            <span data-icon class="material-symbols-outlined text-3xl ${iconColor} mt-space-xs" aria-hidden="true"></span>
            <span data-title class="font-label text-label-lg font-bold"></span>
            <span data-description class="text-xs text-on-surface-variant"></span>
        </div>
    `);
    setText(el, '[data-icon]', icon);
    setText(el, '[data-title]', title);
    setText(el, '[data-description]', description);
    return el;
}
