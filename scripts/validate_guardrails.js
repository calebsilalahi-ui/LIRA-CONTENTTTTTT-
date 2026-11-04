#!/usr/bin/env node
/**
 * Lira Guardrail Gate - Authoritative Programmatic Content Validator
 * Authoritative source: PROJECT.md & ORIGINAL_REQUEST.md §R4
 * 
 * Enforces strict pre-flight brand, confidentiality, and anti-leak validation:
 * 1. Strictly non-numeric scarcity (rejects exact bottle counts, allows "limited batch", "stok terbatas", "3–4 botol", "4-Pack")
 * 2. Conceptual stevia only (rejects exact drops/ml/g measurements)
 * 3. Zero private school names (UPH, UPHC, UPH College, Baranangsiang, Barsih, SMK Baranangsiang)
 * 4. Zero private entities & suppliers (WithUs, JBD, Jakarta Bubble Drink)
 * 5. Zero internal financials (HPP, COGS, margin, 20% fee, War Chest, CapEx, 500M, 21M, 8.6M, 74%, 66%)
 * 6. Zero banned claims ("ceremonial" matcha)
 * 7. Zero rendered emojis in captions, hooks, and overlays
 */

class GuardrailError extends Error {
  constructor(message, violations = []) {
    super(message);
    this.name = 'GuardrailError';
    this.violations = violations;
  }
}

// Guardrail Rule Definitions
const GUARDRAIL_RULES = {
  // 1. Numeric Scarcity / Exact Bottle Counts:
  // Strictly rejects exact bottle counts (numeric digits or spelled-out Indonesian numbers: "42 botol", "empat puluh dua botol", "50 botol", "lima puluh botol", "100 botol", "seratus botol", etc.).
  // Strictly allows non-numeric scarcity ("limited batch", "stok terbatas", "batch terbatas") and multipacks ("3–4 botol", "3-4 botol", "4-Pack").
  BOTTLE_COUNT: /(?<![-–—\d]\s*)\b(?:\d+|(?:(?:dua|tiga|empat|lima|enam|tujuh|delapan|sembilan)\s*puluh(?:\s*(?:satu|dua|tiga|empat|lima|enam|tujuh|delapan|sembilan))?|(?:dua|tiga|empat|lima|enam|tujuh|delapan|sembilan)\s*belas|sebelas|sepuluh|seratus|seribu|(?:dua|tiga|empat|lima|enam|tujuh|delapan|sembilan)\s*ratus|satu|dua|tiga|empat|lima|enam|tujuh|delapan|sembilan))\s*(?:botol|pcs|bottle)\b/i,

  // 2. Exact Stevia Dosages:
  // Strictly rejects specific drops/grams/ml ("2 tetes stevia", "dua tetes", "5ml stevia", "3 gram daun stevia").
  // Allows conceptual terms ("natural stevia drops", "pemanis alami stevia", "ekstrak daun stevia").
  STEVIA_DOSAGE: /\b(?:\d+(?:\.\d+)?|dua|tiga|satu)\s*(?:tetes|ml|gram|g)\s*(?:daun\s*|ekstrak\s*)?stevia\b/i,
  STEVIA_EXTRA: /\b(?:\d+(?:\.\d+)?|dua|tiga|satu)\s*tetes\s*(?:ekstrak\s+murni|daun\s*stevia)\b/i,

  // 3. Private School & Institution Names
  SCHOOL_NAMES: /\b(UPH|UPHC|UPH College|Baranangsiang|Barsih|SMK Baranangsiang)\b/i,

  // 4. Internal Financials, Margins, and Capital Figures
  FINANCIALS: /\b(Rp500M|Rp21M|Rp8\.6M|500M|21M|8\.6M|War Chest|CapEx(?:\s*Reserve)?|HPP|COGS|margin|20%\s*fee|74%|66%)\b/i,

  // 5. Banned Terms & Suppliers (ceremonial matcha, WithUs, JBD, Jakarta Bubble Drink)
  BANNED_TERMS: /\b(ceremonial|WithUs|JBD|Jakarta Bubble Drink)\b/i,

  // 6. Unicode Emojis
  EMOJI: /(?:\p{Extended_Pictographic}|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\uD83E[\uDD00-\uDDFF])/u,
};

/**
 * Scan a single string for all guardrail violations
 */
