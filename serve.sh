#!/bin/bash

# Hong Kong Emergency Services Info Website - Local Development Server
# This script starts a local web server to serve the website

PORT=${PORT:-3030}
HOST=${HOST:-localhost}

echo "🏥 Hong Kong Emergency Services Info Website"
echo "============================================"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is available (simplified)
is_port_free() {
    local port=$1
    if command_exists lsof; then
        ! lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1
    elif command_exists netstat; then
        ! netstat -an 2>/dev/null | grep -q ":$port.*LISTEN"
    else
        # If no port checking tools available, assume port is free
        true
    fi
}

# Handle script arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --help, -h     Show this help message"
            echo "  --port PORT    Set server port (default: 3030)"
            echo "  --host HOST    Set server host (default: localhost)"
            echo ""
            echo "Environment variables:"
            echo "  PORT           Server port (default: 3030)"
            echo "  HOST           Server host (default: localhost)"
            echo ""
            echo "Examples:"
            echo "  $0                    # Start server on localhost:3030"
            echo "  $0 --port 8080       # Start server on localhost:8080"
            echo "  PORT=9000 $0         # Start server on localhost:9000"
            exit 0
            ;;
        --port)
            if [ -n "$2" ]; then
                PORT=$2
                shift 2
            else
                echo "❌ Error: --port requires a port number"
                exit 1
            fi
            ;;
        --host)
            if [ -n "$2" ]; then
                HOST=$2
                shift 2
            else
                echo "❌ Error: --host requires a hostname"
                exit 1
            fi
            ;;
        *)
            echo "❌ Error: Unknown option '$1'"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found in current directory"
    echo "Please run this script from the website root directory"
    exit 1
fi

# Check if port is available and suggest alternative
if ! is_port_free $PORT; then
    echo "⚠️  Port $PORT appears to be in use"
    echo "💡 Try a different port with: $0 --port 8080"
    echo "Or kill the process using port $PORT"
    echo ""
fi

echo "🚀 Starting development server..."
echo "📍 URL: http://$HOST:$PORT"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Try different server options in order of preference
if command_exists python3; then
    echo "Using Python 3 HTTP server"
    python3 -m http.server $PORT --bind $HOST
elif command_exists python; then
    echo "Using Python 2 HTTP server"
    cd "$(dirname "$0")" && python -m SimpleHTTPServer $PORT
elif command_exists node; then
    if command_exists npx; then
        echo "Using Node.js http-server (via npx)"
        npx http-server -p $PORT -a $HOST -o
    else
        echo "Using Node.js simple server"
        node -e "
        const http = require('http');
        const fs = require('fs');
        const path = require('path');
        const server = http.createServer((req, res) => {
            let filePath = '.' + req.url;
            if (filePath == './') filePath = './index.html';
            const extname = String(path.extname(filePath)).toLowerCase();
            const mimeTypes = {
                '.html': 'text/html',
                '.js': 'text/javascript',
                '.css': 'text/css',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpg',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml',
                '.wav': 'audio/wav',
                '.mp4': 'video/mp4',
                '.woff': 'application/font-woff',
                '.ttf': 'application/font-ttf',
                '.eot': 'application/vnd.ms-fontobject',
                '.otf': 'application/font-otf',
                '.wasm': 'application/wasm'
            };
            const contentType = mimeTypes[extname] || 'application/octet-stream';
            fs.readFile(filePath, (error, content) => {
                if (error) {
                    if(error.code == 'ENOENT') {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.end('<h1>404 Not Found</h1>', 'utf-8');
                    } else {
                        res.writeHead(500);
                        res.end('Server Error: ' + error.code + ' ..\n');
                    }
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                }
            });
        });
        server.listen($PORT, '$HOST', () => {
            console.log('Server running at http://$HOST:$PORT/');
        });
        "
    fi
elif command_exists php; then
    echo "Using PHP built-in server"
    php -S $HOST:$PORT
elif command_exists ruby; then
    echo "Using Ruby WEBrick server"
    ruby -run -e httpd . -p $PORT
else
    echo "❌ Error: No suitable web server found!"
    echo ""
    echo "Please install one of the following:"
    echo "  • Python 3: python3 -m http.server"
    echo "  • Node.js: https://nodejs.org/"
    echo "  • PHP: Built-in server"
    echo "  • Ruby: Built-in WEBrick"
    echo ""
    echo "Quick alternatives:"
    echo "  • Use Docker: docker run -p 8080:80 -v \$(pwd):/usr/share/nginx/html:ro nginx"
    echo "  • Use Python directly: python3 -m http.server 3030"
    exit 1
fi