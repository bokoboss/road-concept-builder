# Export and Project File Strategy

## Purpose

Road Concept Builder must produce diagrams that can be used in reports and presentations, and it must eventually allow users to reopen and edit earlier diagrams.

## Primary Export Formats

### MVP

- SVG
- PNG

### Later

- transparent PNG;
- copy image to clipboard;
- PDF export;
- PowerPoint-friendly export;
- bundled project JSON.

### Out of Scope for MVP

- DXF;
- DWG;
- GIS formats;
- Civil 3D corridors;
- VISSIM network export;
- CAD layer mapping.

## SVG Export Requirements

SVG should be the first-class output.

SVG export should:

- preserve vector quality;
- keep geometry crisp;
- support report/presentation use;
- be inspectable during development;
- avoid raster textures in MVP.

## PNG Export Requirements

PNG export should eventually support:

- fixed width presets such as 1920 px and 3000 px;
- transparent background;
- white background;
- title/label visibility options;
- presentation-safe margins.

PNG can be implemented after SVG export works reliably.

## Project File Strategy

The project state should be JSON-serializable from the beginning, even if file open/save UI is implemented later.

A project JSON should eventually include:

- metadata;
- drawing settings;
- road links;
- intersections;
- roundabouts;
- U-turn openings;
- pavement markings;
- annotations;
- validation settings;
- source status for standard-dependent defaults.

Example conceptual structure:

```json
{
  "version": "0.1.0",
  "drawingSettings": {
    "trafficSide": "left",
    "units": "m",
    "pxPerMeter": 20,
    "standardProfile": "thailand-concept"
  },
  "elements": [],
  "markings": [],
  "annotations": []
}
```

## Save/Load Scope

Do not build a full file management system in Phase 0.

Recommended order:

1. keep internal state JSON-serializable;
2. add export SVG;
3. add export PNG;
4. add download project JSON;
5. add load project JSON;
6. consider browser local storage;
7. consider cloud sync only if there is a real need.

## Export UX

The export panel should be simple:

```text
Export
- SVG
- PNG
- Options:
  [ ] Show title
  [ ] Show labels
  [ ] Show validation notes
  [ ] Transparent background
```

Do not expose too many export settings in MVP.
