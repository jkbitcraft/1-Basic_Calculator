# Basic Calculator

A vanilla HTML/CSS/JavaScript calculator based on the [florinpop app-ideas spec](https://github.com/florinpop17/app-ideas/blob/master/Projects/1-Beginner/Calculator-App.md).

## Learning progress

| Lesson | Topic | Status |
|--------|-------|--------|
| 1a | HTML layout + CSS styles | ✅ |
| 1b | Digit input + AC clear | ✅ |
| 1c | Lesson 1 README | ✅ |
| 2 | Operators (+, -, /) and equals | ⬜ |
| 3 | C button and ERR polish | ⬜ |
| 4 | Bonus: +/-, decimals, keyboard | ⬜ |
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

## Spec checklist

- [x] Display shows current number entered
- [x] Entry pad with digits 0-9 and operator buttons (UI only)
- [x] Enter numbers up to 8 digits (extra digits ignored)
- [ ] Operations (+, -, /, =)
- [x] AC clears all and sets display to 0
- [ ] C clears last number or last operation
- [ ] ERR when result exceeds 8 digits
- [ ] Bonus: +/- toggle
- [ ] Bonus: decimal point (3 places)

## Constraints

- No `eval()` — calculations use explicit functions.
