import { expect, test } from 'vitest';
import { FeatureExtractor } from '../features/featureExtractor.js';

test('extracts features from packet data', () => {
  const extractor = new FeatureExtractor();
  const testPackets = [
    { timestamp: 1000, size: 100 },
    { timestamp: 1200, size: 150 },
    { timestamp: 1500, size: 120 }
  ];

  const features = extractor.extractFeatures(testPackets);

  expect(features.packetCount).toBe(3);
  expect(features.totalBytes).toBe(370);
  expect(features.packetSizes).toEqual([100, 150, 120]);
  expect(features.interArrivalTimes).toEqual([200, 300]);
});