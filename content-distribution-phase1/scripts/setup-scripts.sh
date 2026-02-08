#!/bin/bash

# Setup FFmpeg Automation Scripts
# Purpose: Initialize scripts and check for dependencies
# Run once to set up the environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[i]${NC} $1"
}

echo ""
print_info "═══════════════════════════════════════"
print_info "   FFmpeg Scripts Setup Wizard"
print_info "═══════════════════════════════════════"
echo ""

# Check if FFmpeg is installed
echo "Checking for FFmpeg installation..."
if command -v ffmpeg &> /dev/null; then
    FFMPEG_VERSION=$(ffmpeg -version | head -n1)
    print_status "FFmpeg found: $FFMPEG_VERSION"
else
    print_error "FFmpeg not installed!"
    echo ""
    echo "Installation instructions:"
    echo ""
    echo "macOS (with Homebrew):"
    echo "  brew install ffmpeg"
    echo ""
    echo "Ubuntu/Debian:"
    echo "  sudo apt-get install ffmpeg"
    echo ""
    echo "Windows (with Chocolatey):"
    echo "  choco install ffmpeg"
    echo ""
    echo "Or download from: https://ffmpeg.org/download.html"
    exit 1
fi

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo ""
print_info "Making scripts executable..."

# Make scripts executable
chmod +x "$SCRIPT_DIR"/ffmpeg-batch-resize.sh 2>/dev/null && \
    print_status "ffmpeg-batch-resize.sh" || \
    print_warning "Could not set permissions for ffmpeg-batch-resize.sh"

chmod +x "$SCRIPT_DIR"/ffmpeg-batch-compress.sh 2>/dev/null && \
    print_status "ffmpeg-batch-compress.sh" || \
    print_warning "Could not set permissions for ffmpeg-batch-compress.sh"

chmod +x "$SCRIPT_DIR"/ffmpeg-extract-thumbnails.sh 2>/dev/null && \
    print_status "ffmpeg-extract-thumbnails.sh" || \
    print_warning "Could not set permissions for ffmpeg-extract-thumbnails.sh"

chmod +x "$SCRIPT_DIR"/ffmpeg-batch-convert.sh 2>/dev/null && \
    print_status "ffmpeg-batch-convert.sh" || \
    print_warning "Could not set permissions for ffmpeg-batch-convert.sh"

echo ""
print_info "Creating symbolic links (optional)..."

# Optional: Create symlinks in /usr/local/bin for easier access
if [ -w /usr/local/bin ]; then
    ln -sf "$SCRIPT_DIR"/ffmpeg-batch-resize.sh /usr/local/bin/ffmpeg-resize 2>/dev/null && \
        print_status "Linked: ffmpeg-resize" || true
    
    ln -sf "$SCRIPT_DIR"/ffmpeg-batch-compress.sh /usr/local/bin/ffmpeg-compress 2>/dev/null && \
        print_status "Linked: ffmpeg-compress" || true
    
    ln -sf "$SCRIPT_DIR"/ffmpeg-extract-thumbnails.sh /usr/local/bin/ffmpeg-thumbs 2>/dev/null && \
        print_status "Linked: ffmpeg-thumbs" || true
    
    ln -sf "$SCRIPT_DIR"/ffmpeg-batch-convert.sh /usr/local/bin/ffmpeg-convert 2>/dev/null && \
        print_status "Linked: ffmpeg-convert" || true
    
    echo ""
    print_info "Symlinks created in /usr/local/bin (optional)"
    echo "You can now run these commands from anywhere:"
    echo "  ffmpeg-resize <folder> <platform>"
    echo "  ffmpeg-compress <folder> <preset>"
    echo "  ffmpeg-thumbs <folder>"
    echo "  ffmpeg-convert <folder> <format>"
else
    print_warning "No write permission to /usr/local/bin"
    echo "Run scripts with full path, e.g.:"
    echo "  $SCRIPT_DIR/ffmpeg-batch-resize.sh <folder> <platform>"
fi

echo ""
print_info "Creating sample media folders..."
mkdir -p "$SCRIPT_DIR/../media/input"
mkdir -p "$SCRIPT_DIR/../media/output"
mkdir -p "$SCRIPT_DIR/../media/processed"
print_status "Created media folders"

echo ""
print_info "═══════════════════════════════════════"
print_status "Setup complete!"
print_info "═══════════════════════════════════════"
echo ""
echo "Quick start guide:"
echo ""
echo "1. Place your media files in:"
echo "   $SCRIPT_DIR/../media/input/"
echo ""
echo "2. Run a script:"
echo "   cd $SCRIPT_DIR"
echo "   ./ffmpeg-batch-resize.sh ../media/input instagram-reels"
echo ""
echo "3. Find processed files in:"
echo "   $SCRIPT_DIR/../media/output/"
echo ""
echo "For more help, run:"
echo "   ./ffmpeg-batch-resize.sh"
echo "   ./ffmpeg-batch-compress.sh"
echo "   ./ffmpeg-extract-thumbnails.sh"
echo "   ./ffmpeg-batch-convert.sh"
echo ""
