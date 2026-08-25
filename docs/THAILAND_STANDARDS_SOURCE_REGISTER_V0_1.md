# Thailand Standards Source Register v0.1

## Purpose

Establish a controlled source hierarchy for Thailand-specific road markings, signs, traffic-control devices, lighting, safety devices, and later engineering advisory rules.

This register deliberately **does not encode design values yet** unless applicability, edition, and authority have been verified for the intended road context.

## Source policy

For each future rule/asset, record:
- authority/agency;
- document title;
- document edition/date if known;
- current hosting/source URL;
- applicable road class/context;
- section/table/figure used;
- whether the source is authoritative, agency guidance, procurement specification, best practice, or project assumption;
- supersession/current-status check date.

Do not infer that a recently uploaded PDF is a newly issued edition. Distinguish **website publication/upload date** from the document's own edition date.

## Authority hierarchy

### Department of Highways (DOH)

The DOH Bureau of Highway Safety has a formal role in developing standards for traffic signs/signals and traffic-control/safety devices, while the Bureau of Standards and Evaluation develops road-engineering standards/specifications.

Official organization references:
- https://www.doh.go.th/org-structure
- https://www.doh.go.th/org-structure/48

Use DOH sources as primary references for national-highway-oriented profiles where applicable.

### Department of Rural Roads (DRR)

Use DRR manuals/knowledge resources for rural-road/local-road contexts where applicable.

Official domain:
- https://drr.go.th/
- DRR knowledge resources under `localkc.drr.go.th`.

Do not apply DOH and DRR dimensions interchangeably without checking context.

## Registered source families

### TH-DOH-SIGN-001 — Manual Volume 1: Traffic Sign Standards

Authority:
- Department of Highways.

Title:
- `คู่มือมาตรฐานป้ายจราจร` (Manual Volume 1).

Document context:
- The manual set is associated with the March 2018 / พ.ศ. 2561 DOH sign-manual program.
- A current DOH-hosted copy is available through the DOH content download system.

Official/current hosting references:
- https://www.doh.go.th/content/download/174663
- historical official PDF path: https://doh.go.th/uploads/tinymce/service/bid/doc_bid/manual1.pdf
- DOH knowledge index also lists the 2561 sign manual.

Coverage described by the manual:
- general sign principles;
- regulatory signs;
- warning signs;
- guide signs;
- special/high-standard highway guidance;
- lane-specific signs;
- information/service signs;
- tourism/destination signs;
- sign shape/color/size/text/symbol principles.

Planned product use:
- sign-face taxonomy;
- sign code/name/shape/color metadata;
- 2D vector sign templates;
- 3D sign-face textures/vector rendering;
- advisory sign selection/profile metadata.

Status:
- `PRIMARY_SOURCE_CANDIDATE`.

Required before encoding dimensions:
- verify internal edition/date from the document itself;
- determine whether any later DOH amendment/superseding manual applies;
- record exact section/figure/table for each sign asset/rule.

### TH-DOH-SIGN-002 — Manual Volume 2: Sign Design and Installation

Authority:
- Department of Highways.

Title:
- `คู่มือมาตรฐานการออกแบบและติดตั้งป้ายจราจร` (Manual Volume 2).

Official/current hosting reference:
- https://www.doh.go.th/content/download/174664

Coverage described by DOH:
- sign installation principles;
- sign categories at intersections;
- destination/control-point designation;
- sign arrangement at at-grade and grade-separated intersections.

Planned product use:
- semantic sign-placement guidance;
- intersection sign assemblies;
- lateral/vertical/station-offset advisory rules later;
- sign grouping/sequence concepts.

Status:
- `PRIMARY_SOURCE_CANDIDATE`.

Do not hard-code installation offsets until road class, operating context, edition, and exact section are verified.

### TH-DOH-SIGN-003/004 — Work-Zone and Motorway Sign Manuals

