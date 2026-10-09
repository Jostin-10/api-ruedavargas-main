import { fromHTML, setText } from '../../utils/dom.js';
import { Brand } from '../common/Brand.js';
import { TrustBadges } from '../common/TrustBadges.js';
import { Footer } from '../common/Footer.js';

/**
 * Estructura compartida de las páginas de login y registro (diseño de Stitch):
 * tarjeta centrada con brillo decorativo, encabezado, contenido, enlace inferior,
 * insignias de confianza y nota legal.
 * El elemento devuelto expone `alertSlot` para mostrar mensajes sobre el formulario.
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.subtitle
 * @param {Node}   props.content        Formulario de la página
 * @param {object} props.footerLink     { text, label, href } p. ej. "¿No tienes cuenta?" + "Regístrate aquí"
 * @param {string} [props.brandSubtitle] Texto bajo el logo (p. ej. "Portal de Acceso")
 * @param {string} [props.maxWidth='max-w-[510px]']
 */
export function AuthLayout({ title, subtitle, content, footerLink, brandSubtitle, maxWidth = 'max-w-[510px]' }) {
    const el = fromHTML(`
        <main class="w-full min-h-screen bg-surface flex items-center justify-center p-margin overflow-x-hidden">
            <div class="w-full ${maxWidth} flex flex-col items-center py-space-xl">
                <div class="relative w-full">
                    <div class="absolute -top-12 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
                    <div class="absolute -bottom-10 -right-8 w-60 h-60 bg-secondary-container/40 rounded-full blur-3xl pointer-events-none -z-10"></div>

                    <div class="w-full bg-surface-container-lowest rounded-2xl shadow-xl shadow-slate-900/5 p-space-lg md:p-space-xl flex flex-col">
                        <header class="flex flex-col items-center text-center mb-space-lg">
                            <div data-brand class="mb-space-md"></div>
                            <h1 data-auth-title class="font-headline text-headline-md text-on-surface tracking-tight mb-space-xs"></h1>
                            <p data-auth-subtitle class="font-body text-body-md text-on-surface-variant max-w-sm"></p>
                        </header>

                        <div data-alert aria-live="polite" class="empty:hidden mb-space-lg"></div>
                        <div data-content></div>

                        <div class="mt-space-lg bg-surface-container-low/50 -mx-space-lg md:-mx-space-xl -mb-space-lg md:-mb-space-xl p-space-md rounded-b-2xl text-center">
                            <p class="font-body text-body-md text-on-surface-variant">
                                <span data-footer-text></span>
                                <a data-footer-link class="font-semibold text-primary hover:text-primary-container underline-offset-4 hover:underline transition-colors ml-1"></a>
                            </p>
                        </div>
                    </div>
                </div>
                <div data-below class="w-full mt-space-lg"></div>
            </div>
        </main>
    `);

    el.querySelector('[data-brand]').append(Brand({ size: 'lg', subtitle: brandSubtitle }));
    setText(el, '[data-auth-title]', title);
    setText(el, '[data-auth-subtitle]', subtitle);
    el.querySelector('[data-content]').append(content);
    setText(el, '[data-footer-text]', footerLink.text);
    setText(el, '[data-footer-link]', footerLink.label).setAttribute('href', footerLink.href);
    el.querySelector('[data-below]').append(TrustBadges(), Footer());

    el.alertSlot = el.querySelector('[data-alert]');
    return el;
}
