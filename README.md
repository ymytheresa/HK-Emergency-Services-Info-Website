# Hong Kong Emergency Services Info Website

A bilingual (中文/English) interactive web application to help users quickly find emergency medical services in Hong Kong.

## 🌐 Live Demo

**GitHub Pages**: [https://[your-username].github.io/HK-Emergency-Services-Info-Website](https://[your-username].github.io/HK-Emergency-Services-Info-Website)

## 🚀 Quick Start

### Option 1: GitHub Pages (Easiest)
1. Fork this repository
2. Go to **Settings** → **Pages**
3. Select **Deploy from a branch** → **main** → **/ (root)**
4. Your site will be live at: `https://[your-username].github.io/HK-Emergency-Services-Info-Website`

### Option 2: Shell Script (Local Development)
```bash
# Make the script executable (first time only)
chmod +x serve.sh

# Start the local development server
./serve.sh

# Or with custom port
./serve.sh --port 3000

# Or with environment variable
PORT=9000 ./serve.sh
```

The script will automatically detect and use the best available web server:
- Python 3 (recommended)
- Node.js http-server
- PHP built-in server
- Ruby WEBrick
- Python 2 (fallback)

### Option 2: Docker

#### Build and run with Docker
```bash
# Build the image
docker build -t hk-emergency-services .

# Run the container
docker run -p 8080:80 hk-emergency-services
```

#### Using Docker Compose (Recommended)
```bash
# Production build
docker-compose up -d

# Development mode with live file watching
docker-compose --profile dev up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 3: Other Hosting Platforms

**Netlify**:
1. Connect your GitHub repository
2. Build command: (none)
3. Publish directory: `/` (root)

**Vercel**:
1. Import your GitHub repository  
2. Framework preset: Other
3. Build and output settings: Default

**GitHub Codespaces**:
1. Click **Code** → **Codespaces** → **Create codespace**
2. Run `./serve.sh` in the terminal
3. Forward port 3030 for preview

### Option 4: Manual Setup
If you have a specific web server preference:

```bash
# Python 3
python3 -m http.server 8080

# Node.js
npx http-server -p 8080

# PHP
php -S localhost:8080
```

## 📁 Project Structure

```
/
├── index.html              # Main HTML file
├── assets/
│   ├── styles.css          # CSS styles and animations
│   ├── data.js            # Hospital data and information
│   ├── lang.js            # Bilingual content (中文/English)
│   └── app.js             # Main application logic
├── serve.sh               # Local development server script
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose configuration
└── README.md              # This file
```

## 🌐 Access the Website

Once running, open your browser and navigate to:
- **Local script**: http://localhost:8080
- **Docker**: http://localhost:8080
- **Development mode**: http://localhost:3000

## ✨ Features

- **🕐 Time-Based Pricing**: Enter any time to see accurate pricing for that period
- **📊 Price Sorting**: Hospitals sorted by cost (cheapest first) for quick decisions
- **🌍 Bilingual Support**: Full Chinese (Traditional) and English interface
- **📍 Geolocation**: Find nearest hospitals based on your location  
- **🔍 Interactive Filtering**: Filter by region, sector, and service level
- **📈 Dynamic Charts**: Visual pricing with color-coded cost levels
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices
- **🚨 Emergency Information**: Quick access to 999 emergency services
- **⏰ Real-Time Updates**: Pricing adjusts for day/evening/night rates

## 🛠 Development

### File Organization
- **index.html**: Clean HTML structure with external references
- **styles.css**: All CSS styles including animations and responsive design
- **data.js**: Complete hospital dataset with locations, contact info, and fees
- **lang.js**: All UI text in both Chinese and English
- **app.js**: JavaScript functionality including maps, charts, and interactions

### Making Changes
1. Edit the appropriate file in the `assets/` directory
2. Refresh your browser to see changes (no build step required)
3. For development with Docker, use the dev profile for live file watching

## 📱 Browser Support

- Modern browsers with ES6+ support
- Geolocation API support (for location features)
- Chart.js compatibility

## 🔧 Troubleshooting

### Port Already in Use
The shell script automatically finds an available port if 8080 is busy.

### Permission Denied
```bash
chmod +x serve.sh
```

### Docker Issues
```bash
# Remove existing containers
docker-compose down

# Rebuild images
docker-compose build --no-cache

# Start fresh
docker-compose up -d
```

## 📄 License

This project is for educational and informational purposes. All hospital data is compiled from public sources.

## 🤝 Contributing

To update hospital information or add features:
1. Edit the relevant files in the `assets/` directory
2. Test locally using `./serve.sh`
3. Submit your changes

For data updates, please email: ymy.theresa@gmail.com