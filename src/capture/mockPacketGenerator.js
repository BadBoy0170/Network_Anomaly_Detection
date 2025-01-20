export class MockPacketGenerator {
  constructor() {
    this.normalPatterns = {
      sizes: [64, 128, 256, 512, 1024],
      intervals: [10, 20, 30, 40, 50]
    };
  }

  generatePacket(timestamp, isAnomaly = false) {
    // Generate packet size with some randomness
    const baseSize = this.normalPatterns.sizes[
      Math.floor(Math.random() * this.normalPatterns.sizes.length)
    ];
    
    const size = isAnomaly 
      ? baseSize * (3 + Math.random() * 2) // Anomalous packets are 3-5x larger
      : baseSize * (0.8 + Math.random() * 0.4); // Normal variation ±20%

    return {
      timestamp,
      size: Math.floor(size),
      protocol: 'TCP',
      flags: {
        syn: false,
        ack: true,
        fin: false
      }
    };
  }

  generateTraffic(duration = 60000, anomalyProbability = 0.05) {
    const packets = [];
    let currentTime = Date.now();
    
    while (currentTime < Date.now() + duration) {
      const isAnomaly = Math.random() < anomalyProbability;
      
      // Generate packet
      packets.push(this.generatePacket(currentTime, isAnomaly));
      
      // Advance time with some randomness
      const interval = this.normalPatterns.intervals[
        Math.floor(Math.random() * this.normalPatterns.intervals.length)
      ];
      currentTime += interval * (0.8 + Math.random() * 0.4);
    }
    
    return packets;
  }
}