/** Formatos de presentación compartidos por los componentes del dashboard. */

/** "2026-10-05T12:30:00" → "octubre de 2026". Devuelve null si la fecha no es válida. */
export function formatMemberSince(isoDate) {
    if (!isoDate) return null;
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString('es', { month: 'long', year: 'numeric' });
}

/** 2450 → "2.450" */
export function formatPoints(points) {
    return Number(points ?? 0).toLocaleString('es-AR');
}
