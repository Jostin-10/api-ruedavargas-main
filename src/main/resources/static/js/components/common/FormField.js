import { fromHTML, setText, setAttr } from '../../utils/dom.js';

let fieldCounter = 0;

/**
 * Campo de formulario con etiqueta, icono a la izquierda y mensaje de error.
 * El elemento devuelto expone:
 *   - input: el <input> interno
 *   - value (getter)
 *   - setError(mensaje | null)
 * @param {object} props
 * @param {string} props.name       Nombre del campo (también se usa para el id)
 * @param {string} props.label
 * @param {string} [props.icon]     Icono Material Symbols
 * @param {string} [props.type='text']
 * @param {string} [props.placeholder]
 * @param {string} [props.autocomplete]
 * @param {string} [props.hint]     Texto pequeño a la derecha de la etiqueta (p. ej. "Requerido")
 * @param {string} [props.value]
 * @param {boolean} [props.required=false]
 * @param {Node}   [props.labelAction] Elemento a la derecha de la etiqueta (p. ej. un enlace)
 * @param {Node}   [props.trailing]    Elemento dentro del campo, a la derecha (p. ej. botón mostrar contraseña)
 */
export function FormField({
    name, label, icon, type = 'text', placeholder, autocomplete, hint, value,
    required = false, labelAction, trailing
} = {}) {
    const id = `field-${name}-${++fieldCounter}`;
    const el = fromHTML(`
        <div class="flex flex-col space-y-1.5">
            <div class="flex items-center justify-between gap-space-sm">
                <label class="font-label text-label-lg text-on-surface font-semibold"></label>
                <span data-hint class="font-label text-label-sm text-on-surface-variant font-normal"></span>
            </div>
            <div class="relative flex items-center group">
                <span data-icon class="material-symbols-outlined absolute left-3.5 text-on-surface-variant group-focus-within:text-primary transition-colors pointer-events-none text-xl" aria-hidden="true"></span>
                <input class="w-full h-12 pl-11 pr-4 bg-surface-container-low focus:bg-surface-container-lowest rounded-xl font-body text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-error">
            </div>
            <p data-error class="hidden items-center gap-1 font-body text-body-sm text-error" role="alert">
                <span class="material-symbols-outlined text-base" aria-hidden="true">error</span>
                <span data-error-text></span>
            </p>
        </div>
    `);

    const input = el.querySelector('input');
    const labelEl = el.querySelector('label');
    const errorEl = el.querySelector('[data-error]');
    const errorId = `${id}-error`;

    labelEl.textContent = label;
    labelEl.htmlFor = id;
    Object.assign(input, { id, name, type, required });
    setAttr(el, 'input', 'placeholder', placeholder);
    setAttr(el, 'input', 'autocomplete', autocomplete);
    if (value !== undefined) input.value = value;
    errorEl.id = errorId;

    if (icon) setText(el, '[data-icon]', icon);
    else {
        el.querySelector('[data-icon]').remove();
        input.classList.replace('pl-11', 'pl-4');
    }

    const hintEl = el.querySelector('[data-hint]');
    if (labelAction) hintEl.replaceWith(labelAction);
    else if (hint) hintEl.textContent = hint;
    else hintEl.remove();

    if (trailing) {
        input.classList.replace('pr-4', 'pr-12');
        input.parentElement.append(trailing);
    }

    el.input = input;
    Object.defineProperty(el, 'value', { get: () => input.value });

    el.setError = message => {
        const hasError = Boolean(message);
        input.setAttribute('aria-invalid', String(hasError));
        if (hasError) input.setAttribute('aria-describedby', errorId);
        else input.removeAttribute('aria-describedby');
        setText(el, '[data-error-text]', message);
        errorEl.classList.toggle('hidden', !hasError);
        errorEl.classList.toggle('flex', hasError);
    };

    // Al corregir el campo, se limpia el error
    input.addEventListener('input', () => {
        if (input.getAttribute('aria-invalid') === 'true') el.setError(null);
    });
    return el;
}
