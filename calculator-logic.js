/**
 * Calculator Logic — Lessons 1–4
 *
 * This file has NO knowledge of HTML or buttons.
 * It only manages state and rules. That separation makes logic
 * easy to test and reason about.
 */

const MAX_DIGITS = 8;
const MAX_DECIMAL_PLACES = 3;

function createInitialState() {
  return {
    display: "0",
    currentValue: "0",
    previousValue: null,
    operator: null,
    waitingForOperand: false,
    lastAction: null,
    hasError: false,
  };
}

function countIntegerDigits(value) {
  const [intPart] = value.replace("-", "").split(".");
  return intPart.length;
}

function countDecimalPlaces(value) {
  const normalized = value.replace("-", "");
  const dotIndex = normalized.indexOf(".");
  return dotIndex === -1 ? 0 : normalized.length - dotIndex - 1;
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

function formatResult(value, decimalPlaces = 0) {
  if (value === "ERR") return "ERR";
  if (decimalPlaces > 0) {
    return Number(value).toFixed(decimalPlaces);
  }
  return Number.isInteger(value) ? String(value) : String(value);
}

class Calculator {
  constructor() {
    this.state = createInitialState();
    this._previousValueStr = null;
  }

  getDisplay() {
    return this.state.display;
  }

  inputDigit(digit) {
    if (this.state.hasError) {
      this.clearAll();
    }

    const { currentValue, waitingForOperand } = this.state;

    if (waitingForOperand) {
      this.state.currentValue = digit;
      this.state.waitingForOperand = false;
    } else if (currentValue.includes(".")) {
      if (countDecimalPlaces(currentValue) < MAX_DECIMAL_PLACES) {
        this.state.currentValue += digit;
      }
    } else if (currentValue === "0") {
      this.state.currentValue = digit;
    } else if (currentValue === "-0") {
      this.state.currentValue = "-" + digit;
    } else if (countIntegerDigits(currentValue) < MAX_DIGITS) {
      this.state.currentValue += digit;
    }

    this.state.display = this.state.currentValue;
    this.state.lastAction = "digit";
  }

  inputOperator(op) {
    if (this.state.hasError) return;

    const inputValue = Number(this.state.currentValue);

    if (this.state.previousValue !== null && !this.state.waitingForOperand) {
      const result = this._compute(
        this.state.previousValue,
        inputValue,
        this.state.operator,
        this._previousValueStr,
        this.state.currentValue
      );
      if (result === null) return;

      this.state.previousValue = Number(result);
      this.state.currentValue = result;
      this.state.display = result;
      this._previousValueStr = result;
    } else if (this.state.previousValue === null) {
      this.state.previousValue = inputValue;
      this._previousValueStr = this.state.currentValue;
    }

    this.state.operator = op;
    this.state.waitingForOperand = true;
    this.state.lastAction = "operator";
  }

  inputEquals() {
    if (this.state.hasError) return;
    if (this.state.operator === null || this.state.previousValue === null) return;

    const rightStr = this.state.waitingForOperand
      ? this._previousValueStr
      : this.state.currentValue;
    const right = Number(rightStr);

    const result = this._compute(
      this.state.previousValue,
      right,
      this.state.operator,
      this._previousValueStr,
      rightStr
    );
    if (result === null) return;

    this.state.display = result;
    this.state.currentValue = result;
    this.state.previousValue = null;
    this._previousValueStr = null;
    this.state.operator = null;
    this.state.waitingForOperand = true;
    this.state.lastAction = "equals";
  }

  _compute(left, right, op, leftStr, rightStr) {
    const raw = applyOperator(left, right, op);

    if (raw === "ERR" || exceedsMaxDigits(raw)) {
      this._setError();
      return null;
    }

    const maxDecimals = Math.max(
      countDecimalPlaces(String(leftStr ?? left)),
      countDecimalPlaces(String(rightStr ?? right))
    );

    return formatResult(raw, maxDecimals);
  }

  _setError() {
    this.state.hasError = true;
    this.state.display = "ERR";
    this.state.currentValue = "0";
    this.state.previousValue = null;
    this._previousValueStr = null;
    this.state.operator = null;
    this.state.waitingForOperand = false;
    this.state.lastAction = "equals";
  }

  clearAll() {
    this.state = createInitialState();
    this._previousValueStr = null;
    this.state.lastAction = "clear";
  }

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
      this._previousValueStr = null;
      this.state.waitingForOperand = false;
      this.state.lastAction = "clear";
      return;
    }

    this.state.currentValue = "0";
    this.state.display = "0";
    this.state.lastAction = "clear";
  }

  /**
   * Lesson 4: +/- toggles sign of the number being entered
   */
  toggleSign() {
    if (this.state.hasError) {
      this.clearAll();
      return;
    }

    if (this.state.waitingForOperand) {
      this.state.currentValue = "-0";
      this.state.waitingForOperand = false;
    } else if (this.state.currentValue.startsWith("-")) {
      const unsigned = this.state.currentValue.slice(1);
      this.state.currentValue = unsigned === "0" ? "0" : unsigned;
    } else if (this.state.currentValue === "0") {
      this.state.currentValue = "-0";
    } else {
      this.state.currentValue = "-" + this.state.currentValue;
    }

    this.state.display = this.state.currentValue;
    this.state.lastAction = "digit";
  }

  /**
   * Lesson 4: decimal point — up to 3 places per number
   */
  inputDecimal() {
    if (this.state.hasError) {
      this.clearAll();
    }

    if (this.state.waitingForOperand) {
      this.state.currentValue = "0.";
      this.state.waitingForOperand = false;
    } else if (!this.state.currentValue.includes(".")) {
      this.state.currentValue += ".";
    }

    this.state.display = this.state.currentValue;
    this.state.lastAction = "digit";
  }
}
