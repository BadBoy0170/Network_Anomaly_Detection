import pcapp from 'pcap-parser';

export class PcapReader {
  async readFile(filePath) {
    return new Promise((resolve, reject) => {
      const packets = [];
      const parser = pcapp.parse(filePath);

      parser.on('packet', (packet) => {
        packets.push(this.parsePacket(packet));
      });

      parser.on('end', () => {
        resolve(packets);
      });

      parser.on('error', (err) => {
        reject(err);
      });
    });
  }

  parsePacket(packet) {
    const header = packet.header;
    const data = packet.data;

    return {
      timestamp: header.timestamp_s * 1000 + header.timestamp_ms,
      size: data.length,
      data: data,
      protocol: this.detectProtocol(data),
      isTLS: this.isTLSTraffic(data)
    };
  }

  detectProtocol(data) {
    // Basic protocol detection based on common ports and patterns
    // This is a simplified version - expand based on your needs
    if (data[13] === 0x16 && data[14] === 0x03) {
      return 'TLS';
    }
    return 'UNKNOWN';
  }

  isTLSTraffic(data) {
    // Check for TLS handshake
    return data[13] === 0x16 && data[14] === 0x03;
  }
}