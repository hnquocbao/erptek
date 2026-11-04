---
name: ERPTEK
description: The labeled warehouse. Company knowledge received, labeled, shelved and picked, on cool concrete under safety-yellow floor tape.
colors:
  concrete: "#d9dcdc"
  concrete-deep: "#c8cccc"
  concrete-shade: "#b6bbbb"
  ink: "#141414"
  ink-soft: "#383a35"
  label: "#f8f8f3"
  label-mute: "#c9cac3"
  yellow: "#f2c200"
  yellow-deep: "#d9ad00"
  yellow-ink: "#1c1700"
  yellow-ink-soft: "#4a3e00"
  upright: "#2f5c86"
  beam: "#d9531c"
  carton: "#b68d5c"
  carton-edge: "#7d5d37"
  ok: "#1f6b3a"
  error: "#a3221a"
typography:
  display:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "clamp(2.7rem, 1.4rem + 3.6vw, 4.6rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.01em"
  display-stencil:
    fontFamily: "Big Shoulders Stencil Display, Big Shoulders Display, sans-serif"
    fontSize: "clamp(2.9rem, 1.6rem + 4.6vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.92
  headline:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "clamp(2.2rem, 1.5rem + 2.6vw, 3.6rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "clamp(1.6rem, 1.2rem + 1.4vw, 2.2rem)"
    fontWeight: 800
    lineHeight: 1
  sign:
    fontFamily: "Big Shoulders Stencil Display, Big Shoulders Display, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.08em"
  button:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 800
    letterSpacing: "0.04em"
  body-lead:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 400
    lineHeight: 1.45
  body:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "\"tnum\""
  label:
    fontFamily: "Overpass, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
  data:
    fontFamily: "Overpass Mono, ui-monospace, monospace"
    fontSize: "0.8em"
    fontWeight: 500
    letterSpacing: "0.02em"
rounded:
  box: "1px"
  tag: "2px"
  plate: "3px"
spacing:
  xs: "0.5rem"
  s: "1rem"
  m: "1.5rem"
  l: "2.5rem"
  xl: "clamp(3.5rem, 2rem + 5vw, 6.5rem)"
  gutter: "clamp(1rem, 0.5rem + 2.5vw, 3rem)"
  max: "82rem"
components:
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.label}"
    typography: "{typography.button}"
    rounded: "{rounded.plate}"
    padding: "0.75rem 1.35rem 0.6rem"
    height: "3rem"
  button-ink-hover:
    backgroundColor: "{colors.ink-soft}"
    textColor: "{colors.label}"
  button-yellow:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.yellow-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.plate}"
    padding: "0.75rem 1.35rem 0.6rem"
    height: "3rem"
  button-yellow-hover:
    backgroundColor: "{colors.yellow-deep}"
    textColor: "{colors.yellow-ink}"
  input:
    backgroundColor: "{colors.label}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.plate}"
    padding: "0.7rem 0.85rem 0.55rem"
    height: "3rem"
  thermal-tag:
    backgroundColor: "{colors.label}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tag}"
    padding: "0.3rem 0.4rem 0.25rem"
  thermal-tag-picked:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.label}"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.plate}"
    padding: "0.5rem 0.75rem 0.4rem"
  nav-link-hover:
    backgroundColor: "{colors.concrete-deep}"
  ask-chip:
    textColor: "{colors.label}"
    rounded: "{rounded.plate}"
    padding: "0.5rem 0.75rem 0.4rem"
  ask-chip-pressed:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.yellow-ink}"
  check-row:
    backgroundColor: "{colors.label}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tag}"
    padding: "0.8rem 0.9rem 0.7rem"
  check-row-checked:
    backgroundColor: "{colors.yellow}"
  aisle-sign:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.yellow-ink}"
    typography: "{typography.display-stencil}"
    rounded: "{rounded.plate}"
  ink-panel:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.label}"
    rounded: "{rounded.plate}"
    padding: "1.5rem"
---

# Design System: ERPTEK

## Overview

**Creative North Star: "The Labeled Warehouse"**

