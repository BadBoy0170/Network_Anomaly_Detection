export class TLSFeatureExtractor {
  extractTLSFeatures(packets) {
    const tlsHandshakes = packets.filter(p => p.isTLS);
    
    return {
      handshakeCount: tlsHandshakes.length,
      avgHandshakeSize: this.calculateAverage(tlsHandshakes.map(p => p.size)),
      handshakePattern: this.extractHandshakePattern(tlsHandshakes),
      certificateCount: this.countCertificates(tlsHandshakes)
    };
  }

  extractHandshakePattern(tlsPackets) {
    // Simplified pattern extraction
    return tlsPackets.map(p => ({
      size: p.size,
      timestamp: p.timestamp
    }));
  }

  countCertificates(tlsPackets) {
    // Count certificate messages in TLS handshakes
    return tlsPackets.filter(p => 
      p.data[0] === 0x16 && // Handshake
      p.data[5] === 0x0b    // Certificate
    ).length;
  }

  calculateAverage(values) {
    return values.length > 0 
      ? values.reduce((a, b) => a + b, 0) / values.length 
      : 0;
  }
}