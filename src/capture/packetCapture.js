import { MockPacketGenerator } from './mockPacketGenerator.js';

export class PacketCapture {
  constructor() {
    this.generator = new MockPacketGenerator();
  }

  startCapture() {
    return new Promise((resolve) => {
      console.log('Starting mock packet capture...');
      const packets = this.generator.generateTraffic();
      resolve(packets);
    });
  }
}