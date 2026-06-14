/**
 * Calculator Logic — Lesson 1b
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

class Calculator {
  constructor() {
    this.state = createInitialState();
  }

  getDisplay() {
    return this.state.display;
  }

  /**
   * Lesson 1b: digit entry
   * - Start fresh after an operator (= waitingForOperand)
   * - Replace leading "0" unless we're building "0."
   * - Ignore input beyond 8 digits (spec requirement)
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
    // else: silently ignore — already at 8 digits

    this.state.display = this.state.currentValue;
    this.state.lastAction = "digit";
  }

  /**
   * Lesson 1b: AC (clear all) — fully resets the calculator
   */
  clearAll() {
    this.state = createInitialState();
    this.state.lastAction = "clear";
  }

  // --- Stubs for upcoming lessons ---

  inputOperator() {
    // Lesson 2
  }

  inputEquals() {
    // Lesson 2
  }

  clearEntry() {
    // Lesson 3
  }

  toggleSign() {
    // Lesson 4 (bonus)
  }

  inputDecimal() {
    // Lesson 4 (bonus)
  }
}