DOH manual set includes:
- Volume 3: traffic-control signs/devices for construction, rehabilitation and maintenance;
- Volume 4: sign installation and construction/maintenance traffic control for motorways.

DOH knowledge index:
- https://network.doh.go.th/km-web/storage/km/articles/

Historical official motorway manual path:
- https://doh.go.th/uploads/tinymce/service/bid/doc_bid/manual4.pdf

Planned product use:
- future temporary/work-zone asset pack;
- motorway-specific profile later.

Status:
- `DEFERRED_PROFILE_SOURCE`.

Not required for the first ordinary street/intersection asset pack.

### TH-DOH-MARK-001 — DOH Pavement Marking Manual

Authority:
- Department of Highways.

Historical official DOH manual:
- `คู่มือมาตรฐาน เครื่องหมายจราจรบนผิวทาง`.

Official source identified through DOH-hosted manual content/search:
- DOH historical manual path has been published under the official `doh.go.th` domain.

Coverage:
- longitudinal road lines;
- guide/traffic markings;
- pavement symbols/markings;
- standardization of markings for safe/consistent road operation.

Important currency note:
- current DOH procurement documents can still reference `รายละเอียดและข้อกำหนดการจัดทำเครื่องหมายจราจรบนผิวทาง ฉบับกรกฎาคม 2551` among governing documents.
- This is evidence that older specifications may remain operationally referenced, but it does **not** prove they are the only/latest design source.

Status:
- `VERIFY_CURRENT_EDITION_BEFORE_RULE_ENCODING`.

Planned product use after verification:
- line style dimensions/patterns;
- arrow/stencil geometry;
- stop/yield/crosswalk patterns;
- hatch/chevron definitions;
- source-versioned marking profiles.

### TH-DRR-MARK-001 — DRR Pavement Marking Guidance

Authority:
- Department of Rural Roads.

Official DRR knowledge PDF identified:
- https://localkc.drr.go.th/storage/knowledge/files/2021/08/24/612495266e6f61629787430.pdf

Coverage includes categories such as:
- longitudinal markings;
- transverse markings;
- arrows/text/symbols;
- curb markings;
- object/hazard markings;
- raised pavement markers.

The document also includes installation guidance/examples for specific marking types.

Status:
- `PRIMARY_DRR_SOURCE_CANDIDATE`.

Planned product use:
- DRR profile taxonomy;
- comparison with DOH marking profile;
- rural-road/local-road asset and advisory definitions.

Do not mix DRR values into DOH profile without explicit profile inheritance/override rules.

### TH-DRR-SAFETY-001 — DRR Traffic Markings and Road Facilities Guidance

Authority:
- Department of Rural Roads.

Official DRR knowledge PDF identified:
- https://localkc.drr.go.th/storage/knowledge/files/2021/08/24/612492e4b8f9b1629786852.pdf

Coverage includes:
- road signs;
- pavement markings;
- road-safety/facility installation and supervision context.

Status:
- `SUPPORTING_DRR_SOURCE`.

Planned product use:
- DRR asset taxonomy/context;
- QA cross-check for sign/marking/facility families.

### TH-DOH-LIGHT-001 — 2026 LED Highway Lighting Guidance

Authority:
- Department of Highways, Bureau of Standards and Evaluation.

Title/context:
- `แนวทางปฏิบัติสำหรับงานออกแบบและติดตั้งไฟฟ้าแสงสว่างบนทางหลวง ชนิดโคมไฟแอลอีดี`.

Official page:
- https://bohse.doh.go.th/news/detail/961d58e3-894c-4ab7-b42e-7984b208ba42

Published on the official site in January 2026 / พ.ศ. 2569.

Status:
- `CURRENT_LIGHTING_SOURCE_CANDIDATE`.

Planned product use:
- lighting asset metadata/profile;
- future advisory placement/design fields;
- LED streetlight assembly families.

Do not encode photometric design rules until the attached document is reviewed in detail.

### TH-DOH-SIGNAL-001 — Traffic Signal Specifications / Guidance

