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
  pxPerMeter: 20,
  trafficSide: 'left',
  standardProfile: 'thailand-concept'
}
```

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
  configuration: 'median-opening-only' | 'uturn-pocket' | 'signalized-uturn';
  pocket?: PocketLane;
};
```

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
