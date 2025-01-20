import { calculateEntropy } from '../utils/entropy.js';
import { calculateStats } from '../utils/statistics.js';

export class FeatureExtractor {
  extractFeatures(packets) {
    const features = {
      packetSizes: [],
      interArrivalTimes: [],
      flowDuration: 0,
      totalBytes: 0,
      packetCount: packets.length
    };

    // Extract basic features
    for (let i = 0; i < packets.length; i++) {
      features.packetSizes.push(packets[i].size);
      features.totalBytes += packets[i].size;

      if (i > 0) {
        const interArrivalTime = packets[i].timestamp - packets[i-1].timestamp;
        features.interArrivalTimes.push(interArrivalTime);
      }
    }

    // Calculate statistical features
    const stats = calculateStats(features.packetSizes);
    const entropy = calculateEntropy(features.packetSizes);

    return {
      ...features,
      ...stats,
      entropy
    };
  }
}