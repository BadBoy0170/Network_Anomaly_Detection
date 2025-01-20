import * as tf from '@tensorflow/tfjs';

export class AutoencoderModel {
  constructor(inputDim) {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [inputDim], units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: inputDim })
      ]
    });
  }

  async train(tensor, epochs = 50) {
    await this.model.compile({
      optimizer: 'adam',
      loss: 'meanSquaredError'
    });

    await this.model.fit(tensor, tensor, {
      epochs,
      batchSize: 32,
      shuffle: true,
      verbose: 0
    });
  }

  predict(tensor) {
    return this.model.predict(tensor);
  }
}