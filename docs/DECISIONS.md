# Decisions Log

## Decision 001 — Use SVG First

Use SVG as the primary rendering and export format.

Reason: SVG is crisp, inspectable, report-friendly, and suitable for parametric diagrams.

## Decision 002 — Concept Diagram, Not Construction Drawing

The product creates engineering-informed schematic diagrams, not construction drawings.

Reason: This keeps the product lightweight and avoids false precision.

## Decision 003 — Thailand / Left-Hand Traffic Default

Default traffic side is left-hand traffic and default context is Thailand.

Reason: Primary use case is Thai traffic engineering reports and presentations.

## Decision 004 — Template-First Workflow

Users start from templates/presets, not a blank CAD canvas.

Reason: Faster workflow and better control over traffic logic.

## Decision 005 — Three-Panel UI

Use left palette, center SVG canvas, right inspector/validation panel.

Reason: This supports template selection, live preview, and parameter editing without clutter.

## Decision 006 — Pavement Marking Is Core

Pavement marking is a core system and should be designed early.

Reason: The value of the product depends heavily on lane arrows, stop lines, crosswalks, U-turn arrows, warning bars, and other markings.

## Decision 007 — Smart Placement Before Freehand Editing

Markings should be placed by lane/approach/area targeting before freehand drawing.

Reason: This keeps the product simple, fast, and traffic-aware.

## Decision 008 — Advisory Validation

Validation warnings are advisory and non-blocking unless geometry is impossible.

Reason: Concept drawings need flexibility while still guiding the user.

## Decision 009 — JSON-Serializable Project State

Project data should be JSON-serializable from the beginning.

Reason: Future save/load and project sharing should be possible without rewriting the architecture.

## Decision 010 — Phase 0 Before Geometry

Start with a static UI shell and static SVG preview before implementing the geometry engine.

Reason: UX is critical for this product, and a visually wrong app will be hard to recover later.

## Decision 011 — No Backend in MVP

No login, database, cloud sync, or backend in MVP.

Reason: These features do not help validate the core product.

## Decision 012 — No CAD Export in MVP

No DXF/DWG export in MVP.

Reason: CAD export would drive over-engineering before the core UI and geometry are proven.
