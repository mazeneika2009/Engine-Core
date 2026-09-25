import { resolveParams } from 'shared';

/** Tiny built-in lexicon — offline tone scoring, no API key required. */
const POSITIVE = new Set('love great excellent amazing awesome fantastic good best happy wonderful perfect brilliant outstanding superb delightful pleased glad thank'.split(' '));
const NEGATIVE = new Set('hate terrible awful horrible bad worst sad angry poor broken failed error bug crash slow useless disappointed refund complaint'.split(' '));
const NEGATORS = new Set(['not', 'no', 'never', 'hardly', 'barely']);

/**
 * engine.sentimentAnalysis — params: { text }.
 * Returns { sentiment: positive|neutral|negative, score (-1..1), hits }.
 */
export async function executeSentiment(rawParams, context) {
  const params = resolveParams(rawParams, context);
  const text = String(params.text ?? '');
  if (!text.trim()) throw Object.assign(new Error('Sentiment node requires "text"'), { code: 'NODE_MISSING_PARAM' });

  const words = text.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(Boolean);
  let positive = 0;
  let negative = 0;
  for (let index = 0; index < words.length; index += 1) {
    const word = words[index];
    const negated = index > 0 && NEGATORS.has(words[index - 1]);
    if (POSITIVE.has(word)) {
      if (negated) negative += 1;
      else positive += 1;
    } else if (NEGATIVE.has(word)) {
      if (negated) positive += 1;
      else negative += 1;
    }
  }
  const total = positive + negative;
  const score = total === 0 ? 0 : (positive - negative) / total;
  const sentiment = score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral';
  return { json: { sentiment, score: Math.round(score * 100) / 100, positive, negative } };
}

function splitSentences(text) {
  const matches = String(text).match(/[^.!?]+[.!?]+["']?|\S[^.!?]*$/g);
  return (matches || []).map((sentence) => sentence.trim()).filter(Boolean);
}

/**
 * engine.textSummarizer — extractive summarizer, offline.
 * params: { text, sentences (default 3) }.
 */
export async function executeSummarize(rawParams, context) {
  const params = resolveParams(rawParams, context);
  const text = String(params.text ?? '');
  if (!text.trim()) throw Object.assign(new Error('Summarizer requires "text"'), { code: 'NODE_MISSING_PARAM' });
  const count = Math.max(1, Math.min(10, Number(params.sentences ?? 3) || 3));

  const sentences = splitSentences(text);
  if (sentences.length <= count) return { json: { summary: text.trim(), sentences: sentences.length } };

  const frequencies = {};
  for (const word of text.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/)) {
    if (word.length > 3) frequencies[word] = (frequencies[word] || 0) + 1;
  }
  const scored = sentences.map((sentence, index) => {
    let score = 0;
    for (const word of sentence.toLowerCase().split(/\s+/)) {
      score += frequencies[word.replace(/[^a-z]/g, '')] || 0;
    }
    return { sentence, index, score: score / Math.max(1, sentence.split(/\s+/).length) };
  });
  scored.sort((a, b) => b.score - a.score);
  const picked = scored.slice(0, count).sort((a, b) => a.index - b.index);
  return {
    json: {
      summary: picked.map((item) => item.sentence).join(' '),
      sentences: picked.length,
      of: sentences.length,
    },
  };
}
