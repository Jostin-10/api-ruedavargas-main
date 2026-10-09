import { fromHTML } from '../../utils/dom.js';

/**
 * Indicador de carga circular. Toma el color del texto del contenedor.
 * @param {object} props
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {string} [props.label='Cargando'] Texto para lectores de pantalla
 */
export function Spinner({ size = 'md', label = 'Cargando' } = {}) {
    const dimension = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-[3px]', lg: 'w-12 h-12 border-4' }[size];
    const el = fromHTML(`
        <span role="status" class="inline-block ${dimension} rounded-full border-current border-t-transparent animate-spin"></span>
    `);
    el.setAttribute('aria-label', label);
    return el;
}