Authority:
- Department of Highways.

Current-status evidence:
- DOH organization responsibilities explicitly include traffic-signal design/control work;
- current procurement/contract documents continue to reference signal-work standards/specifications in project documentation.

Historical specification references found in current DOH procurement documentation include:
- `ข้อกำหนดและมาตรฐานทั่วไป งานติดตั้งไฟสัญญาณจราจรและไฟกระพริบบนทางหลวง ฉบับปี พ.ศ. 2523`.

Status:
- `NEEDS_DEDICATED_CURRENT-SOURCE_RESEARCH`.

Do not encode signal pole/head dimensions or installation standards from the historical reference until supersession/current applicability is checked.

For V1 asset work, generic semantic signal assemblies may be created without claiming standard mounting dimensions.

### TH-DOH-SAFETY-001 — Barriers / Guardrails / Safety Devices

Authority:
- Department of Highways.

DOH organizational responsibility covers safety devices and traffic-control/safety equipment standards.

Status:
- `NEEDS_DEDICATED_SOURCE_RESEARCH`.

Initial product treatment:
- generic semantically typed guardrail/barrier/delineator assets may be used for concept visualization;
- do not attach authoritative dimensions/profile labels until specific source documents are registered.

## Legal / regulatory context sources

The DOH knowledge index includes Thai traffic-sign regulatory material such as the Ministerial Regulation on traffic signs (2563).

These legal sources are useful for:
- sign legal meaning/code relationships;
- verifying regulatory semantics.

They are not necessarily sufficient by themselves for engineering layout dimensions or installation details.

## Source-status mapping

Recommended project statuses:

```text
THAI_AUTHORITY
AGENCY_MANUAL
INTERNATIONAL_BEST_PRACTICE
PROJECT_ASSUMPTION
CUSTOM_CONCEPT
TODO_VERIFY
```

Future richer record should add:
- `authority`;
- `documentId/title`;
- `edition`;
- `effectiveDate`;
- `retrievedDate`;
- `section/table/figure`;
- `applicability`;
- `supersedes/supersededBy`;
- `verificationStatus`.

## Standards implementation sequence

### Step 1 — taxonomy only

Create semantic asset/rule categories without official dimensions.

Examples:
- stop line;
- zebra crossing;
- directional arrow;
- regulatory sign;
- warning sign;
- streetlight;
- signal head.

### Step 2 — source registration

Register exact authority/document/edition and applicability.

### Step 3 — extract parameters

Extract only the dimensions/patterns required by current product features.

Avoid digitizing entire manuals when only a small verified subset is needed.

### Step 4 — independent review

For each rule/asset parameter:
- verify against source page/section/figure;
- review Thai road-class applicability;
- verify units;
- verify LHT orientation implications;
- mark exceptions/discretion notes.

### Step 5 — versioned profile

Ship parameters under an explicit profile version, for example conceptually:

```text
Thailand / DOH / Signs / 2018 edition
Thailand / DOH / Markings / verified profile date
Thailand / DOH / Lighting LED / 2026 guidance
Thailand / DRR / Markings / verified profile date
```

Do not silently update existing project results when the standards library changes.

## Engineering-judgment note

The current DOH sign manual itself emphasizes engineering judgment where standard criteria cannot be directly followed in a given context. The application should therefore support advisory warnings and explicit engineer override rather than pretending standards can be reduced to a universal pass/fail engine.

## Next standards research tasks

Before R6 / Thailand Engineering Profile Beta:
1. verify exact edition/current status of DOH pavement-marking design documents;
2. locate current DOH traffic-signal installation/design standards;
3. locate current guardrail/barrier/delineator standards and standard drawings;
4. identify current DRR sign/marking manuals and edition metadata;
5. determine which rules vary by road class/design speed/context;
6. create a page/section-indexed parameter extraction sheet;
7. license/copyright review for reproducing sign artwork/vector forms inside the application.

Do not block R1 geometry kernel work on completion of these tasks.