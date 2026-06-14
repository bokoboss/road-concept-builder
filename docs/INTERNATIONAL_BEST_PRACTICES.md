# International Best Practices for Adaptation

This file records useful external practices that may inform the app. These sources are not Thai authority. Use them as reference patterns and validation suggestions only.

## 1. MUTCD, United States

Source:

- Manual on Uniform Traffic Control Devices for Streets and Highways, 11th Edition, Part 3 Markings
- URL: https://mutcd.fhwa.dot.gov/pdfs/11th_Edition/part3.pdf
- Full manual: https://mutcd.fhwa.dot.gov/pdfs/11th_Edition/mutcd11thedition.pdf
- Status: `INTERNATIONAL_BEST_PRACTICE`

Useful patterns:

- Clear taxonomy of longitudinal markings, transverse markings, crosswalk markings, word/symbol/arrow markings.
- Stop and yield lines associated with traffic control and crosswalk placement.
- Roundabout marking examples and lane-use arrows.
- Crosswalk types including transverse and high-visibility styles.

How to adapt:

- Use the taxonomy and validation logic where Thai source is not yet detailed.
- Do not copy US colors/dimensions into Thai-standard mode unless separately verified.
- Adapt to left-hand traffic.

## 2. NACTO Urban Street Design Guide / GDCI Global Street Design Guide

Sources:

- NACTO Urban Street Design Guide: https://nacto.org/publication/urban-street-design-guide/
- Pedestrian Safety Islands: https://nacto.org/publication/urban-street-design-guide/intersection-design-elements/crosswalks-and-crossings/pedestrian-safety-islands/
- Major Intersections: https://nacto.org/publication/urban-street-design-guide/intersections/major-intersections/
- Global Street Design Guide PDF source found via MobiliseYourCity: https://www.mobiliseyourcity.net/sites/default/files/2024-05/English_GSDG_LowRes_compressed%20%282%29.pdf
- Status: `INTERNATIONAL_BEST_PRACTICE`

Useful patterns:

- Complete-streets approach.
- Pedestrian refuge/safety islands where crossing exposure is high.
- Caution against high-speed channelized turns where pedestrian safety is important.
- Use of templates and visual communication for stakeholder discussion.

How to adapt:

- Use as optional design prompts/warnings for urban contexts.
- Do not treat urban design guidance as Thai legal requirement.
- Good source for UI templates such as urban intersection, crossing improvement, and safety island concepts.

## 3. Austroads

Sources:

- Austroads home/publications: https://austroads.gov.au/
- Queensland TMR Austroads publications page: https://www.tmr.qld.gov.au/business-industry/Technical-standards-publications/Austroads-publications
- Status: `INTERNATIONAL_BEST_PRACTICE`

Useful patterns:

- Road design and traffic-management practice in a left-hand traffic environment.
- Good comparator for adapting concepts to Thailand because traffic side is compatible.

How to adapt:

- Prefer Austroads over US examples where left-hand traffic geometry matters.
- Do not use as Thai standard.
- Use for design-review prompts and future geometry defaults after source verification.

## 4. UK Traffic Signs Manual

Source to collect:

- UK Traffic Signs Manual, especially road marking chapters.
- Status: `INTERNATIONAL_BEST_PRACTICE`

Useful patterns:

- Left-hand traffic context.
- Road marking and sign layout examples.

How to adapt:

- Useful for diagram patterns and left-hand traffic movement logic.
- Must not override Thai standards.

## 5. Roundabout guidance

Sources:

- MUTCD 11th Edition Part 3
- FHWA roundabout references
- Transoft TORUS product examples for marking components

Useful patterns:

- Yield lines at entries
- Splitter islands
- Circulatory arrows
- Lane-use arrows for multi-lane roundabouts
- Crosswalks near approaches
- Truck apron as optional concept component

How to adapt:

- Add warning that roundabout entries need yield-control logic.
- Add lane-use arrows for multi-lane roundabouts.
- Keep geometry schematic until detailed roundabout design guidance is verified.

## 6. How international guidance should appear in the app

The app may show warnings like:

- `Best practice: Consider a pedestrian refuge island where pedestrians cross multiple lanes.`
- `Best practice: Review pedestrian safety where a free-flow slip lane is used.`
- `Best practice: Multi-lane roundabouts should include clear lane-use guidance.`

The app must not show:

- `Required by Thai standard` unless verified from Thai source.
