# Product Boundary and Scope

## One-Sentence Definition

Road Concept Builder is a lightweight 2D plan-view road concept diagram builder for traffic engineering reports and presentations.

## Primary Use Cases

The app should help traffic engineers quickly create clean concept diagrams for:

- straight road sections;
- lane additions and lane drops;
- median openings and U-turn pockets;
- T-intersections and four-leg intersections;
- left-turn and right-turn pocket lanes;
- free-left slip lanes and channelizing islands;
- roundabouts;
- project access layouts such as full access and left-in/left-out;
- pavement markings and symbols used in concept drawings;
- before/after road improvement presentation graphics.

## Intended Output Quality

The output should be suitable for:

- traffic impact assessment reports;
- public agency presentations;
- internal engineering discussion;
- early-stage concept alternatives;
- PowerPoint slides;
- Word/PDF report graphics.

The output should not be represented as a construction drawing or detailed design drawing.

## What This Product Is Not

The product is not:

- AutoCAD;
- Civil 3D;
- VISSIM;
- a road design package;
- a construction drawing tool;
- a traffic simulation model;
- a swept-path design tool;
- a signal timing package;
- a standards compliance certification tool;
- an AI-generated image tool.

## Accuracy Policy

The app uses **engineering-informed schematic geometry**.

It may support approximate engineering scale using lane width, shoulder width, median width, storage length, and taper length as inputs.

However:

- it does not replace detailed design checking;
- it does not guarantee every dimension complies with Thai standards;
- it should clearly mark unverified defaults as assumptions;
- validation warnings are advisory unless the geometry is internally impossible.

## Negative Scope for MVP

Do not include in MVP:

- login/authentication;
- database;
- cloud sync;
- multi-user collaboration;
- AI prompt-to-diagram;
- 3D visualization;
- simulation;
- traffic volume or LOS calculation;
- signal optimization;
- swept-path analysis;
- DXF/DWG export;
- mobile-first UX;
- complete sign library;
- complete pavement marking standard library;
- full freehand drawing;
- CAD-level snapping and layers.

## Product Success Criteria

The first meaningful version succeeds if a user can create a clean 4-lane divided road concept diagram with lane arrows, median, shoulders, and basic pavement markings in under 60 seconds, then export it to SVG/PNG.
