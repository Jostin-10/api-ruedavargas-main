---
name: Rueda Vargas ERP
colors:
  surface: '#f8f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#594238'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#8c7166'
  outline-variant: '#e0c0b2'
  surface-tint: '#a23f00'
  primary: '#9e3d00'
  on-primary: '#ffffff'
  primary-container: '#c64f00'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb595'
  secondary: '#49607e'
  on-secondary: '#ffffff'
  secondary-container: '#c4dcff'
  on-secondary-container: '#49617f'
  tertiary: '#006767'
  on-tertiary: '#ffffff'
  tertiary-container: '#078282'
  on-tertiary-container: '#f3fffe'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcd'
  primary-fixed-dim: '#ffb595'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7c2e00'
  secondary-fixed: '#d2e4ff'
  secondary-fixed-dim: '#b0c8eb'
  on-secondary-fixed: '#001c37'
  on-secondary-fixed-variant: '#314865'
  tertiary-fixed: '#93f2f2'
  tertiary-fixed-dim: '#76d6d5'
  on-tertiary-fixed: '#002020'
  on-tertiary-fixed-variant: '#004f4f'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a clean, professional enterprise ERP style tailored for aquaculture and shrimp feed distribution. The brand personality is grounded, trustworthy, and efficient, combining industrial reliability with modern software ergonomics. The UI evokes confidence, precision, and operational clarity for heavy-duty supply chain management.

We utilize a **Corporate / Modern** design style, enhanced with subtle glassmorphism on floating navigation headers and structured data-dense containers. Visual hierarchy relies on high-contrast typography, crisp boundaries, and purposeful use of warm accent colors against deep oceanic structures.

## Colors

The color palette directly reflects the provided brand identity, balancing deep oceanic foundations with vibrant energetic accents:
- **Primary:** Vibrant warm orange (`#D35400`) for primary actions, critical highlights, and interactive badges.
- **Secondary:** Deep oceanic navy blue (`#0A2540`) for persistent sidebars, structural headers, and major typographic anchors.
- **Tertiary:** Teal water accents (`#008080`) for secondary states, data visualization, and informative elements.
- **Neutrals:** Clean off-white canvas backgrounds (`#F4F6F8`) paired with crisp slate grays and dark text for optimal readability in data-heavy enterprise workflows.

## Typography

The typography system uses **Plus Jakarta Sans** exclusively across all levels. Its soft, welcoming yet precise geometric construction ensures excellent legibility across dense data tables, dashboards, and mobile inventory scanning views.

- Use headline levels for structural section headers and KPI metrics.
- Use body levels for table data, inventory logs, and form inputs.
- Use label levels for table column headers, status tags, and micro-copy.

## Layout & Spacing

The layout is built upon a **fluid grid system** tailored for high-density enterprise ERP applications. 
- **Desktop:** 12-column fluid layout with 24px gutters and 32px outer canvas margins to maximize screen real estate for complex data tables and logistics dashboards.
- **Tablet:** Adapts to an 8-column layout with 16px gutters, collapsing secondary sidebars into collapsible drawers.
- **Mobile:** Single-column stacked layout with 16px outer margins, prioritizing touch targets for warehouse workers and field agents.

## Elevation & Depth

Visual hierarchy is established using **tonal layers and subtle low-contrast outlines**. 
- Backgrounds remain flat and structured (`#F4F6F8`), while interactive surfaces like cards, floating action panels, and modal dialogs use pure white surfaces with extremely soft, diffused ambient shadows (`0px 4px 12px rgba(10, 37, 64, 0.08)`).
- Persistent elements like the left sidebar use the deep oceanic navy (`#0A2540`) with subtle tonal separation rather than heavy borders.

## Shapes

The shape language uses a **Soft** roundedness profile (`0.25rem` base radius, `0.5rem` for `rounded-lg`, and `0.75rem` for `rounded-xl`). This provides a professional, approachable, and modern enterprise aesthetic without appearing overly playful, ensuring buttons, form inputs, and container cards maintain clean structural boundaries.

## Components

- **Buttons:** Primary actions utilize the vibrant warm orange (`#D35400`) with white text and a soft radius. Secondary actions use outlined or ghost styles with oceanic navy text. Destructive actions use high-contrast crimson indicators.
- **Chips & Badges:** Pill-shaped metadata indicators for inventory status (e.g., "In Stock", "Pending Delivery", "Low Feed Level") utilizing teal and orange tonal fills.
- **Tables & Lists:** High-density data grids with alternating row tints, sticky headers in deep oceanic navy (`#0A2540`), and clear numeric alignment for inventory quantities and pricing.
- **Checkboxes & Radios:** Clean square and circular selectors featuring the primary orange accent when checked.
- **Input Fields:** Outlined text fields with clear floating labels, supporting validation states for rapid data entry in supply chain forms.
- **Cards:** Container surfaces for KPI metrics, delivery manifests, and client profiles, featuring crisp structural outlines and generous internal padding.
- **Additional (ERP Specific):** Batch tracking timelines, barcode scanner overlays, and stock level progress bars.