/**
 * Calculator Logic — Lessons 1–3
 *
 * This file has NO knowledge of HTML or buttons.
 * It only manages state and rules. That separation makes logic
 * easy to test and reason about.
 */

const MAX_DIGITS = 8;

function createInitialState() {
  return {
    display: "0",
    currentValue: "0",
    previousValue: null,
    operator: null,
    waitingForOperand: false,
    lastAction: null, // tracks "digit" | "operator" | "equals" | "clear" for C button later
    hasError: false,
  };
}

// --- Pure math (Lesson 2) — no eval(), easy to unit test ---

function applyOperator(a, b, op) {
  const left = Number(a);
  const right = Number(b);

  let result;
  switch (op) {
    case "+":
      result = left + right;
      break;
    case "-":
      result = left - right;
      break;
    case "/":
      if (right === 0) return "ERR";
      result = left / right;
      break;
    default:
      return right;
  }

  if (!Number.isFinite(result)) return "ERR";
  return result;
}

function exceedsMaxDigits(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return true;
  const integerPart = Math.trunc(Math.abs(num));
  return integerPart >= Math.pow(10, MAX_DIGITS);
}

function formatResult(value) {
  if (value === "ERR") return "ERR";
  return Number.isInteger(value) ? String(value) : String(value);
}

class Calculator {
  constructor() {
    this.state = createInitialState();
  }

  getDisplay() {
    return this.state.display;
  }

  /**
   * Lesson 1b: digit entry
   */
  inputDigit(digit) {
    if (this.state.hasError) {
      this.clearAll();
    }

    const { currentValue, waitingForOperand } = this.state;

    if (waitingForOperand) {
      this.state.currentValue = digit;
      this.state.waitingForOperand = false;
    } else if (currentValue === "0") {
      this.state.currentValue = digit;
    } else if (currentValue.replace("-", "").length < MAX_DIGITS) {
      this.state.currentValue += digit;
    }

    this.state.display = this.state.currentValue;
    this.state.lastAction = "digit";
  }

  /**
   * Lesson 2: operator buttons (+, -, /)
   *
   * Chaining: "12 + 3 +" computes 15 before storing the new operator.
   * Swapping: "12 +" then "-" just changes operator (display stays 12).
   */
  inputOperator(op) {
    if (this.state.hasError) return;

    const inputValue = Number(this.state.currentValue);

    if (this.state.previousValue !== null && !this.state.waitingForOperand) {
      const result = this._compute(this.state.previousValue, inputValue, this.state.operator);
      if (result === null) return;

      this.state.previousValue = Number(result);
      this.state.currentValue = result;
      this.state.display = result;
    } else if (this.state.previousValue === null) {
      this.state.previousValue = inputValue;
    }

    this.state.operator = op;
    this.state.waitingForOperand = true;
    this.state.lastAction = "operator";
  }

  /**
   * Lesson 2: equals button
   *
   * "12 + =" repeats the left operand (12 + 12 = 24).
   */
  inputEquals() {
    if (this.state.hasError) return;
    if (this.state.operator === null || this.state.previousValue === null) return;

    const right = this.state.waitingForOperand
      ? this.state.previousValue
      : Number(this.state.currentValue);

    const result = this._compute(this.state.previousValue, right, this.state.operator);
    if (result === null) return;

    this.state.display = result;
    this.state.currentValue = result;
    this.state.previousValue = null;
    this.state.operator = null;
    this.state.waitingForOperand = true;
    this.state.lastAction = "equals";
  }

  _compute(left, right, op) {
    const raw = applyOperator(left, right, op);

    if (raw === "ERR" || exceedsMaxDigits(raw)) {
      this._setError();
      return null;
    }

    return formatResult(raw);
  }

  _setError() {
    this.state.hasError = true;
    this.state.display = "ERR";
    this.state.currentValue = "0";
    this.state.previousValue = null;
    this.state.operator = null;
    this.state.waitingForOperand = false;
    this.state.lastAction = "equals";
  }

  clearAll() {
    this.state = createInitialState();
    this.state.lastAction = "clear";
  }

  /**
   * Lesson 3: C (clear entry)
   *
   * - Last action was operator → undo it, restore display to previousValue
   * - Otherwise → clear current number back to 0
   * - ERR state → full reset (same as AC)
   */
  clearEntry() {
    if (this.state.hasError) {
      this.clearAll();
      return;
    }

    if (this.state.lastAction === "operator") {
      const prior = formatResult(this.state.previousValue);
      this.state.currentValue = prior;
      this.state.display = prior;
      this.state.operator = null;
      this.state.previousValue = null;
      this.state.waitingForOperand = false;
      this.state.lastAction = "clear";
      return;
    }

    this.state.currentValue = "0";
    this.state.display = "0";
    this.state.lastAction = "clear";
  }

  toggleSign() {
    // Lesson 4 (bonus)
  }

  inputDecimal() {
    // Lesson 4 (bonus)
  }
}
