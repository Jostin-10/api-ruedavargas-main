/**
 * Utilidades DOM para los componentes.
 * Las plantillas solo contienen estructura y clases fijas; los datos se
 * insertan después con setText/setAttr para evitar inyección de HTML.
 */

/** Crea un elemento a partir de una plantilla HTML con un único nodo raíz. */
export function fromHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
}

/** Asigna texto al primer elemento que coincide con el selector (dentro de root). */
export function setText(root, selector, text) {
    const el = root.querySelector(selector);
    if (el) el.textContent = text ?? '';
    return el;
}

export function setAttr(root, selector, name, value) {
    const el = root.querySelector(selector);
    if (el && value !== undefined && value !== null) el.setAttribute(name, value);
    return el;
}

/** Crea el span de un icono de Material Symbols. */
export function icon(name, className = '', filled = false) {
    const span = document.createElement('span');
    span.className = `material-symbols-outlined ${filled ? 'icon-filled ' : ''}${className}`.trim();
    span.setAttribute('aria-hidden', 'true');
    span.textContent = name;
    return span;
}

/** Reemplaza el contenido de un contenedor por los elementos dados. */
export function mount(container, ...children) {
    container.replaceChildren(...children.filter(Boolean));
    return container;
}
