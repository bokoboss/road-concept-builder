# Thai Standards Notes

This file records standards, guidance, assumptions, and source references used by the project.

Important: This app creates concept diagrams. It must not claim that generated output is a construction-ready signing-and-marking plan.

## 1. Source hierarchy

Use this hierarchy when resolving conflicts:

1. Thai law/regulation/gazette text
2. Thai agency manuals and standard drawings
3. International best practices adapted to Thai left-hand traffic
4. Project visual defaults

## 2. Key Thai references to collect and verify

### 2.1 Legal / regulatory base

- กฎกระทรวงกำหนดการจัดทำ ปัก ติดตั้งป้ายจราจร เครื่องหมายจราจร หรือสัญญาณจราจร สำหรับการจราจรบนทางหลวง พ.ศ. 2563
  - Use for taxonomy and legal meaning of signs, pavement markings, and traffic signals.
  - Relevant concepts include traffic signs, pavement markings, traffic signals, stop line, give-way line, crosswalk, arrows, lane control, intersection, and roundabout.
  - URL: https://www.npdwebsite.net/knowledge/store_act/p1200620222701.pdf
  - Alternate search result: https://moi.gcc.go.th/index.php?Itemid=73&catid=49%3A2008-06-24-07-02-23&format=pdf&id=49422%3A-------2563&option=com_content&view=article
  - Status: `THAI_AUTHORITY`

### 2.2 Department of Highways references

- คู่มือมาตรฐานการออกแบบและติดตั้งป้ายจราจร กรมทางหลวง
  - Use for traffic sign categories, sign form, sign placement concepts, and highway signing context.
  - URL: https://bhs.doh.go.th/files/standard_group/manual1.pdf
  - Status: `AGENCY_MANUAL`

- คู่มือเครื่องหมายควบคุมการจราจร / เครื่องหมายจราจรบนผิวทาง กรมทางหลวง
  - Use for pavement marking categories and drawing logic: longitudinal markings, transverse markings, arrows, symbols, pavement messages.
  - URL: https://bhs.doh.go.th/files/standard_group/marking/Marking2.pdf
  - Status: `AGENCY_MANUAL`

- รายละเอียดและข้อกำหนดการจัดทำเครื่องหมายจราจรบนผิวทาง กรมทางหลวง
  - Use for detailed road marking specifications after verification.
  - URL: https://bhs.doh.go.th/files/standard_group/marking/RoadMarking.pdf
  - Status: `AGENCY_MANUAL`

- มาตรฐานเครื่องหมายจราจร กรมทางหลวง
  - Use for pavement/surface marking categories and visual reference.
  - URL: https://bhs.doh.go.th/sites/default/files/download/manual/%E0%B8%A1%E0%B8%B2%E0%B8%95%E0%B8%A3%E0%B8%90%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%84%E0%B8%A3%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%87%E0%B8%AB%E0%B8%A1%E0%B8%B2%E0%B8%A2%E0%B8%88%E0%B8%A3%E0%B8%B2%E0%B8%88%E0%B8%A3.pdf
  - Status: `AGENCY_MANUAL`

### 2.3 Department of Rural Roads references

- คู่มือปรับปรุงกายภาพทางหลวงท้องถิ่นในเขตเมือง กรมทางหลวงชนบท
  - Use for urban/local road improvement components: lane configuration, shoulder/curb context, medians, islands, roundabouts, pedestrian facilities, signs, markings, signals, crossings.
  - URL: https://localkc.drr.go.th/storage/knowledge/files/2021/08/24/612495266e6f61629787430.pdf
  - Status: `AGENCY_MANUAL`

## 3. Thai terminology mapping