function scanString(str, fieldName = 'content') {
  if (!str || typeof str !== 'string') return [];
  const violations = [];

  // 1. Numeric Scarcity / Exact Bottle Count
  const bottleMatch = str.match(GUARDRAIL_RULES.BOTTLE_COUNT);
  if (bottleMatch) {
    violations.push({
      rule: 'NUMERIC_SCARCITY',
      field: fieldName,
      match: bottleMatch[0],
      detail: 'Exact bottle count is strictly prohibited. Use "limited batch" or "stok terbatas".',
    });
  }

  // 2. Exact Stevia Dosage
  const steviaMatch = str.match(GUARDRAIL_RULES.STEVIA_DOSAGE) || str.match(GUARDRAIL_RULES.STEVIA_EXTRA);
  if (steviaMatch) {
    violations.push({
      rule: 'EXACT_STEVIA_DOSAGE',
      field: fieldName,
      match: steviaMatch[0],
      detail: 'Exact stevia dosage (drops/ml/g) is prohibited. Mention conceptual "pemanis alami stevia".',
    });
  }

  // 3. School Names
  const schoolMatch = str.match(GUARDRAIL_RULES.SCHOOL_NAMES);
  if (schoolMatch) {
    violations.push({
      rule: 'PRIVATE_SCHOOL_NAME',
      field: fieldName,
      match: schoolMatch[0],
      detail: 'Private school names (UPH, Baranangsiang, etc.) are strictly prohibited.',
    });
  }

  // 4. Financial & Capital Leaks
  const financialMatch = str.match(GUARDRAIL_RULES.FINANCIALS);
  if (financialMatch) {
    violations.push({
      rule: 'FINANCIAL_LEAK',
      field: fieldName,
      match: financialMatch[0],
      detail: 'Internal financials, margins, COGS, and revenue figures are strictly prohibited.',
    });
  }

  // 5. Banned Terms (ceremonial, WithUs, JBD, Jakarta Bubble Drink)
  const bannedMatch = str.match(GUARDRAIL_RULES.BANNED_TERMS);
  if (bannedMatch) {
    violations.push({
      rule: 'BANNED_TERMS',
      field: fieldName,
      match: bannedMatch[0],
      detail: 'Banned terms detected (ceremonial matcha, WithUs, JBD, Jakarta Bubble Drink).',
    });
  }

  // 6. Unicode Emojis
  const emojiMatch = str.match(GUARDRAIL_RULES.EMOJI);
  if (emojiMatch) {
    violations.push({
      rule: 'EMOJI_DETECTED',
      field: fieldName,
      match: emojiMatch[0],
      detail: 'Unicode emojis are strictly forbidden in Lira content, captions, and overlays.',
    });
  }

  return violations;
}

/**
 * Validate content object against all guardrail rules.
 * Throws GuardrailError if violations are found.
 * Accepts { script, caption, overlays, hookText, verbal_hook, written_hook, topic, slides } or a string.
 */
function validateContent(payload) {
  if (typeof payload === 'string') {
    return validateContent({ script: payload });
  }

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
      const textToScan = typeof ov === 'string' ? ov : (ov && ov.text) ? ov.text : JSON.stringify(ov);
      allViolations.push(...scanString(textToScan, `overlays[${idx}]`));
    });
  }
  if (Array.isArray(payload.slides)) {
    payload.slides.forEach((slide, idx) => {
      if (typeof slide === 'string') {
        allViolations.push(...scanString(slide, `slides[${idx}]`));
      } else if (slide && typeof slide === 'object') {
        if (slide.headline) allViolations.push(...scanString(slide.headline, `slides[${idx}].headline`));
        if (slide.subhead) allViolations.push(...scanString(slide.subhead, `slides[${idx}].subhead`));
        if (slide.body) allViolations.push(...scanString(slide.body, `slides[${idx}].body`));
      }
    });
  }

  if (allViolations.length > 0) {
    const errorMsg = `Guardrail validation failed: ${allViolations.map(v => `${v.rule} in ${v.field} ("${v.match}")`).join('; ')}`;
    throw new GuardrailError(errorMsg, allViolations);
  }

  return { valid: true, violations: [] };
}

/**
 * String or payload validator alias
 */
function validateGuardrails(textOrPayload) {
  if (typeof textOrPayload === 'string') {
    return validateContent({ script: textOrPayload });
  }
  return validateContent(textOrPayload);
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
  validateGuardrails,
  checkContentSafe,
  scanString,
  GUARDRAILS: {
    BOTTLE_COUNT_REGEX: GUARDRAIL_RULES.BOTTLE_COUNT,
    STEVIA_DOSAGE_REGEX: GUARDRAIL_RULES.STEVIA_DOSAGE,
    SCHOOL_NAMES_REGEX: GUARDRAIL_RULES.SCHOOL_NAMES,
    FINANCIALS_REGEX: GUARDRAIL_RULES.FINANCIALS,
    BANNED_TERMS_REGEX: GUARDRAIL_RULES.BANNED_TERMS,
    EMOJI_REGEX: GUARDRAIL_RULES.EMOJI,
  },
};
