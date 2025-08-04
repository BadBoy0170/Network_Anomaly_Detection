import { PacketCapture } from './capture/packetCapture.js';
import { PcapReader } from './capture/pcapReader.js';
import { FeatureExtractor } from './features/featureExtractor.js';
import { TLSFeatureExtractor } from './features/tlsFeatureExtractor.js';
import { AnomalyDetector } from './detection/anomalyDetector.js';
import { OneClassSVMModel } from './detection/models/oneClassSVM.js';
import { KMeansModel } from './detection/models/kMeans.js';
import { Visualizer } from './visualization/visualizer.js';

async function main() {
  const args = process.argv.slice(2);
  const pcapFile = args[0];

  // Initialize components
  const featureExtractor = new FeatureExtractor();
  const tlsFeatureExtractor = new TLSFeatureExtractor();
  const anomalyDetector = new AnomalyDetector();
  const svmModel = new OneClassSVMModel();
  const kmeansModel = new KMeansModel();
  const visualizer = new Visualizer();

  try {
    let packets;
    
    if (pcapFile) {
      // Read from PCAP file
      console.log(`Reading PCAP file: ${pcapFile}`);
      const pcapReader = new PcapReader();
      packets = await pcapReader.readFile(pcapFile);
    } else {
      // Use mock packet capture
      console.log('Starting mock packet capture...');
      const packetCapture = new PacketCapture();
      packets = await packetCapture.startCapture();
    }

    if (!packets || packets.length === 0) {
      throw new Error('No packets captured or loaded');
    }

    console.log(`Captured ${packets.length} packets`);

    // Extract features
    console.log('Extracting features...');
    const basicFeatures = featureExtractor.extractFeatures(packets);
    const tlsFeatures = tlsFeatureExtractor.extractTLSFeatures(packets);
    
    const features = {
      ...basicFeatures,
      ...tlsFeatures
    };

    console.log('Features extracted:', Object.keys(features));

    // Train models with proper error handling
    console.log('Training models...');
    
    // Prepare training data
    const trainingData = [features];
    
    // Train SVM model
    try {
      await svmModel.train(trainingData);
      console.log('SVM model trained successfully');
    } catch (error) {
      console.warn('SVM training failed:', error.message);
    }

    // Train KMeans model
    try {
      await kmeansModel.train(trainingData);
      console.log('KMeans model trained successfully');
    } catch (error) {
      console.warn('KMeans training failed:', error.message);
    }

    // Detect anomalies with error handling
    console.log('Analyzing traffic for anomalies...');
    const results = [];
    
    // Autoencoder detection
    try {
      const autoencoderResult = await anomalyDetector.detectAnomalies(features);
      results.push({ type: 'autoencoder', ...autoencoderResult });
    } catch (error) {
      console.warn('Autoencoder detection failed:', error.message);
      results.push({ type: 'autoencoder', error: error.message });
    }

    // SVM detection
    try {
      const svmResult = svmModel.predict(features);
      results.push({ type: 'svm', isAnomaly: svmResult, score: svmResult ? 1 : 0 });
    } catch (error) {
      console.warn('SVM detection failed:', error.message);
      results.push({ type: 'svm', error: error.message });
    }

    // KMeans detection
    try {
      const kmeansResult = kmeansModel.predict(features);
      results.push({ type: 'kmeans', isAnomaly: kmeansResult, score: kmeansResult ? 1 : 0 });
    } catch (error) {
      console.warn('KMeans detection failed:', error.message);
      results.push({ type: 'kmeans', error: error.message });
    }

    // Visualize results
    console.log('Generating visualization...');
    visualizer.visualizeAnomalies({
      results,
      features,
      packets
    });

    console.log('Analysis complete!');
    console.log('Results:', results);

  } catch (error) {
    console.error('Error in anomaly detection:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});