| English term | Thai working term | Notes |
|---|---|---|
| Road marking | เครื่องหมายจราจรบนพื้นทาง / เครื่องหมายจราจรบนผิวทาง | Use source-specific wording when citing |
| Lane line | เส้นแบ่งช่องจราจร | Same-direction lane separator |
| Direction separation line / center line | เส้นแบ่งทิศทางจราจร | Opposing-direction separator |
| Edge line | เส้นขอบทาง | Carriageway edge marking |
| Stop line | เส้นหยุด | Transverse control line |
| Give-way / yield line | เส้นให้ทาง | Transverse yield-control line |
| Crosswalk | ทางข้าม / เครื่องหมายทางข้าม | Pedestrian crossing marking |
| Lane-use arrow | ลูกศรบนพื้นทาง / ลูกศรแสดงทิศทาง | Movement indication |
| Median | เกาะกลาง / แนวแบ่งทิศทาง | Type must be clear |
| Median opening | ช่องเปิดเกาะกลาง | For access/U-turn |
| U-turn pocket | ช่องรอกลับรถ | Project term; verify agency term if needed |
| Left-turn slip lane | ช่องเลี้ยวซ้ายผ่านตลอด / ช่องเลี้ยวซ้ายแยก | Project term; verify exact usage |
| Channelizing island | เกาะแบ่งช่องทาง / เกาะนำทาง | Use visual terminology carefully |
| Roundabout | วงเวียน | Legal/common term |

## 4. Minimum Thai component coverage

For MVP and near-term phases, ensure coverage of:

- Lane lines
- Direction-separation markings
- Edge lines
- Stop lines
- Give-way lines
- Crosswalks
- Lane-use arrows
- U-turn arrows
- Medians and median openings
- Pocket lanes
- Channelizing islands
- Roundabout yield/entry logic
- Traffic control placeholders: signal, stop, give-way

## 5. Rules that are safe to implement early

These are mostly semantic/consistency rules and do not depend heavily on exact dimensions:

- Signalized approach should include stop-line logic.
- Give-way approach should include give-way-line logic.
- Two-way road should visually separate opposing directions.
- Lane-use arrows should match lane movement.
- U-turn opening should be visually connected to median/opening logic.
- Pocket lanes should include storage and taper logic.
- Slip lanes should define control type.

## 6. Rules requiring source verification before hard-coding dimensions

Do not hard-code these as Thai standards until verified from the relevant source page/table/figure:

- Exact lane marking width
- Exact dash length and gap length by road environment
- Exact arrow dimensions
- Exact stop line width and offset
- Exact give-way line dimensions
- Exact crosswalk stripe dimensions
- Exact sign placement lateral/vertical offsets
- Exact island dimensions
- Exact taper formula/length by design speed

Until verified, use visual defaults labeled `PROJECT_ASSUMPTION`.

## 7. Concept defaults

Initial concept defaults may be used only as visual defaults:

| Item | Default | Status |
|---|---:|---|
| Lane width | 3.25 m | `PROJECT_ASSUMPTION` |
| Shoulder width | 1.50 m | `PROJECT_ASSUMPTION` |
| Raised median width | 2.00 m | `PROJECT_ASSUMPTION` |
| Painted median width | 1.00 m | `PROJECT_ASSUMPTION` |
| Marking stroke width in diagram | visual-scaled | `PROJECT_ASSUMPTION` |
| Arrow size | visual-scaled | `PROJECT_ASSUMPTION` |

These defaults are for schematic visualization only. They are not design standards.

## 8. Application to Thailand

Use Thai left-hand traffic logic by default:

- Curb-side left turns
- Median-side right turns
- U-turn pockets associated with median/opening logic
- Free-left slip lanes as common optional intersection component
- Sign and marking directionality adapted to left-hand traffic

## 9. Citation discipline for future development

When a developer adds a standard-derived value, record:

- Source document name
- URL
- Page/section/table/figure if available
- Extracted rule/value
- Implementation file path
- Status label
- Date verified

Example:

```text
Rule: Stop line visual component required for signalized approach
Source: กฎกระทรวง ... พ.ศ. 2563
Status: THAI_AUTHORITY
Implementation: validation/intersectionRules.ts
Verified date: YYYY-MM-DD
```
