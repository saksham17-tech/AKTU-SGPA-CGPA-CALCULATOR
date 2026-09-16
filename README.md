# SGPA Calculator (AKTU B.Tech)

A web design practical project: a calculator tool for AKTU B.Tech students to compute their **SGPA** (Semester Grade Point Average) and **YGPA** (Yearly Grade Point Average) based on subject credits and grades.

## Team Members

- Saksham Kaushik
- Saksham Mishra

## Project Status

| Week   | Milestone                                                | Status    |
|--------|----------------------------------------------------------|-----------|
| Week 1 | Project selection & requirement analysis                 | ✅ Done   |
| Week 2 | HTML structure (semantic, no styling/scripting)          | ⬜ Pending |
| Week 3 | CSS styling & responsive layout                          | ⬜ Pending |
| Week 4 | JavaScript logic (calculations, add/remove, auto-save)   | ⬜ Pending |
| Week 5 | Testing & final submission                               | ⬜ Pending |

## Week 1: Requirement Analysis

### Objective
Identify a suitable reference tool and define the core features, layout, and formulas needed to build a functional SGPA/YGPA calculator as a web design practice project.

### Reference Site
A reference web application was reviewed to understand common layout and functionality patterns for this type of tool: a grade calculator built for AKTU B.Tech students.

### Core Features Identified
- Input fields for subject name, credit hours, and grade per course
- Ability to add or remove subject rows dynamically
- SGPA calculation based on the AKTU 10-point grading system
- YGPA calculation combining two semesters' SGPA and credits
- Auto-save of entered data so progress isn't lost on refresh
- Responsive layout for both mobile and desktop use
- Reference sections explaining the formulas and grading scale used

### Formulas to Implement

**SGPA**
```
SGPA = Σ(Grade Points × Credits) / Σ(Credits)
```

**YGPA**
```
YGPA = (SGPA₁ × Credits₁ + SGPA₂ × Credits₂) / (Credits₁ + Credits₂)
```

**AKTU Grade Point Scale**

| Grade | O  | A+ | A | B+ | B | C | P | F |
|-------|----|----|---|----|---|---|---|---|
| Points| 10 | 9  | 8 | 7  | 6 | 5 | 4 | 0 |

### Planned Tech Stack
- HTML5 (semantic markup)
- CSS3 (layout, styling, responsiveness)
- Vanilla JavaScript (calculation logic, dynamic rows, auto-save)

### Planned File Structure

```
sgpa-calculator/
│
├── index.html          # Main page structure
├── css/
│   └── style.css        # Layout, colors, responsiveness
├── js/
│   └── script.js         # Add/remove rows, calculation logic, auto-save
├── assets/
│   └── images/
│       └── og-image.png  # Preview/screenshot images
└── README.md             # This file
```

### Next Steps (Week 2)
Build the semantic HTML skeleton for the page — header/navigation, hero section, SGPA form and table, YGPA form, formula reference section, FAQ section, and footer — with no CSS or JavaScript yet.

## How to Run

1. Download the project files.
2. Open `index.html` directly in any web browser.
3. No build step or server required (static HTML/CSS/JS project).

## Purpose

This project is being built for practice as part of a Web Designing course exercise, focused on layout structure, semantic HTML, styling, and interactive JavaScript.
