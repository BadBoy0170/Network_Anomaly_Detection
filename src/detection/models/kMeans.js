import KMeans from 'ml-kmeans';

export class KMeansModel {
  constructor(k = 2) {
    this.k = k;
    this.centroids = null;
    this.threshold = 2.0; // Distance threshold for anomaly
  }

  async train(features) {
    if (!Array.isArray(features) || features.length === 0) {
      throw new Error('Features must be a non-empty array');
    }

    // Ensure k is smaller than the number of data points
    this.k = Math.min(this.k, features.length);
    
    // Convert features to array of arrays format required by ml-kmeans
    const data = features.map(f => [
      f.mean || 0,
      f.stdDev || 0,
      f.entropy || 0,
      f.totalBytes || 0,
      f.packetCount || 0
    ]);

    // Generate some synthetic anomalous data points for better clustering
    const syntheticPoints = this.generateSyntheticPoints(data[0], 3);
    const trainingData = [...data, ...syntheticPoints];
    
    // Ensure k is valid for the expanded dataset
    this.k = Math.min(this.k, trainingData.length - 1);

    // Train KMeans model
    const result = new KMeans(trainingData, this.k);
    this.centroids = result.centroids;
    
    return result;
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
    if (!this.centroids) {
      throw new Error('Model must be trained before prediction');
    }

    const point = [
      features.mean || 0,
      features.stdDev || 0,
      features.entropy || 0,
      features.totalBytes || 0,
      features.packetCount || 0
    ];
    
    // Calculate minimum distance to any centroid
    const minDistance = Math.min(...this.centroids.map(centroid => 
      this.euclideanDistance(point, centroid)
    ));
    
    return minDistance > this.threshold;
  }

  euclideanDistance(point1, point2) {
    return Math.sqrt(
      point1.reduce((sum, val, i) => 
        sum + Math.pow(val - point2[i], 2), 0
      )
    );
  }
}