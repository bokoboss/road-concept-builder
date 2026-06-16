# Component Catalog

## Purpose

This catalog lists the road concept components the app should eventually support. It is not a requirement to implement everything in the MVP.

## Roadway Components

### Road Segment

- straight road;
- one-way road;
- two-way road;
- lane count by direction;
- shoulders;
- curbs;
- parking lane;
- bus lane;
- bike lane;
- median;
- edge lines;
- lane lines.

### Median

- none;
- painted median;
- raised median;
- barrier median;
- median opening.

### Lane Transition

- lane addition;
- lane drop;
- merge;
- diverge;
- taper;
- guide marking.

### U-turn

- median opening only;
- U-turn pocket;
- signalized U-turn placeholder;
- U-turn arrow;
- storage length;
- taper length.

## Intersection Components

### Intersection Types

- T-intersection;
- four-leg intersection;
- skewed intersection later;
- staggered intersection later.

### Approach

- inbound lanes;
- outbound lanes;
- lane movement assignment;
- approach control;
- stop line;
- crosswalk;
- lane-use arrows.

### Control

- uncontrolled;
- signalized;
- stop-controlled;
- yield-controlled.

### Auxiliary Lanes

- left-turn pocket;
- right-turn pocket;
- U-turn pocket;
- deceleration lane;
- acceleration lane;
- storage lane.

### Channelization

- free-left slip lane;
- channelizing island;
- splitter island;
- painted island;
- raised island;
- merge area.

## Roundabout Components

- central island;
- truck apron placeholder;
- circulatory lane;
- entry lane;
- exit lane;
- splitter island;
- yield line;
- circulating arrows;
- crosswalk.

## Access Management Components

- driveway;
- full access;
- left-in/left-out;
- right-in/right-out;
- median opening access;
- site entrance;
- gate queue storage placeholder;
- drop-off loop placeholder.

## Pavement Marking Components

Pavement markings are first-class components.

### Linear Markings

- lane line;
- edge line;
- centerline;
- solid line;
- dashed line;
- double solid line;
- no-changing-lane line;
- taper guide line;
- channelizing line;
- stop line;
- give-way line.

### Symbol Markings

- through arrow;
- left-turn arrow;
- right-turn arrow;
- through-left arrow;
- through-right arrow;
- U-turn arrow;
- merge arrow;
- diverge arrow;
- bus symbol;
- bicycle symbol.

### Text Markings

- SLOW;
- STOP;
- BUS;
- ONLY;
- KEEP CLEAR;
- speed number;
- custom text.

### Area Markings

- painted island;
- hatch marking;
- chevron marking;
- gore area;
- median hatch;
- shoulder hatch;
- no-drive area.

### Transverse and Special Markings

- pedestrian crossing;
- transverse warning bars;
- rumble strip representation;
- speed hump marking;
- speed table marking;
- bike crossing;
- bus stop bay marking;
- school zone marking;
- temporary work-zone marking later.

## Annotation Components

- road name label;
- approach label;
- lane count label;
- movement label;
- dimension label;
- callout arrow;
- north arrow;
- legend;
- title block.

Annotation is important for reports but should be phased after core diagram generation.

## MVP Component Subset

Phase 0:

- static road segment;
- static lane arrows;
- static stop line;
- static warning bars;
- static validation messages.

Phase 1:

- parametric road segment;
- lane lines;
- edge lines;
- median;
- direction arrows.

Real SVG export remains disabled and out of scope for Phase 1 and Phase 2A. Export is a later feature.

Phase 2:

- U-turn opening;
- U-turn arrow;

Phase 2B:

- U-turn pocket;
- warning bars;
- taper;
- storage length.
