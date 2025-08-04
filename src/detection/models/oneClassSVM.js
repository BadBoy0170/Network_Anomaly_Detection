export class OneClassSVMModel {
  constructor(gamma = 0.5, nu = 0.1) {
    this.gamma = gamma;
    this.nu = nu;
    this.trainingData = [];
    this.min = [];
    this.max = [];
    this.threshold = null;
  }

  async train(features) {
    if (!Array.isArray(features) || features.length === 0) {
      throw new Error('Features must be a non-empty array');
    }

    let prepared = this.prepareFeatures(features);
    
    // Generate synthetic points
    const syntheticPoints = this.generateSyntheticPoints(prepared[0], 3);
    
    // Combine
    prepared = [...prepared, ...syntheticPoints];
    
    // Find min/max for each dimension
    const dim = prepared[0].length;
    this.min = new Array(dim).fill(Infinity);
    this.max = new Array(dim).fill(-Infinity);
    
    prepared.forEach(point => {
      point.forEach((val, i) => {
        if (val < this.min[i]) this.min[i] = val;
        if (val > this.max[i]) this.max[i] = val;
      });
    });
    
    // Normalize to [0,1]
    this.trainingData = prepared.map(point => 
      point.map((val, i) => {
        const range = this.max[i] - this.min[i];
        return range > 0 ? (val - this.min[i]) / range : 0.5;  // Use 0.5 if no range
      })
    );
    
    // Calculate distances between all points
    const distances = [];
    for (let i = 0; i < this.trainingData.length; i++) {
      for (let j = i + 1; j < this.trainingData.length; j++) {
        distances.push(this.rbfKernel(this.trainingData[i], this.trainingData[j]));
      }
    }
    
    // Set threshold based on nu-percentile of distances
    if (distances.length > 0) {
      distances.sort((a, b) => a - b);
      const thresholdIndex = Math.floor(this.nu * distances.length);
      this.threshold = distances[thresholdIndex];
    } else {
      // Fallback threshold
      this.threshold = 0.5;
    }
  }

  generateSyntheticPoints(basePoint, count) {
    const points = [];
    for (let i = 0; i < count; i++) {
      // Create anomalous points by scaling the base point
      const scale = 2 + Math.random() * 3; // Scale between 2x and 5x
      points.push(basePoint.map(val => val * scale));
    }
    return points;
  }

  predict(features) {
    if (this.threshold === null) {
      throw new Error('Model must be trained before prediction');
    }

    const prepared = this.prepareFeatures([features])[0];
    
    // Normalize using training min/max
    const testPoint = prepared.map((val, i) => {
      const range = this.max[i] - this.min[i];
      return range > 0 ? (val - this.min[i]) / range : 0.5;
    });
    
    // Calculate minimum distance to training points
    const minDistance = Math.min(...this.trainingData.map(point => 
      this.rbfKernel(testPoint, point)
    ));

    // Point is anomaly if distance is LESS than threshold (since RBF is similarity)
    // Wait, in one-class SVM, typically decision is based on sign, but here since custom
    // Actually in this impl, original was minDistance > threshold for anomaly
    // But since RBF is similarity, higher RBF means closer, so anomaly if min similarity < some threshold
    // Original: return minDistance > this.threshold; but that would be if threshold is small, but earlier threshold is high percentile, large value
    // Wait, let's adjust
    // Since threshold is (1-nu) percentile, which is high value (large similarity)
    // If minDistance < threshold, it's far from all, anomaly
    // No, large minDistance means close to some point (high similarity)
    // Small minDistance means far from all (low min similarity)
    // So anomaly if minDistance < some low threshold
    // But in code, the threshold is high percentile, large value.
    // So to detect anomaly if minDistance < threshold, but since threshold large, most would be <, always anomaly.
    // Perhaps it's inverted.
    // For simplicity, since it's custom, let's change to return minDistance < this.threshold;
    // Since threshold is high, if min < high, yes, if very small, anomaly.
    // But if all close, min high > threshold? No.
    // Perhaps change the percentile to nu * length, low percentile.
    // Let's set threshold to distances[ low index ]
    // Change to const thresholdIndex = Math.floor(this.nu * distances.length);
    // threshold = distances[thresholdIndex]; // small value
    // Then anomaly if minDistance < threshold
    // Yes, if min similarity < small threshold, anomaly.
    // That makes sense.
    // Also, change the predict condition to this.threshold !== null

    return minDistance < this.threshold;
  }

  rbfKernel(x1, x2) {
    const squaredDistance = x1.reduce((sum, val, i) => 
      sum + Math.pow(val - x2[i], 2), 0
    );
    return Math.exp(-this.gamma * squaredDistance);
  }

  prepareFeatures(features) {
    return features.map(feature => [
      feature.mean || 0,
      feature.stdDev || 0,
      feature.entropy || 0,
      feature.totalBytes || 0,
      feature.packetCount || 0
    ]);
  }
}