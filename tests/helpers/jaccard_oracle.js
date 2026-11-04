/**
 * Jaccard Similarity Oracle
 * Mathematical authoritative implementation for Bigram Jaccard Similarity.
 * PROJECT.md requirement: pairwise bigram Jaccard similarity < 0.30 across all hooks and scripts.
 */

function tokenize(text) {
  if (!text || typeof text !== 'string') return [];
  // Normalize, lowercase, strip punctuation
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function getWordBigrams(text) {
  const words = tokenize(text);
  if (words.length < 2) {
    // If fewer than 2 words, return single word unigram fallback
    return new Set(words);
  }
  const bigrams = new Set();
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.add(`${words[i]} ${words[i + 1]}`);
  }
  return bigrams;
}

function computeBigramJaccard(textA, textB) {
  const bigramsA = getWordBigrams(textA);
  const bigramsB = getWordBigrams(textB);

  if (bigramsA.size === 0 && bigramsB.size === 0) return 1.0;
  if (bigramsA.size === 0 || bigramsB.size === 0) return 0.0;

  let intersectionCount = 0;
  for (const bg of bigramsA) {
    if (bigramsB.has(bg)) {
      intersectionCount++;
    }
  }

  const unionSize = bigramsA.size + bigramsB.size - intersectionCount;
  return unionSize === 0 ? 0 : intersectionCount / unionSize;
}

/**
 * Validates that all pairwise bigram Jaccard similarities in an array of texts
 * are strictly below the maximum allowed threshold (default 0.30).
 */
function validatePairwiseJaccard(textList, maxThreshold = 0.30) {
  const pairs = [];
  let maxObserved = 0;
  let passed = true;

  for (let i = 0; i < textList.length; i++) {
    for (let j = i + 1; j < textList.length; j++) {
      const similarity = computeBigramJaccard(textList[i], textList[j]);
      if (similarity > maxObserved) maxObserved = similarity;
      const isExceeded = similarity >= maxThreshold;
      if (isExceeded) passed = false;

      pairs.push({
        indexA: i,
        indexB: j,
        similarity,
        passed: !isExceeded,
      });
    }
  }

  return {
    passed,
    maxObserved,
    threshold: maxThreshold,
    totalComparisons: pairs.length,
    pairs,
  };
}

module.exports = {
  tokenize,
  getWordBigrams,
  computeBigramJaccard,
  validatePairwiseJaccard,
};
