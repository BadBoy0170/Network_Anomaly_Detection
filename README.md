# Network Anomaly Detection System

A robust machine learning-based system designed to detect anomalies in encrypted network traffic using a variety of detection algorithms, including Autoencoder, One-Class SVM, and K-means clustering.

## Key Features

- **Real-time Analysis**: Processes live network traffic or analyzes PCAP files.
- **Versatile Detection**: Supports multiple anomaly detection algorithms:
  - **Autoencoder**: Powered by TensorFlow.js.
  - **One-Class SVM**: Custom implementation tailored for network anomalies.
  - **K-means Clustering**: Efficient clustering to identify outliers.
- **Encrypted Traffic Insights**: Specializes in analyzing TLS/SSL encrypted traffic.
- **Feature Extraction**: Extracts meaningful features from raw network packets.
- **Interactive Visualizations**: Visualize anomalies for better insights.

## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/network-anomaly-detection.git  
cd network-anomaly-detection  
```

Install dependencies:

```bash
npm install  
```

## Usage

### Run with Mock Data

To start the system with pre-configured mock data:

```bash
npm start  
```

### Analyze a PCAP File

Analyze network traffic from a PCAP file:

```bash
npm start /path/to/your/capture.pcap  
```

### Using Supabase

If you want to use Supabase for this project, create a `.env` file in the root directory and include the following variables:

```env
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_SUPABASE_URL=https://YOUR_SUPABASE_URL
```
Replace `YOUR_SUPABASE_ANON_KEY` and `YOUR_SUPABASE_URL` with your actual Supabase credentials. Keep this file secure and do not share it publicly.

## Project Structure

```
src/  
├── capture/           # Modules for packet capture and PCAP file reading  
├── detection/         # Core anomaly detection algorithms  
├── features/          # Feature extraction logic  
├── utils/             # Helper functions and utilities  
├── visualization/     # Anomaly visualization components  
└── index.js           # Application entry point  
```

## Development

Run the test suite:

```bash
npm test  
```

## Contributing

We welcome contributions to enhance the system:

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/your-feature-name  
```

3. Commit your changes:

```bash
git commit -m "Add your descriptive commit message"  
```

4. Push to your forked repository:

```bash
git push origin feature/your-feature-name  
```

5. Submit a Pull Request to the main repository.

## Requirements

- **Node.js**: Version 18.0.0 or higher
- **NPM**: Version 9.0.0 or higher

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Note

There may be some errors in this system. Please report any issues you encounter so they can be addressed.
