# Market Benchmarks

This file summarizes useful patterns from existing tools. The goal is not to copy them, but to learn what makes them useful.

## 1. Streetmix

Source:

- https://streetmix.net/
- https://github.com/streetmix/streetmix

What it does well:

- Very fast street cross-section creation.
- Easy drag-and-drop mental model.
- Friendly, understandable UI for non-CAD users.
- Good for communication and stakeholder discussion.
- Web-based and lightweight.

What it does not solve for this project:

- Primarily cross-section, not Thai plan-view intersection marking.
- Not focused on Thai road markings, U-turns, slip lanes, or TIA diagrams.

What to borrow:

- Template-first workflow.
- Immediate live preview.
- Simple controls.
- Export/share mindset.
- Avoid CAD-like complexity.

## 2. StreetPlan / Complete Streets cross-section tools

Source:

- https://www.urbaninnovators.com/streetplan

What it does well:

- Drag-and-drop complete street cross-sections.
- Red/yellow/green best-practice guidance.
- NACTO-based templates.
- Simple public-facing workflow.

What to borrow:

- Validation guidance with color-coded status.
- Start from templates.
- Make best-practice feedback visible but not obstructive.

## 3. Remix Streets

Source:

- https://ridewithvia.com/solutions/remix/streets

What it does well:

- Supports street redesign in cross-section and plan view.
- Works at segment/network level.
- Designed for discussion in meetings and public engagement.

What to borrow:

- Plan-view street redesign workflow.
- Segment-level editing.
- Visual clarity for stakeholders.

What to avoid for MVP:

- Network-scale planning complexity.
- Collaboration/account platform complexity.

## 4. Transoft TrafxPLAN / GuideSIGN / KeyLINES-like marking tools

Sources:

- https://www.transoftsolutions.com/
- https://www.transoftsolutions.com/uk/civil-and-transportation/software/signage-marking/trafxplan-lines/

What they do well:

- Professional road marking and sign design.
- Dedicated components for lane lines, arrows, pedestrian crossings, bus/cycle lanes, and marking plans.
- Integration with CAD workflows.

What to borrow:

- Road marking component library.
- Reusable symbols for arrows, crosswalks, lane lines.
- Reporting/export mindset.

What to avoid for MVP:

- CAD dependency.
- Too many detailed drafting options.
- Complex licensing/workflow assumptions.

## 5. Transoft TORUS Roundabouts

Source:

- https://www.transoftsolutions.com/civil-and-transportation/software/road-and-intersection-design/torus-roundabouts/
- https://www.transoftsolutions.com/news/torus-2025-sets-a-new-standard-in-roundabout-design/

What it does well:

- Specialized roundabout design workflow.
- Roundabout-specific pavement markings: arrows, yield lines, dotted entrance lines, lane-use arrows.
- User-friendly refinements for safer roundabout design.

What to borrow:

- Treat roundabout as a special module, not a generic intersection.
- Include yield lines and lane-use arrows as first-class roundabout components.
- Provide roundabout templates.

What to avoid for MVP:

- Detailed roundabout design/calculation engine before road/intersection basics are stable.

## 6. CGS Labs Autosign

Sources:

- https://cgs-labs.com/autosign/
- https://procadsystems.com/en/products/autosign
- https://cgs-labs.zendesk.com/hc/en-us/articles/360059774713-Autosign-Libraries-Library-manager

What it does well:

- Traffic sign and road marking libraries.
- Country-specific libraries and customizable libraries.
- 2D/3D/BIM/CAD environment support.
- Reports and quantity/export functions.

What to borrow:

- Library-based traffic signs and road markings.
- Customizable country/profile approach.
- Future ability to report placed components.

What to avoid for MVP:

- BIM and 3D complexity.
- Full sign-structure design.
- CAD plugin dependency.

## 7. Product positioning

Road Concept Builder should occupy the gap between:

- Simple public-facing street tools like Streetmix, and
- Heavy professional CAD/signing/marking tools like Autosign or Transoft products.

Target position:

> A Thai-oriented, fast, clean, parametric plan-view road concept diagram generator for traffic engineering reports and presentations.

## 8. Features to emulate

| Feature | Inspiration | Priority |
|---|---|---:|
| Template-first start | Streetmix / StreetPlan | High |
| Live preview | Streetmix / Remix | High |
| Component library | Autosign / Transoft | High |
| Road marking symbols | Transoft / Autosign | High |
| Validation warnings | StreetPlan / engineering tools | High |
| SVG/PNG export | General diagram tools | High |
| Plan-view road/intersection layout | Remix / CAD tools | High |
| Roundabout-specific module | TORUS | Medium |
| Country/profile standards | Autosign | Medium |
| Reports/quantity schedules | Autosign | Low |
| 3D visualization | Autosign / CAD | Later |
| Network planning | Remix | Later |

## 9. Features to avoid early

- Full freehand drawing app
- Full CAD clone
- User accounts
- Real-time collaboration
- 3D/BIM
- Vehicle swept path
- Signal optimization
- GIS network editing
- Detailed quantity takeoff

These can be considered only after the core diagram workflow is useful.
