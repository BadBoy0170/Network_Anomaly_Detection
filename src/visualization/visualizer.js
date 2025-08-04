export class Visualizer {
  visualizeAnomalies(data) {
    console.log('\n🎯 Anomaly Detection Results:');
    console.log('================================');
    
    if (!data || !data.results) {
      console.log('❌ No results to display');
      return;
    }
    
    const results = data.results;
    
    console.log('\n🤖 Model Results:');
    results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.type.toUpperCase()} Model:`);
      
      if (result.error) {
        console.log(`   ❌ Error: ${result.error}`);
      } else {
        const status = result.isAnomaly ? '🚨 ANOMALY DETECTED' : '✅ Normal Traffic';
        const score = typeof result.score === 'number' ? result.score.toFixed(4) : 'N/A';
        console.log(`   ${status}`);
        console.log(`   Confidence Score: ${score}`);
      }
    });
    
    // Additional stats if available
    if (data.features) {
      console.log('\n📊 Feature Statistics:');
      console.log(`   Mean Packet Size: ${(data.features.mean || 0).toFixed(2)} bytes`);
      console.log(`   Standard Deviation: ${(data.features.stdDev || 0).toFixed(2)}`);
      console.log(`   Entropy: ${(data.features.entropy || 0).toFixed(4)}`);
      console.log(`   Total Packets: ${data.features.packetCount || 0}`);
      console.log(`   Total Bytes: ${data.features.totalBytes || 0}`);
    }
  }
}
