import * as tf from '@tensorflow/tfjs';
import { AutoencoderModel } from './models/autoencoder.js';

export class AnomalyDetector {
  constructor() {
    this.model = null;
    this.threshold = 0.95;
  }

  async detectAnomalies(features) {
    const tensor = this.featuresToTensor(features);
    
    if (!this.model) {
      this.model = new AutoencoderModel(tensor.shape[1]);
      await this.model.train(tensor);
    }

    const predictions = this.model.predict(tensor);
    const scores = await predictions.data();

    return {
      isAnomaly: scores[0] > this.threshold,
      score: scores[0],
      features
    };
  }

  featuresToTensor(features) {
    const featureArray = [
      features.mean,
      features.stdDev,
      features.entropy,
      features.totalBytes,
      features.packetCount
    ];

    return tf.tensor2d([featureArray]);
  }
}