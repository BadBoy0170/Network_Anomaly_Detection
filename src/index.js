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

    // Extract features
    console.log('Extracting features...');
    const basicFeatures = featureExtractor.extractFeatures(packets);
    const tlsFeatures = tlsFeatureExtractor.extractTLSFeatures(packets);
    
    const features = {
      ...basicFeatures,
      ...tlsFeatures
    };

    // Train models first
    console.log('Training models...');
    await Promise.all([
      svmModel.train([features]),
      kmeansModel.train([features])
    ]);

    // Then detect anomalies
    console.log('Analyzing traffic for anomalies...');
    const results = await Promise.all([
      anomalyDetector.detectAnomalies(features),
      svmModel.predict(features),
      kmeansModel.predict(features)
    ]);

    // Visualize results
    console.log('Generating visualization...');
    visualizer.visualizeAnomalies({
      autoencoder: results[0],
      svm: results[1],
      kmeans: results[2],
      features
    });

  } catch (error) {
    console.error('Error in anomaly detection:', error);
    process.exit(1);
  }
}

main();