A company's knowledge is treated as stock in a working warehouse. Files, emails and spreadsheets arrive at a receiving dock, get a thermal label with a location code and a barcode, and go onto a steel rack where a person or an assistant can pick them. Every visual decision comes from that floor: poured-concrete ground with a fine grain, black ink, safety-yellow floor tape marking lanes and boundaries, white thermal labels, and blue uprights with orange beams holding the bins.

The register is industrial and plain-spoken, not futuristic. Surfaces are flat and lit like a warehouse hall; depth comes from labels sitting slightly proud of the surface they are stuck to, not from glow or gradients. Type is condensed and tall like aisle signage, with a stencil cut reserved for signs and markings. Data reads in a monospace that looks printed by a label printer. Motion moves like goods on a conveyor: linear travel and a firm stop, never a bounce.

The world was built in deliberate opposition to the AI-agency default (dark navy, glowing neural nodes, gradient chat bubbles). It stays light, literal and physical.

**Key Characteristics:**
- Cool concrete ground (with an inline SVG noise grain) under black ink.
- Safety yellow is the one committed colour: floor tape, push-plates, signs, and the drenched closing section.
- Rack blue and beam orange exist only inside the rack.
- White thermal labels with location codes and barcodes carry names and data.
- Big Shoulders Display for headings, its Stencil cut for signs, Overpass for reading, Overpass Mono for data only.
- Small, firm corners (1-3px); 1.5-4px ink borders define almost every object.

## Colors

A cool, desaturated warehouse floor with one loud safety colour and two hardware colours that never leave the rack.

### Primary
- **Safety Yellow** (yellow): the committed colour. Floor-tape bands (header beam, booking strip, aisle dividers, method lane), yellow push-plate buttons, aisle signs and stop markers, checked checklist rows, pressed Ask chips, put-away and picked bin highlights, text selection, the focus halo, and the fully drenched booking section.
- **Worn Yellow** (yellow-deep): hover state for yellow buttons and the underline colour of links on concrete.
- **Tape Ink** (yellow-ink): text on any yellow surface. Never put plain ink-soft or grey text on yellow.
- **Faded Tape Ink** (yellow-ink-soft): secondary text inside the yellow closing section.

### Secondary
- **Rack Upright Blue** (upright): the steel uprights framing the bin grid. Rack only.
- **Beam Orange** (beam): the load beam under each bin row. Rack only.
- **Carton** (carton) and **Carton Edge** (carton-edge): the cardboard stock boxes inside bins. Rack only.

### Neutral
- **Poured Concrete** (concrete): page ground, under a 7% opacity fractal-noise grain.
- **Sealed Concrete** (concrete-deep): alternate section ground (services, FAQ), the receiving dock, nav hover, scrollbar track.
- **Concrete Shadow** (concrete-shade): mixed into empty bin backs to read as recessed shelf.
- **Ink** (ink): text, borders, ink sections (method, footer), ink buttons, ink panels, and the dark half of hazard tape.
- **Soft Ink** (ink-soft): secondary text on concrete, dashed borders, ink button hover.
- **Thermal Label** (label): label stock: tags, slips, inputs, checklist rows, wordmark plate, the booking form card, and text on ink.
- **Label Grey** (label-mute): secondary text on ink surfaces.

### Feedback
- **Pass Green** (ok) and **Fault Red** (error): form status text only.

### Named Rules
**The Floor-Tape Rule.** Yellow appears as tape, plates and signs, laid as bands with ink edges or as solid fields. It is never a gradient, a glow, or a tint.

**The Rack-Only Rule.** Upright blue, beam orange and carton brown appear only inside the rack illustration. They never become link, button, chart or section colours.

**The Yellow-Text Rule.** Anything on yellow is set in yellow-ink, never ink-soft or grey.

## Typography

**Display Font:** Big Shoulders Display (with Arial Narrow, sans-serif), weights 700/800/900
**Stencil Font:** Big Shoulders Stencil Display (falls back to Big Shoulders Display), weight 800
**Body Font:** Overpass (with system-ui), weights 400/700
**Data Font:** Overpass Mono (with ui-monospace), weight 500

**Character:** Tall condensed signage over a highway-style sans; the stencil cut reads as paint sprayed through a template onto a rack upright, and the mono reads as thermal-printer output.

