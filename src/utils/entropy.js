import { log2 } from 'mathjs';

export function calculateEntropy(values) {
  const frequencies = new Map();
  const n = values.length;

  // Calculate frequencies
  for (const value of values) {
    frequencies.set(value, (frequencies.get(value) || 0) + 1);
  }

  // Calculate entropy
  let entropy = 0;
  for (const count of frequencies.values()) {
    const probability = count / n;
    entropy -= probability * log2(probability);
  }

  return entropy;
}