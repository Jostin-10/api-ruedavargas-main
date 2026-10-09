import { fromHTML, setText } from '../../utils/dom.js';

/** Nota legal al pie de las páginas. El año se calcula automáticamente. */
export function Footer({ company = 'Rueda Vargas S.A.' } = {}) {
    const el = fromHTML(`
        <footer class="mt-space-md text-center">
            <p class="font-body text-body-sm text-on-surface-variant/70"></p>
        </footer>
    `);
    setText(el, 'p', `© ${new Date().getFullYear()} ${company} Todos los derechos reservados.`);
    return el;
}
