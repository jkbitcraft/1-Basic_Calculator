/**
 * Calculator UI — Lesson 1b
 *
 * Connects HTML buttons to Calculator logic via event delegation
 * (one listener on the keypad, not one per button).
 */

const displayEl = document.getElementById("display");
const keypadEl = document.querySelector(".keypad");
const calculator = new Calculator();

function updateDisplay() {
  const value = calculator.getDisplay();
  displayEl.textContent = value;
  displayEl.classList.toggle("display--error", value === "ERR");
}

keypadEl.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;

  switch (action) {
    case "digit":
      calculator.inputDigit(button.dataset.digit);
      break;
    case "clear-all":
      calculator.clearAll();
      break;
    // Lesson 2+: operator, equals; Lesson 3: C; Lesson 4: +/-, decimal
    default:
      return;
  }

  updateDisplay();
});

updateDisplay();
