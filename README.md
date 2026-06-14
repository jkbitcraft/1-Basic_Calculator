# Basic Calculator

A vanilla HTML/CSS/JavaScript calculator based on the [florinpop app-ideas spec](https://github.com/florinpop17/app-ideas/blob/master/Projects/1-Beginner/Calculator-App.md).

## Learning progress

| Lesson | Topic | Status |
|--------|-------|--------|
| 1a | HTML layout + CSS styles | ✅ |
| 1b | Digit input + AC clear | ✅ |
| 1c | Lesson 1 README | ✅ |
| 2 | Operators (+, -, /) and equals | ✅ |
| 3 | C button and ERR polish | ✅ |
| 4 | Bonus: +/-, decimals, keyboard | ✅ |
| 5 | Deploy and portfolio README | ⬜ |

## Run locally

No build step required. Open `index.html` in a browser, or use a local server:

```bash
npx serve .
```

Then visit `http://localhost:3000`.

## Project structure

```
Basic-Calculator/
├── index.html           # Structure (display + buttons)
├── styles.css           # Visual design
├── calculator-logic.js  # State & rules (no DOM)
├── calculator.js        # Button clicks → logic
└── README.md
```

**Why split logic from UI?** The calculator rules live in `calculator-logic.js` with no HTML dependencies. That makes the behavior easy to test and reason about — a pattern worth using even in small projects.

## Behavior notes

- **Chained operations:** `12 + 3 + 2 =` computes step-by-step (`15`, then `17`).
- **`12 + =`:** Repeats the left operand (`12 + 12 = 24`).
- **C vs AC:** `C` clears the current entry or undoes the last operator; `AC` resets everything.
- **ERR:** Shown on divide-by-zero or results exceeding 8 digits. Any key after `ERR` starts fresh.
- **Decimals:** Up to 3 places per number; results use the most decimal places entered in either operand.
- **Keyboard:** `0-9`, `+`, `-`, `/`, `.`, `Enter`/`=`, `Escape` (AC), `C`/`c` (clear entry).

## Spec checklist

- [x] Display shows current number entered
- [x] Entry pad with digits 0-9 and operator buttons
- [x] Enter numbers up to 8 digits (extra digits ignored)
- [x] Operations (+, -, /, =)
- [x] AC clears all and sets display to 0
- [x] C clears last number or last operation
- [x] ERR when result exceeds 8 digits
- [x] Bonus: +/- toggle
- [x] Bonus: decimal point (3 places)

## Constraints

- No `eval()` — calculations use explicit functions.
