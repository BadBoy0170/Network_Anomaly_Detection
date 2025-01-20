export function calculateStats(values) {
  const n = values.length;
  if (n === 0) return {};

  const mean = values.reduce((a, b) => a + b, 0) / n;
  
  const variance = values.reduce((acc, val) => {
    const diff = val - mean;
    return acc + (diff * diff);
  }, 0) / n;

  return {
    mean,
    stdDev: Math.sqrt(variance),
    min: Math.min(...values),
    max: Math.max(...values)
  };
}