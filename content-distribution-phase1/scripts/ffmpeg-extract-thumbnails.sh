#!/bin/bash

# FFmpeg Extract Thumbnails Script
# Purpose: Extract key frames from videos as thumbnails
# Usage: ./ffmpeg-extract-thumbnails.sh <input_folder> [frame_time] [output_folder]
# Frame time examples: 0 (first frame), 00:00:05 (5 seconds), 50% (middle)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Default values
FRAME_TIME="${2:-00:00:01}"  # Extract at 1 second by default
OUTPUT_FOLDER="${3:-./__thumbnails}"

# Check arguments
if [ $# -lt 1 ]; then
    echo "Usage: $0 <input_folder> [frame_time] [output_folder]"
    echo ""
    echo "Frame time examples:"
    echo "  0              - First frame"
    echo "  00:00:05       - At 5 seconds"
    echo "  50%            - Middle of video"
    exit 1
fi

INPUT_FOLDER="$1"

# Validate input
if [ ! -d "$INPUT_FOLDER" ]; then
    print_error "Input folder not found: $INPUT_FOLDER"
    exit 1
fi

# Create output folder
mkdir -p "$OUTPUT_FOLDER"

print_status "Input folder: $INPUT_FOLDER"
print_status "Frame time: $FRAME_TIME"
print_status "Output folder: $OUTPUT_FOLDER"
echo ""

PROCESSED=0
FAILED=0

# Process videos
for file in "$INPUT_FOLDER"/*.{mp4,mov,avi,mkv,flv,wmv,webm}; do
    [ -e "$file" ] || continue
    
    FILENAME=$(basename "$file")
    BASENAME="${FILENAME%.*}"
    OUTPUT_FILE="$OUTPUT_FOLDER/${BASENAME}_thumb.jpg"
    
    # Skip if output exists
    if [ -f "$OUTPUT_FILE" ]; then
        print_warning "Skipping: $FILENAME (already extracted)"
        continue
    fi
    
    echo -n "Extracting thumbnail from: $FILENAME ... "
    
    # Extract thumbnail at specified frame
    if ffmpeg -i "$file" \
        -ss "$FRAME_TIME" \
        -vframes 1 \
        -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:black" \
        -q:v 5 \
        -y \
        "$OUTPUT_FILE" 2>/dev/null; then
        print_status "$FILENAME → ${BASENAME}_thumb.jpg"
        ((PROCESSED++))
    else
        print_error "Failed: $FILENAME"
        ((FAILED++))
    fi
done

echo ""
print_status "Extraction complete!"
echo "  ✓ Processed: $PROCESSED"
echo "  ✗ Failed: $FAILED"
echo ""