### Hierarchy
- **Display** (900, fluid 2.7-4.6rem, line-height 0.9, uppercase): the hero headline and the closing section headline (which scales to step-4).
- **Display Stencil** (800, fluid 2.9-6rem, line-height 0.92, uppercase): one statement headline per page (the principle section).
- **Headline** (800, fluid 2.2-3.6rem, line-height 0.95, uppercase): section headings.
- **Title** (800, fluid 1.6-2.2rem, line-height 1, uppercase): aisle titles, method stops, form titles, readiness zone.
- **Sign** (stencil 800, uppercase, wide tracking 0.04-0.08em): aisle signs (2.6rem), method stop numbers (1.9rem), readiness score (5.5rem), wordmark (1.45rem), dock sign (1.05rem).
- **Body Lead** (400, 1.3125rem, line-height 1.45): ledes, 34-52ch.
- **Body** (400, 1.0625rem, line-height 1.55, tabular numerals): running text, 44-65ch.
- **Label** (700, 0.875rem): field labels, captions, small status lines.
- **Data** (Mono 500, 0.8em, 0.02em tracking): location codes, bin counts, file names, source citations.

### Named Rules
**The Mono-Is-Data Rule.** Overpass Mono sets only what a label printer would print: location codes, counts, file names, source references. Headings, buttons, labels and prose never use it.

**The Stencil-Is-Signage Rule.** The stencil cut marks places and numbers (aisle codes, stop numbers, scores, the wordmark) and at most one statement headline. It is not a body or button face.

**The Uppercase-Display Rule.** Big Shoulders headings and buttons are set uppercase; Overpass is set in sentence case.

## Layout

Content sits in a single centred column (max 82rem) with fluid gutters (1-3rem). Sections stack full-bleed with extra-large vertical padding (3.5-6.5rem) and alternate grounds: concrete, sealed concrete with a 2px ink top rule, ink, and finally solid yellow. Inside sections, asymmetric two- and three-column grids (5fr/7fr hero, 1fr/2fr FAQ, 1.2fr/1fr heads) collapse to one column between 44rem and 64rem.

The spacing scale is small and stepped: xs 0.5rem, s 1rem, m 1.5rem, l 2.5rem, xl fluid. Tape bands are fixed physical sizes (8px header beam, 10-14px floor tape, 14px hazard tape) so they read as real tape at every width.

Floor tape is allowed to run off the viewport edge (the booking strip extends left to the edge, both edges on mobile). At 36rem and below the hero reorders so the headline, then a compact four-column rack, then the lede and booking strip all sit in the first viewport; the header keeps a "Book a call" plate visible when nav links hide (52rem).

## Elevation & Depth

Flat warehouse light. Depth is carried by ink borders, ground changes and labels lifted a hair off their surface, never by glow or coloured shadow.

### Shadow Vocabulary
- **Label Lift** (`0 1px 1px rgb(20 20 20 / 0.12), 0 3px 8px -2px rgb(20 20 20 / 0.18)`): thermal labels, file slips, shelf items, the wordmark plate.
- **Card on Tape** (`0 2px 2px rgb(28 23 0 / 0.15), 0 18px 40px -16px rgb(28 23 0 / 0.45)`): the booking form card resting on the yellow closing section.
- **Focus Halo** (`outline: 3px solid ink; outline-offset: 3px; box-shadow: 0 0 0 6px yellow`): every focus-visible state.

### Named Rules
**The Stuck-On Rule.** Only things that are physically stuck or set onto a surface (labels, slips, the booking card) get a shadow, and it is short and warm-neutral. Panels, sections and buttons are flat.

## Shapes

Industrial, nearly square. Plates, buttons, inputs and panels use 3px corners; labels, tags, slips and checkboxes 2px; carton boxes 1px. Borders do the drawing: 2px ink on buttons, inputs and the wordmark; 1.5px ink on labels and slips; 3px ink on signs and stop markers; 4px ink edges on floor tape. Dashed ink-soft borders mean "not yet sorted" (receiving dock, demo-data badge, the "before" column). Hazard tape is a 45-degree yellow/ink stripe (16px bands), used only at hard boundaries. Barcodes are drawn as deterministic SVG bars on labels and the wordmark.

