#!/bin/bash

# Installation script for backend dependencies
# This script installs required Python packages

echo "📦 Installing backend dependencies..."

cd "$(dirname "$0")"

# Check if pip is available
if ! command -v pip3 &> /dev/null; then
    echo "❌ Error: pip3 is not installed"
    echo "Please install pip3 first: sudo apt install python3-pip"
    exit 1
fi

# Try to install in user space if system-wide installation fails
echo "Installing python-dotenv..."
if pip3 install --user python-dotenv; then
    echo "✅ python-dotenv installed successfully"
else
    echo "⚠️  Warning: Could not install python-dotenv"
    echo "You may need to install it manually or use a virtual environment"
    exit 1
fi

# Verify other dependencies
echo ""
echo "Checking other dependencies..."
python3 -c "
import sys
missing = []
try:
    import fastapi
except ImportError:
    missing.append('fastapi')
try:
    import uvicorn
except ImportError:
    missing.append('uvicorn')
try:
    import httpx
except ImportError:
    missing.append('httpx')
try:
    import pandas
except ImportError:
    missing.append('pandas')
try:
    import numpy
except ImportError:
    missing.append('numpy')
try:
    import scipy
except ImportError:
    missing.append('scipy')

if missing:
    print('⚠️  Missing dependencies:', ', '.join(missing))
    print('Run: pip3 install --user ' + ' '.join(missing))
    sys.exit(1)
else:
    print('✅ All dependencies are installed')
"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Backend is ready to run!"
    echo "Start the server with: ./start.sh"
else
    echo ""
    echo "❌ Some dependencies are missing"
    echo "Install them with: pip3 install --user -r backend/requirements.txt"
fi
