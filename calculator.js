/**
 * Calculator UI — Lessons 1–4
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

function handleInput(handler) {
  handler();
  updateDisplay();
}

keypadEl.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;

  switch (action) {
    case "digit":
      handleInput(() => calculator.inputDigit(button.dataset.digit));
      break;
    case "clear-all":
      handleInput(() => calculator.clearAll());
      break;
    case "clear":
      handleInput(() => calculator.clearEntry());
      break;
    case "operator":
      handleInput(() => calculator.inputOperator(button.dataset.op));
      break;
    case "equals":
      handleInput(() => calculator.inputEquals());
      break;
    case "toggle-sign":
      handleInput(() => calculator.toggleSign());
      break;
    case "decimal":
      handleInput(() => calculator.inputDecimal());
      break;
    default:
      break;
  }
});

// Lesson 4: keyboard support
const KEY_HANDLERS = {
  0: () => calculator.inputDigit("0"),
  1: () => calculator.inputDigit("1"),
  2: () => calculator.inputDigit("2"),
  3: () => calculator.inputDigit("3"),
  4: () => calculator.inputDigit("4"),
  5: () => calculator.inputDigit("5"),
  6: () => calculator.inputDigit("6"),
  7: () => calculator.inputDigit("7"),
  8: () => calculator.inputDigit("8"),
  9: () => calculator.inputDigit("9"),
  "+": () => calculator.inputOperator("+"),
  "-": () => calculator.inputOperator("-"),
  "/": () => calculator.inputOperator("/"),
  ".": () => calculator.inputDecimal(),
  Enter: () => calculator.inputEquals(),
  "=": () => calculator.inputEquals(),
  Escape: () => calculator.clearAll(),
  c: () => calculator.clearEntry(),
  C: () => calculator.clearEntry(),
};

document.addEventListener("keydown", (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  const handler = KEY_HANDLERS[event.key];
  if (!handler) return;

  event.preventDefault();
  handleInput(handler);
});

updateDisplay();
