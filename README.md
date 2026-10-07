# SGPA Calculator — AKTU B.Tech

A fully client-side calculator for AKTU B.Tech students to compute their **SGPA** (Semester Grade Point Average) and **YGPA** (Yearly Grade Point Average). Built as a Web Designing Lab practical project using vanilla HTML, CSS, and JavaScript — no frameworks, no build step, no dependencies.

Each semester comes pre-filled with its official subject list (name, type, and credits) based on the AKTU curriculum structure, with every field fully editable. Students enter internal and external marks per subject; the calculator validates the entries, converts them to grade points using the official examination ordinance scale, and computes a weighted SGPA. Data is auto-saved per semester in the browser, so switching semesters never overwrites another one's entries, and nothing is lost even after closing the browser for an extended period.

## Team Members

- Saksham Kaushik
- Saksham Mishra

---

## Features

- **Semester-aware subject templates** — selecting a semester (1–8) loads that semester's official subjects as editable defaults
- **Theory vs Practical subject types**, each with its own mark limits:

  | Type | Internal Max | External Max | Total |
  |------|:-------------:|:--------------:|:-----:|
  | Theory | 30 | 70 | 100 |
  | Practical | 50 | 50 | 100 |

- **Automatic SGPA calculation**: marks → percentage → grade point → credit-weighted average
- **YGPA calculation** from two semesters' SGPA and total credits
- **Add / remove subject rows** freely, independent of the pre-filled template
- **Per-semester auto-save**: each semester's data is stored separately, so switching semesters never overwrites another one's entries
- **Long-term persistence**: saved data has no expiry — it survives browser restarts and gaps of months or years, on the same browser/device
- **Inline validation** with clear, field-specific error messages
- **Responsive design** across mobile, tablet, and desktop
- **Accessible markup**: semantic HTML, labeled fields, `aria-live` results, visible focus states

---

## Official Grade Point Scale

Per the Examination Ordinances for BTECH / B.PHARM / BHMCT / BFAD / BFA / MB / MBA (Integrated), MCA / MCA (Integrated):

| Score % | Letter Grade | Grade Point |
|:-------:|:------------:|:-----------:|
| ≥ 90    | A+           | 10          |
| 80–89   | A            | 9           |
| 70–79   | B+           | 8           |
| 60–69   | B            | 7           |
| 50–59   | C            | 6           |
| 45–49   | D            | 5           |
| 40–44   | E            | 4           |
| 0–39    | F            | 0           |

This scale applies uniformly to both Theory and Practical subjects — marks are first converted to a percentage of the subject's own total (100 for both types), then mapped through this table.

## Formulas

**SGPA**
```
SGPA = Σ(Grade Point × Credits) / Σ(Credits)
```

**YGPA**
```
YGPA = (SGPA₁ × Credits₁ + SGPA₂ × Credits₂) / (Credits₁ + Credits₂)
```

---

## Curriculum Coverage

Subject templates (name, type, credits) are pre-loaded for the semesters below, sourced from the official B.Tech CSE curriculum structure. Zero-credit audit/qualifying courses (Sports & Yoga, NSS, Constitution of India, etc.) are excluded, since they don't factor into SGPA.

| Semester | Template | Subjects | Total Credits |
|:--------:|:--------:|:--------:|:--------------:|
| 1 | ✅ | 9 | 22 |
| 2 | ✅ | 9 | 22 |
| 3 | ✅ | 9 | 23 |
| 4 | ✅ | 9 | 23 |
| 5 | ✅ | 9 | 23 |
| 6 | ✅ | 8 | 21 |
| 7 | ✅ | 7 | 19 |
| 8 | ✅ | 3 | 16 |

---

## Tech Stack

- **HTML5** — semantic structure, accessible forms
- **CSS3** — custom-property design system, mobile-first responsive layout
- **Vanilla JavaScript (ES6+)** — no frameworks, no libraries, no build tooling

## File Structure

```
aktu-calc/
├── index.html        # Page structure
├── css/
│   └── style.css      # Styling and responsiveness
├── js/
│   └── script.js       # Logic: templates, validation, calculation, storage
├── .gitignore
└── README.md
```

No `package.json` or `node_modules` — zero external dependencies.

## How to Run

1. Clone or download this repository.
2. Open `index.html` in any modern browser.
3. No server, install step, or build process required.

For a live link, any static host works directly: GitHub Pages, Netlify, or Vercel.

---

## Known Limitations

- **Local-only persistence** — saved data lives in the browser's `localStorage` on one device/browser. It doesn't sync across devices and is lost if site data is manually cleared.
- **Single-user, no login** — by design, consistent with the scope of a lab practical project.

## Purpose

Built as a Web Designing Lab practical project, covering semantic HTML structure, a custom CSS design system, and interactive, validated JavaScript logic.