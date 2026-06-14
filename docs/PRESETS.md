# Presets

## Purpose

Presets help users start from real-world situations instead of a blank canvas.

The product should be template-first.

## Phase 0 Static Presets

These are shown as UI cards only in Phase 0:

- 2-lane undivided road;
- 4-lane divided road;
- U-turn opening;
- T-intersection;
- four-leg intersection;
- free-left slip lane;
- roundabout;
- project access.

## Phase 1 Functional Presets

Implement only these first:

### 2-lane Undivided Road

- forward lanes: 1;
- opposing lanes: 1;
- median: none;
- shoulders: optional;
- centerline/direction separator;
- through arrows optional.

### 4-lane Divided Road

- forward lanes: 2;
- opposing lanes: 2;
- median: raised or painted;
- shoulders: optional;
- lane lines;
- edge lines;
- through arrows optional.

### 6-lane Divided Road

- forward lanes: 3;
- opposing lanes: 3;
- median: raised or painted;
- lane lines;
- edge lines;
- through arrows optional.

## Phase 2 Presets

### Median Opening Only

- divided road required;
- median opening;
- optional U-turn arrow;
- optional warning bars.

### U-turn Pocket

- divided road required;
- U-turn pocket;
- storage length;
- taper length;
- U-turn arrow;
- warning if no arrow.

## Phase 3 Presets

### Basic T-intersection

- three approaches;
- approach-based lane configuration;
- lane-use arrows;
- optional stop line/crosswalk.

### Basic Four-leg Intersection

- four approaches;
- approach-based lane configuration;
- stop line;
- crosswalk;
- signalized/no-signal mode.

## Phase 4+ Presets

- right-turn pocket intersection;
- left-turn pocket intersection;
- free-left slip lane;
- channelized island;
- left-in/left-out access;
- full access driveway;
- single-lane roundabout;
- bus stop bay;
- speed reduction treatment.

## Preset UX

Each preset card should include:

- compact icon/thumbnail;
- name;
- short description;
- common use case;
- create button.

Do not expose all detailed parameters on the preset card.
Use the right inspector after creation.
