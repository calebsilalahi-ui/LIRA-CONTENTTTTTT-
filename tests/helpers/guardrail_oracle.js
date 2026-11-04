/**
 * Guardrail Oracle - Authoritative Specification-Driven Validator
 * Implements Interface Contract from PROJECT.md:
 * - validateContent({ script, caption, overlays, hookText })
 * Throws GuardrailError on any violation.
 */

const { GUARDRAILS } = require('./test_constants');

class GuardrailError extends Error {
  constructor(message, violations = []) {
    super(message);
    this.name = 'GuardrailError';
    this.violations = violations;
  }
}

/**
 * Scan a single string for all guardrail violations
 */
function scanString(str, fieldName = 'content') {
  if (!str || typeof str !== 'string') return [];
  const violations = [];

  // 1. Numeric Scarcity / Bottle Count
  const bottleMatch = str.match(GUARDRAILS.BOTTLE_COUNT_REGEX);
  if (bottleMatch) {
    violations.push({
      rule: 'NUMERIC_SCARCITY',
      field: fieldName,
      match: bottleMatch[0],
      detail: 'Exact bottle count is strictly prohibited. Use "limited batch" or "stok terbatas".',
    });
  }

  // 2. Exact Stevia Dosage
  const steviaMatch = str.match(GUARDRAILS.STEVIA_DOSAGE_REGEX);
  if (steviaMatch) {
    violations.push({
      rule: 'EXACT_STEVIA_DOSAGE',
      field: fieldName,
      match: steviaMatch[0],
      detail: 'Exact stevia dosage (drops/ml/g) is prohibited. Mention conceptual "pemanis alami stevia".',
    });
  }

  // 3. School Names
  const schoolMatch = str.match(GUARDRAILS.SCHOOL_NAMES_REGEX);
  if (schoolMatch) {
    violations.push({
      rule: 'PRIVATE_SCHOOL_NAME',
      field: fieldName,
      match: schoolMatch[0],
      detail: 'Private school names (UPH, Baranangsiang, etc.) are strictly prohibited.',
    });
  }

  // 4. Financial & Capital Leaks
  const financialMatch = str.match(GUARDRAILS.FINANCIALS_REGEX);
  if (financialMatch) {
    violations.push({
      rule: 'FINANCIAL_LEAK',
      field: fieldName,
      match: financialMatch[0],
      detail: 'Internal financials, margins, COGS, and revenue figures are strictly prohibited.',
    });
  }

  // 5. Banned Terms (ceremonial, WithUs, JBD, Jakarta Bubble Drink)
  const bannedMatch = str.match(GUARDRAILS.BANNED_TERMS_REGEX);
  if (bannedMatch) {
    violations.push({
      rule: 'BANNED_TERMS',
      field: fieldName,
      match: bannedMatch[0],
      detail: 'Banned terms detected (ceremonial matcha, WithUs, JBD, Jakarta Bubble Drink).',
    });
  }

  // 6. Unicode Emojis
  const emojiMatch = str.match(GUARDRAILS.EMOJI_REGEX);
  if (emojiMatch) {
    violations.push({
      rule: 'EMOJI_DETECTED',
      field: fieldName,
      match: emojiMatch[0],
      detail: 'Unicode emojis are strictly forbidden in Lira content and overlays.',
    });
  }

  return violations;
}

/**
 * Validate content object against all guardrail rules.
 * Throws GuardrailError if violations are found.
 */
function validateContent(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new GuardrailError('Invalid content payload provided to guardrail gate.');
  }

  const allViolations = [];

  if (payload.script) {
    allViolations.push(...scanString(payload.script, 'script'));
  }
  if (payload.caption) {
    allViolations.push(...scanString(payload.caption, 'caption'));
  }
  if (payload.hookText) {
    allViolations.push(...scanString(payload.hookText, 'hookText'));
  }
  if (payload.verbalHook || payload.verbal_hook) {
    allViolations.push(...scanString(payload.verbalHook || payload.verbal_hook, 'verbalHook'));
  }
  if (payload.writtenHook || payload.written_hook) {
    allViolations.push(...scanString(payload.writtenHook || payload.written_hook, 'writtenHook'));
  }
  if (payload.topic) {
    allViolations.push(...scanString(payload.topic, 'topic'));
  }
  if (Array.isArray(payload.overlays)) {
    payload.overlays.forEach((ov, idx) => {
      allViolations.push(...scanString(typeof ov === 'string' ? ov : JSON.stringify(ov), `overlays[${idx}]`));
    });
  }
  if (Array.isArray(payload.slides)) {
    payload.slides.forEach((slide, idx) => {
      allViolations.push(...scanString(typeof slide === 'string' ? slide : JSON.stringify(slide), `slides[${idx}]`));
    });
  }

  if (allViolations.length > 0) {
    const errorMsg = `Guardrail validation failed: ${allViolations.map(v => `${v.rule} in ${v.field} ("${v.match}")`).join('; ')}`;
    throw new GuardrailError(errorMsg, allViolations);
  }

  return { valid: true, violations: [] };
}

/**
 * Soft scan that returns results without throwing
 */
function checkContentSafe(payload) {
  try {
    return validateContent(payload);
  } catch (err) {
    if (err instanceof GuardrailError) {
      return { valid: false, violations: err.violations };
    }
    throw err;
  }
}

module.exports = {
  GuardrailError,
  validateContent,
  checkContentSafe,
  scanString,
};
