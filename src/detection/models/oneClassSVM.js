export class OneClassSVMModel {
  constructor(gamma = 0.5, nu = 0.1) {
    this.gamma = gamma;
    this.nu = nu;
    this.trainingData = [];
    this.threshold = null;
  }

  async train(features) {
    if (!Array.isArray(features) || features.length === 0) {
      throw new Error('Features must be a non-empty array');
    }

    // Store training data
    this.trainingData = this.prepareFeatures(features);
    
    // Generate synthetic anomalous points for better boundary estimation
    const syntheticPoints = this.generateSyntheticPoints(this.trainingData[0], 3);
    this.trainingData = [...this.trainingData, ...syntheticPoints];
    
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
      const thresholdIndex = Math.floor((1 - this.nu) * distances.length);
      this.threshold = distances[thresholdIndex];
    } else {
      // Fallback threshold if we don't have enough points
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
    if (!this.trainingData || !this.threshold) {
      throw new Error('Model must be trained before prediction');
    }

    const testPoint = this.prepareFeatures([features])[0];
    
    // Calculate minimum distance to training points
    const minDistance = Math.min(...this.trainingData.map(point => 
      this.rbfKernel(testPoint, point)
    ));

    // Point is anomaly if distance is greater than threshold
    return minDistance > this.threshold;
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