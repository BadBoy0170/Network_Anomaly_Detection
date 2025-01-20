export class Visualizer {
  visualizeAnomalies(anomalyResults) {
    console.log('\nAnomaly Detection Results:');
    console.log('-------------------------');
    console.log(`Anomaly Detected: ${anomalyResults.isAnomaly}`);
    console.log(`Anomaly Score: ${anomalyResults.score.toFixed(4)}`);
    console.log('\nFeature Statistics:');
    console.log(`Mean Packet Size: ${anomalyResults.features.mean.toFixed(2)} bytes`);
    console.log(`Standard Deviation: ${anomalyResults.features.stdDev.toFixed(2)}`);
    console.log(`Entropy: ${anomalyResults.features.entropy.toFixed(4)}`);
    console.log(`Total Packets: ${anomalyResults.features.packetCount}`);
    console.log(`Total Bytes: ${anomalyResults.features.totalBytes}`);
  }
}