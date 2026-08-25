# Data Model — Rebaseline v0.1

## Status

This document defines semantic boundaries for the rebaselined product. Exact field names may change during Stage R1/R2, but renderer-independent source-of-truth rules are authoritative.

The legacy Phase 2E `StraightRoadParameters` / `ProjectDocument` schema is prototype-only and must not constrain the generalized model.

## Core principles

- JSON-serializable canonical project state.
- Domain units in meters.
- Renderer-independent engineering objects.
- Generalized alignment/stationing rather than fixed horizontal road orientation.
- Component/lane lifecycle varies by station.
- Junction geometry and topology are explicit semantic data.
- Scenarios/alternatives are first-class.
- Presentation state is distinct from engineering state.
- Editor/session state is distinct from persisted engineering content.
- Standard-sensitive values/assets support provenance/version references.
- AI edits through typed commands rather than raw object mutation.

## Top-level conceptual model

```ts
type Project = {
  schemaVersion: string
  id: string
  metadata: ProjectMetadata
  coordinateReference: CoordinateReference
  standardsProfiles: StandardProfileReference[]
  scenarios: Scenario[]
  activeScenarioId?: string
  presentation?: ProjectPresentationState
}
```

`activeScenarioId` may ultimately be editor/session state rather than persisted canonical content. Final persistence split is an R2 decision.

## Scenario

```ts
type Scenario = {
  id: string
  name: string
  role: 'existing' | 'alternative'
  roadNetwork: RoadNetwork
  assets: AssetInstance[]
  annotations: Annotation[]
  presentation?: ScenarioPresentationState
}
```

A scenario is a coherent alternative, not just a visibility layer.

The internal implementation may later use structural sharing/deltas for efficiency, but that must not leak complexity into the user workflow.

## Coordinate reference

```ts
type CoordinateReference = {
  units: 'm'
  projectOrigin: Point2
  sourceCrs?: string
  sourceToProjectTransform?: unknown
}
```

Exact CRS/transform representation is deferred until map/georeference work.

The important rule is separation between source/geographic coordinates, project engineering coordinates, renderer-local coordinates, and screen coordinates.

## Road network

```ts
type RoadNetwork = {
  roads: Road[]
  junctionCandidates?: JunctionCandidate[]
  junctions: Junction[]
}
```

## Road

Conceptual structure:

```ts
type Road = {
  id: string
  name?: string
  alignment: Alignment
  components: RoadComponent[]
  markings: RoadMarking[]
  attachments: RoadAttachment[]
  metadata?: RoadMetadata
}
```

A road does not own a single fixed uniform cross section.

## Alignment

```ts
type Alignment = {
  id: string
  primitives: AlignmentPrimitive[]
}

type AlignmentPrimitive =
  | LinePrimitive
  | CircularArcPrimitive
  | CubicCurvePrimitive
```

R1 minimum operations:

```text
length()
pointAt(s)
tangentAt(s)
normalAt(s)
curvatureAt(s)
projectPoint(point) -> { station, lateralOffset }
sampleAdaptive(tolerance)
```

Later primitive types may include clothoid/spiral and vertical profile, but they are not required to prove R1.

## Road components

Use semantic ordered components.

```ts
type RoadComponent = {
  id: string
  type: RoadComponentType
  side: 'left' | 'right' | 'center'
  order: number
  lifecycle: StationInterval
  widthProfile: WidthProfile
  travelDirection?: TravelDirection
  movement?: LaneMovement[]
  properties?: Record<string, unknown>
}
```

Candidate component types:

```ts
type RoadComponentType =
  | 'traffic-lane'
  | 'median'
  | 'shoulder'
  | 'sidewalk'
  | 'verge'
  | 'bike-lane'
  | 'parking-lane'
  | 'transit-lane'
  | 'barrier'
```

Type list is extensible and not fully frozen by R1.

## Station interval

```ts
type StationInterval = {
  start: number
  end: number
}
```

Requirements:
- finite;
- start <= end;
- constrained to the parent alignment domain unless intentionally extended by a later model.

## Width profile

R1 recommended baseline:

```ts
type WidthProfile = {
  interpolation: 'linear'
  points: Array<{
    station: number
    widthMeters: number
  }>
}
```

This supports:
- constant width;
- widening/narrowing;
- zero-to-full taper;
- full-to-zero taper;
- lane add/drop;
- turn pocket;
- median transition.

Do not require polynomial width functions before evidence demonstrates a need.

## Travel direction

Do not use permanent eastbound/westbound domain types.

Conceptual options may include:

```ts
type TravelDirection = 'with-reference' | 'against-reference' | 'none'
```

The final relationship between component side, alignment direction, LHT/RHT profile, and travel direction must be made explicit and regression-tested.

## Lane movement

```ts
type LaneMovement =
  | 'through'
  | 'left'
  | 'right'
  | 'uturn'
  | 'merge'
  | 'diverge'
  | 'bus'
  | 'bike'
  | 'parking'
```

Combined movement sets should generally be represented as arrays/sets rather than a rapidly growing string union such as `through-right-left`.

## Turn pocket / auxiliary lane

Do not define the geometry source as a unique detached `TurnPocketPolygon`.

Represent it primarily through a traffic-lane component lifecycle/width profile plus semantics/attachment:

```text
Lane R1-L-turn
lifecycle       [s0, s3]
width profile   0 -> 3.0 -> 3.0
movement        right
anchor/context  junction/access A
```