## Components

### Buttons
Push-plates: flat, firm-edged, uppercase.
- **Shape:** gently squared (3px), 2px ink border, min-height 3rem.
- **Ink plate:** ink fill, label text; the submit plate on yellow tape (booking strip) and on the booking card.
- **Yellow plate:** yellow fill, yellow-ink text; used on concrete and ink (header CTA, primary actions).
- **Hover / Active:** ink plate shifts to ink-soft, yellow plate to yellow-deep, 160ms ease-out; active presses down 1px. Disabled drops to 70% opacity with a progress cursor.
- **Focus:** the shared focus halo.

### Thermal Label (signature)
White label stock, 1.5px ink border, 2px corners. Holds a mono location code, a bold Overpass name, a mono count, and a barcode strip underneath. On put-away the label flashes yellow; when picked the bin fills yellow and the label inverts to ink with label text and rises 3px; non-matching bins dim to concrete.

### The Rack (signature)
Blue uprights (10px) frame a four-column grid of bins; each bin sits on a 9px orange beam (6px on mobile) over a recessed concrete back, with carton stock boxes stacked from the bottom. Above it, a dashed receiving dock holds tilted file slips; below it, an ink Ask panel. Slips travel to their bin over 620ms (cubic-bezier(0.45, 0, 0.15, 1)) and stop; no overshoot. Reduced motion shelves everything instantly.

### Inputs / Fields
- **Style:** label-stock fill, 2px ink border, 3px corners, min-height 3rem, bold 0.875rem label above.
- **Select:** custom ink chevron, no native arrow.
- **Focus:** focus halo with zero offset.
- **Status:** bold line, ok green or error red.

### Chips (Ask questions)
- **Style:** transparent on ink, 1.5px label border, bold 0.95rem Overpass.
- **State:** hover tints 14% label; pressed fills yellow with yellow-ink text; focus uses a yellow outline.

### Checklist Rows
Label-stock rows with a 1.5rem ink-bordered box; checked rows fill yellow and show a yellow-ink tick (140-200ms).

### Cards / Containers
- **Ink panel:** ink fill, label text, 3px corners, 1-1.5rem padding (Ask bar, readiness result).
- **Booking card:** label-stock fill, 2px ink border, Card on Tape shadow, on the yellow section only.
- **Aisle sign:** square yellow plate, 3px ink border, stencil code.
- **Shelf items:** label-stock rows with Label Lift.

### Navigation
Sticky header on 92% concrete with a 6px backdrop blur, the wordmark plate on the left, bold 0.95rem Overpass links with 3px-cornered sealed-concrete hover, and a yellow CTA plate. An 8px yellow beam with 2px ink edges runs under it. Below 52rem links hide and the CTA stays.

### Wordmark
Label plate (2px ink border, 3px corners, Label Lift) with the stencil name and a small barcode.

## Do's and Don'ts

### Do:
- **Do** use safety yellow as tape, plates, signs and full-section drench, with ink edges where it meets concrete.
- **Do** put names and data on white thermal labels with ink borders, a mono location code, and a barcode where it is a stored item.
- **Do** keep Overpass Mono to codes, counts, file names and source citations.
- **Do** set Big Shoulders headings uppercase at 800-900 weight with tight leading (0.9-1).
- **Do** move things like conveyor goods: linear travel and a firm stop, 160-620ms, with a reduced-motion path that skips travel.
- **Do** mark illustrative content as demo data with the dashed badge.

### Don't:
- **Don't** use the AI-agency default: dark navy grounds, glowing neural nodes, gradient chat bubbles.
- **Don't** use upright blue, beam orange or carton brown outside the rack.
- **Don't** use yellow as a gradient, glow or translucent tint.
- **Don't** put hazard tape anywhere but a hard boundary.
- **Don't** set prose, buttons or headings in Overpass Mono.
- **Don't** add bounce or overshoot to motion.
- **Don't** round corners beyond 3px or drop the ink border from plates, labels and fields.
