# Network Anomaly Detection System

A robust machine learning-based system for detecting anomalies in encrypted network traffic using Autoencoder, One-Class SVM, and K-Means clustering.

## 🚨 Recent Fixes

- **Resolved Stuck Execution**: Fixed by adding feature normalization in One-Class SVM to prevent kernel underflow.
- **Fixed Visualization Errors**: Updated visualizer to handle results properly with error checking.
- **Improved Model Training**: Ensured models train with normalized data and proper thresholds.
- **Performance Note**: TensorFlow.js Node backend installation may fail if project path has spaces. See installation section.

##  Quick Start

### Prerequisites
- Node.js v18+ (v22 may require additional setup for native builds)
- NPM v9+
- Python 3.6+ (for native compilations if needed)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/network-anomaly-detection.git
cd network-anomaly-detection
```

**Important**: If your project path has spaces (e.g., "Network Anomaly Detection"), rename folders to remove spaces before installing dependencies. Example:
```bash
mv "Network Anomaly Detection" Network-Anomaly-Detection
cd Network-Anomaly-Detection/network-anomaly-detection
```
This prevents build errors during native dependency installation.

2. Install dependencies:
```bash
npm install
```

3. (Optional) Install TensorFlow.js Node backend for faster performance:
```bash
npm install @tensorflow/tfjs-node
```
If installation fails (e.g., build errors), ensure no spaces in path and required build tools installed (see Troubleshooting).

## 📖 Usage

### Run with Mock Data
```bash
npm start
```

### Analyze PCAP File
```bash
npm start /path/to/capture.pcap
```

### Run Tests
```bash
npm test
```

## 🔧 Troubleshooting

### Application Stuck or Errors
- **Model Training Errors**: Ensure sufficient data; mock generator provides ~2000 packets.
- **TypeError in Visualizer**: Update to latest code with fixed visualizer.
- **SVM Prediction Error**: Fixed by normalization; pull latest changes.

### Dependency Installation Issues
- **node-pre-gyp build failures**: Often due to spaces in path or missing build tools.
  - macOS: Install Xcode Command Line Tools: `xcode-select --install`
  - Also install: `brew install pkg-config cairo pango libpng jpeg giflib librsvg`
- **No pre-built binaries**: Try older Node.js version (e.g., v20) or build from source.
- **Heap Out of Memory**: Run with `node --max-old-space-size=4096 src/index.js`

### Debug Logging
```bash
DEBUG=* npm start
```

## 📁 Project Structure

- `src/capture/`: Packet capturing and reading
- `src/detection/`: Anomaly models and detector
- `src/features/`: Feature extraction
- `src/utils/`: Helper functions
- `src/visualization/`: Results display
- `src/index.js`: Main entry

## 📄 License
MIT License - see LICENSE file.