A higher-level `TurnPocketFeature` may exist to preserve user intent and parameterization (`taper`, `storage`, `movement`) while deriving the component profile. It must not create a second geometry truth.

## Junction candidate

```ts
type JunctionCandidate = {
  id: string
  roadIds: string[]
  location: Point2
  status: 'candidate' | 'ignored' | 'grade-separated' | 'connected'
}
```

Exact persistence of transient candidate state is an R2 decision.

Critical rule: geometric crossing alone does not imply connected topology.

## Junction

```ts
type Junction = {
  id: string
  roadIds: string[]
  approaches: JunctionApproach[]
  corners: JunctionCorner[]
  laneConnections: LaneConnection[]
  islands: JunctionIsland[]
  crossings: Crossing[]
  controls: TrafficControlRef[]
}
```

### Approach

```ts
type JunctionApproach = {
  id: string
  roadId: string
  cutStation: number
  headingRadians: number
  incomingComponentIds: string[]
  outgoingComponentIds: string[]
}
```

### Corner

```ts
type JunctionCorner = {
  id: string
  betweenApproachIds: [string, string]
  mode: 'circular' | 'custom'
  radiusMeters?: number
  customGeometry?: unknown
}
```

Per-corner geometry is independent.

### Lane connection

```ts
type LaneConnection = {
  id: string
  fromLaneId: string
  toLaneId: string
  movement: LaneMovement
  pathModel?: ConnectionPathModel
}
```

The connection path is conceptual visualization/topology support, not automatic swept-path feasibility.

## Markings

Engineering markings should prefer semantic attachment.

```ts
type RoadMarking = {
  id: string
  kind: string
  attachment: MarkingAttachment
  parameters: Record<string, unknown>
  standardRef?: StandardReference
  sourceStatus: SourceStatus
}
```

Conceptual attachment types:
- road + station/lateral offset;
- lane + station;
- approach;
- junction/corner;
- path;
- area/polygon;
- explicit free world coordinates as override.

Do not make free x/y screen placement the only model.

## Assets

```ts
type AssetInstance = {
  id: string
  assetId: string
  attachment: AssetAttachment
  transformOverrides?: AssetTransformOverrides
  presentation?: AssetPresentationOverrides
}
```

The reusable library definition is separate from the placed instance.

Asset attachment may use:
- point/world;
- road station/lateral;
- lane station;
- edge/path;
- junction reference;
- area distribution.

## Asset library definition

See `docs/ASSET_SYSTEM_V0_1.md`.

A semantic asset may reference:
- 2D vector representation;
- 3D GLB/glTF representation;
- physical dimensions;
- source/author/license metadata;
- standards reference.

## Standards provenance

```ts
type StandardReference = {
  authority: string
  document: string
  edition?: string
  effectiveDate?: string
  section?: string
  table?: string
  figure?: string
  applicability?: string
}
```

```ts
type SourceStatus =
  | 'THAI_AUTHORITY'
  | 'AGENCY_MANUAL'
  | 'INTERNATIONAL_BEST_PRACTICE'
  | 'PROJECT_ASSUMPTION'
  | 'CUSTOM_CONCEPT'
  | 'TODO_VERIFY'
```

Existing source statuses may evolve, but provenance must become richer rather than disappear.

## Validation issue

```ts
type ValidationIssue = {
  id: string
  severity: 'info' | 'warning' | 'error'
  category: 'geometry' | 'topology' | 'standards' | 'asset' | 'project'
  ruleId: string
  message: string
  targetId?: string
  standardRef?: StandardReference
  overridable?: boolean
}
```

Geometry impossibility/internal inconsistency may block an operation. Standards/advisory rules are normally overridable.

## Presentation state

Examples:
- visibility presets;
- material/style mode;
- saved camera views;
- labels/annotation styling;
- Engineering vs Presentation display mode.

Presentation state must not alter road engineering geometry.

## Editor/session state

Examples:
- selected object;
- hovered object;
- active tool;
- open panel;
- 2D pan/zoom;
- 3D camera;
- transient drag preview;
- unsaved command proposal.

Do not make these canonical engineering content merely because React currently stores them with the project.

## Command model

Conceptual typed command examples:

```text
CreateRoadCommand
MoveAlignmentControlPointCommand
ChangeComponentWidthCommand
AddTurnPocketCommand
CreateJunctionCommand
SetCornerRadiusCommand
AddMarkingCommand
PlaceAssetCommand
```

A command should:
- validate input;
- produce preview/change information when appropriate;
- apply deterministically;
- be undoable as one conceptual transaction;
- mark dependent geometry/validation dirty.

Manual UI and future AI use the same command path.

## Serialization/migration

Requirements once production schema is frozen:
- explicit schema version;
- strict/defensive parsing;
- migration functions between supported versions;
- no DOM/functions/renderer objects in canonical project files;
- unknown/unsupported schema versions fail clearly rather than silently mutating data.

The Phase 2E JSON format does not require indefinite backward compatibility. A one-time migration may be omitted if no valuable user data depends on it.

## R1 boundary

R1 needs only enough of this model to prove:
- alignment/stationing;
- ordered components;
- width/lifecycle profiles;
- generic turn pocket;
- candidate/connected junction;
- lane connectivity;
- shared 2D/3D derived geometry;
- deterministic fixtures/tests.

Do not implement the entire production schema merely because it is described conceptually here.