# Pavement Marking System

## Purpose

Pavement marking is a core system of Road Concept Builder. It should not be treated as a late-stage decoration feature.

The product should allow users to add lane arrows, symbols, words, stop lines, give-way lines, crosswalks, warning bars, hatching, and other special markings in a simple, controlled, lane-aware way.

The desired UX reference is the ease of adding pavement markings in VISSIM, adapted to a lightweight report-oriented diagram builder.

## Core Principle

Use **smart placement** rather than freehand drawing.

Preferred workflow:

```text
Select lane / approach / road segment / area → choose marking → system places marking automatically → adjust parameters
```

Do not require users to draw every marking manually.

## Target Types

A marking can target one of these domain objects:

- `lane`
- `approach`
- `roadSegment`
- `intersectionNode`
- `uturnOpening`
- `slipLane`
- `pocketLane`
- `roundaboutEntry`
- `area`
- `customAnchor`

## Marking Categories

### 1. Linear Markings

Used along or across road geometry.

Examples:

- dashed lane line;
- solid lane line;
- double solid line;
- centerline;
- edge line;
- no-changing-lane line;
- taper guide line;
- channelizing line;
- stop line;
- give-way line.

### 2. Symbol Markings

Placed within lanes or special areas.

Examples:

- through arrow;
- left-turn arrow;
- right-turn arrow;
- through-left arrow;
- through-right arrow;
- U-turn arrow;
- merge arrow;
- diverge arrow;
- bicycle symbol;
- bus symbol.

### 3. Text Markings

Examples:

- SLOW;
- STOP;
- BUS;
- ONLY;
- KEEP CLEAR;
- speed number;
- custom text.

### 4. Area Markings

Examples:

- painted island;
- hatch marking;
- chevron marking;
- gore area;
- median hatch;
- shoulder hatch;
- no-drive area.

### 5. Transverse and Special Treatments

Examples:

- pedestrian crossing;
- transverse warning bars;
- rumble strips;
- speed hump marking;
- speed table marking;
- school-zone marking;
- bike crossing;
- bus stop bay marking;
- work-zone temporary marking.

## MVP Marking Library

The first useful marking library should include only high-value, commonly used items.

### Essential Lane Symbols

- through arrow;
- left-turn arrow;
- right-turn arrow;
- through-left arrow;
- through-right arrow;
- U-turn arrow;
- merge arrow.

### Essential Lines

- lane line;
- edge line;
- centerline;
- stop line;
- give-way line;
- taper guide line.

### Essential Transverse / Area Markings

- crosswalk;
- hatch / painted island;
- transverse warning bars;
- simple rumble strip representation.

### Essential Text

- SLOW;
- STOP;
- BUS;
- ONLY;
- custom short text.

## Placement Behavior

### Lane Arrow

When the user selects a lane and adds a lane arrow:

- place the arrow at the lane centerline;
- rotate it according to lane travel direction;
- use default offset from stop line if an approach has a stop line;
- otherwise use segment-relative offset;
- allow repeat count and spacing.

### Stop Line

When the user selects an approach and adds a stop line:

- span all inbound lanes by default;
- place upstream of crosswalk if crosswalk exists;
- otherwise place near the intersection conflict area;
- allow offset adjustment.

### Give-Way Line

When the user selects a slip lane, roundabout entry, or yield-controlled approach:

- place across the relevant lane group;
- orient perpendicular to lane travel direction;
- warn if the associated control is not yield.

### Crosswalk

When the user adds a crosswalk to an approach:

- place across pedestrian crossing path;
- avoid overlapping with central island if possible;
- allow before/after slip lane choices;
- optionally add stop line upstream.

### Transverse Warning Bars / Rumble Strips

When the user selects a road segment or approach:

- place across selected lane group or carriageway;
- allow count, spacing, start offset, and progressive spacing later;
- mark as `PROJECT_ASSUMPTION` unless verified for a specific standard context.

### Hatch / Painted Island

When the user selects an island or area:

- fill with hatch/chevron pattern;
- keep pattern clipped to area boundary;
- allow hatch angle and spacing later.

## Data Model

A marking object should be JSON-serializable.

Conceptual TypeScript shape:

```ts
type MarkingCategory =
  | 'linear'
  | 'symbol'
  | 'text'
  | 'area'
  | 'transverse'
  | 'special';

type MarkingTargetType =
  | 'lane'
  | 'approach'
  | 'roadSegment'
  | 'intersectionNode'
  | 'uturnOpening'
  | 'slipLane'
  | 'pocketLane'
  | 'roundaboutEntry'
  | 'area'
  | 'customAnchor';

type SourceStatus =
  | 'THAI_AUTHORITY'
  | 'AGENCY_MANUAL'
  | 'INTERNATIONAL_BEST_PRACTICE'
  | 'PROJECT_ASSUMPTION'
  | 'CUSTOM_CONCEPT'
  | 'TODO_VERIFY';

type MarkingObject = {
  id: string;
  category: MarkingCategory;
  subtype: string;
  targetType: MarkingTargetType;
  targetId: string;
  position?: {
    offsetMeters?: number;
    lateralOffsetMeters?: number;
  };
  repeat?: {
    count: number;
    spacingMeters: number;
  };
  dimensions?: {
    lengthMeters?: number;
    widthMeters?: number;
    scale?: number;
  };
  rotationMode: 'auto' | 'manual';
  rotationDegrees?: number;
  styleProfile: 'thai-concept' | 'international-reference' | 'custom';
  sourceStatus: SourceStatus;
};
```

## Inspector Fields

For a selected marking, show only relevant fields.

### Arrow Inspector

- subtype;
- target lane;
- position offset;
- repeat count;
- spacing;
- scale;
- rotation mode.

### Stop Line Inspector

- target approach;
- span across lane group;
- offset from crosswalk or conflict area;
- width/profile;
- source status.

### Warning Bars Inspector

- target lane group or carriageway;
- start offset;
- bar count;
- spacing;
- bar width;
- source status.

## Validation Rules for Markings

Examples:

- signalized approach should have stop line;
- yield-controlled slip lane should have give-way line;
- right-turn pocket should have lane-use arrow;
- U-turn pocket should have U-turn arrow;
- lane drop should have taper and merge/guide marking;
- crosswalk should not conflict with island geometry;
- marking target must exist;
- automatic rotation requires target geometry direction.

## Source Status Policy

Every marking default that implies a standard should include a source status.

Do not claim a marking is Thai-standard compliant unless the source has been verified.

Use `PROJECT_ASSUMPTION` for concept defaults.
Use `TODO_VERIFY` when the item should be checked against Thai manuals before becoming a standard profile.

## MVP Non-Goals

Do not implement these in the first marking system:

- freehand marking drawing;
- arbitrary SVG editing;
- complete sign/marking library;
- CAD-style layer management;
- national-standard enforcement for every dimension;
- advanced text editor;
- 3D texture markings.
