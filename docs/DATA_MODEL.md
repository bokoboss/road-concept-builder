# Data Model

## Purpose

The data model must support parametric road concept diagrams, smart pavement marking placement, validation, and future JSON project save/load.

The model should not be tied directly to React components.

## Principles

- Use TypeScript domain objects.
- Keep domain units in meters.
- Keep project state JSON-serializable.
- Separate domain model, geometry, rendering, validation, and UI state.
- Model intersections by approach, not by visual drawing alone.
- Model markings as objects targeted to lanes, approaches, segments, or areas.

## Core Types

### Project

```ts
type RoadConceptProject = {
  version: string;
  metadata: ProjectMetadata;
  drawingSettings: DrawingSettings;
  elements: RoadElement[];
  markings: MarkingObject[];
  annotations: AnnotationObject[];
};
```

### Drawing Settings

```ts
type DrawingSettings = {
  units: 'm';
  pxPerMeter: number;
  segmentLengthMeters: number;
  maxLaneCountPerDirection: number;
  trafficSide: 'left' | 'right';
  standardProfile: 'thailand-concept' | 'custom';
  showGrid?: boolean;
  showLabels?: boolean;
};
```

Default:

```ts
{
  units: 'm',
  pxPerMeter: 18,
  segmentLengthMeters: 42,
  maxLaneCountPerDirection: 8,
  trafficSide: 'left',
  standardProfile: 'thailand-concept'
}
```

The current Phase 1 implementation uses a minimal fixed drawing-settings object for preview scale, segment length, and bounded lane generation. It sanitizes invalid settings to safe defaults, applies an absolute geometry cap of 16 lanes per direction, and clamps the straight-road SVG preview extent to 500 m. The 500 m value is only a Phase 1 straight-road preview/rendering safeguard. It is not a Thai standard, a road-design limit, or a future intersection limit. Future intersection modules should define their own preview extent settings, such as `approachLengthMeters`. Phase 1 does not expose a drawing-settings UI.

### Road Elements

```ts
type RoadElement =
  | RoadSegment
  | IntersectionNode
  | UturnOpening
  | RoundaboutNode
  | AccessNode
  | AreaObject;
```

## Road Segment

```ts
type RoadSegment = {
  id: string;
  type: 'roadSegment';
  lengthMeters: number;
  alignment: SegmentAlignment;
  lanes: Lane[];
  median?: Median;
  shoulders?: Shoulder[];
};
```

### Lane

```ts
type Lane = {
  id: string;
  parentId: string;
  direction: 'forward' | 'opposing';
  orderFromLeft: number;
  widthMeters: number;
  movement?: LaneMovement;
};
```

### Lane Movement

```ts
type LaneMovement =
  | 'through'
  | 'left'
  | 'right'
  | 'through-left'
  | 'through-right'
  | 'left-uturn'
  | 'right-uturn'
  | 'uturn'
  | 'merge'
  | 'diverge'
  | 'bus'
  | 'bike'
  | 'parking';
```

### Median

```ts
type Median = {
  type: 'none' | 'painted' | 'raised' | 'barrier';
  widthMeters: number;
};
```

### Shoulder

```ts
type Shoulder = {
  side: 'left' | 'right';
  widthMeters: number;
  type: 'shoulder' | 'curb' | 'parking' | 'none';
};
```

## U-turn Opening

```ts
type UturnOpening = {
  id: string;
  type: 'uturnOpening';
  roadSegmentId: string;
  positionMeters: number;
  openingWidthMeters: number;
  direction: 'eastbound-to-westbound' | 'westbound-to-eastbound';
  showArrow: boolean;
  pocket?: UturnPocket;
  configuration: 'median-opening-only' | 'median-opening-with-pocket';
};
```

```ts
type UturnPocket = {
  enabled: boolean;
  storageLengthMeters: number;
  taperLengthMeters: number;
  showArrow: boolean;
};
```

The current Phase 2B implementation stores one nested `UTurnParameters` object on the straight-road parameters, with a nested `UTurnPocketParameters` object for the optional pocket. `positionMeters` is the opening center measured from the segment's left/west edge. The Phase 2B pocket uses the main `laneWidthMeters` value as its pocket width; no separate pocket-width control is exposed. Warning bars, signalized U-turns, and a general auxiliary-lane framework are deferred.

## Intersection Node

Intersections must be modeled by approach.

```ts
type IntersectionNode = {
  id: string;
  type: 'intersection';
  intersectionType: 't' | 'cross' | 'skewed';
  controlType: 'uncontrolled' | 'signalized' | 'stop' | 'yield';
  approaches: Approach[];
};
```

### Approach

```ts
type Approach = {
  id: string;
  name: 'north' | 'east' | 'south' | 'west' | string;
  angleDegrees: number;
  inboundLanes: Lane[];
  outboundLanes: Lane[];
  pocketLanes?: PocketLane[];
  slipLane?: SlipLane;
  crosswalk?: Crosswalk;
  control?: ApproachControl;
};
```

### Pocket Lane

```ts
type PocketLane = {
  id: string;
  movement: 'left' | 'right' | 'uturn';
  side: 'curb' | 'median';
  storageLengthMeters: number;
  taperLengthMeters: number;
  laneWidthMeters: number;
};
```

### Slip Lane

```ts
type SlipLane = {
  id: string;
  movement: 'left';
  control: 'free-flow' | 'yield' | 'signalized';
  laneCount: number;
  islandType: 'painted' | 'raised';
  pedestrianCrossing: 'before-slip' | 'after-slip' | 'none';
  mergeType: 'direct-exit' | 'merge' | 'acceleration-lane';
};
```

## Pavement Marking Object

See `PAVEMENT_MARKING_SYSTEM.md` for detailed marking behavior.

```ts
type MarkingObject = {
  id: string;
  category: MarkingCategory;
  subtype: string;
  targetType: MarkingTargetType;
  targetId: string;
  position?: MarkingPosition;
  repeat?: MarkingRepeat;
  dimensions?: MarkingDimensions;
  rotationMode: 'auto' | 'manual';
  rotationDegrees?: number;
  styleProfile: 'thai-concept' | 'international-reference' | 'custom';
  sourceStatus: SourceStatus;
};
```

## Annotation Object

Annotations are useful for reports but should not dominate MVP.

```ts
type AnnotationObject = {
  id: string;
  type: 'label' | 'dimension' | 'callout' | 'northArrow' | 'legend';
  text?: string;
  targetId?: string;
  position: { xMeters: number; yMeters: number };
};
```

## Validation Warning

```ts
type ValidationIssue = {
  id: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  targetId?: string;
  ruleId: string;
};
```

## Serialization Requirement

All domain objects should be serializable to JSON without requiring DOM objects, functions, canvas state, or React component references.
