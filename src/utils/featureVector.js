export function createFeatureVector(feature) {
  return [
    feature.mean,
    feature.stdDev,
    feature.entropy,
    feature.totalBytes,
    feature.packetCount
  ];
}

export function normalizeFeatures(features) {
  const featureArray = Array.isArray(features) ? features : [features];
  return featureArray.map(createFeatureVector);
}