#!/bin/bash

# FFmpeg Batch Video Compression Script
# Purpose: Compress videos for different platforms
# Usage: ./ffmpeg-batch-compress.sh <input_folder> <preset> [output_folder]
# Presets: fast (high quality), medium (balanced), slow (high compression)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Codec presets (crf:preset - lower CRF = better quality)
declare -A PRESETS=(
    ["fast"]="23:fast"           # Fast encoding, good quality
    ["medium"]="26:medium"       # Balanced quality/speed
    ["slow"]="28:slow"           # Slow encoding, smaller file
    ["ultraslow"]="30:slower"    # Extremely compressed
)

# Check arguments
if [ $# -lt 2 ]; then
    echo "Usage: $0 <input_folder> <preset> [output_folder]"
    echo ""
    echo "Available presets:"
    for preset in "${!PRESETS[@]}"; do
        echo "  - $preset (CRF ${PRESETS[$preset]%:*})"
    done
    exit 1
fi

INPUT_FOLDER="$1"
PRESET="$2"
OUTPUT_FOLDER="${3:-./${PRESET}_output}"

# Validate inputs
if [ ! -d "$INPUT_FOLDER" ]; then
    print_error "Input folder not found: $INPUT_FOLDER"
    exit 1
fi

if [ -z "${PRESETS[$PRESET]}" ]; then
    print_error "Unknown preset: $PRESET"
    echo "Available presets: ${!PRESETS[@]}"
    exit 1
fi

# Create output folder
mkdir -p "$OUTPUT_FOLDER"

# Parse preset settings
IFS=':' read -r CRF SPEED <<< "${PRESETS[$PRESET]}"

print_status "Compression Preset: $PRESET"
print_info "CRF: $CRF (quality/compression - lower = better quality)"
print_info "Speed: $SPEED"
print_status "Output folder: $OUTPUT_FOLDER"
echo ""

# Counter for processed files
PROCESSED=0
SKIPPED=0
FAILED=0

# Process videos
for file in "$INPUT_FOLDER"/*.{mp4,mov,avi,mkv,flv,wmv,webm}; do
    # Skip if file doesn't exist (glob didn't match)
    [ -e "$file" ] || continue
    
    FILENAME=$(basename "$file")
    EXTENSION="${FILENAME##*.}"
    BASENAME="${FILENAME%.*}"
    OUTPUT_FILE="$OUTPUT_FOLDER/${BASENAME}_compressed.mp4"
    
    # Get input file size
    INPUT_SIZE=$(du -sh "$file" | cut -f1)
    
    # Skip if output already exists
    if [ -f "$OUTPUT_FILE" ]; then
        print_warning "Skipping (already exists): $FILENAME"
        ((SKIPPED++))
        continue
    fi
    
    echo -n "Processing: $FILENAME [$INPUT_SIZE] ... "
    
    # Use ffmpeg to compress video
    # -c:v libx264: H.264 codec (universal compatibility)
    # -crf: Quality (0-51, 23 is default, lower = better)
    # -preset: Encoding speed (ultrafast to veryslow)
    # -c:a aac: Audio codec (AAC for compatibility)
    # -b:a 128k: Audio bitrate
    if ffmpeg -i "$file" \
        -c:v libx264 \
        -crf $CRF \
        -preset $SPEED \
        -c:a aac \
        -b:a 128k \
        -movflags +faststart \
        -y \
        "$OUTPUT_FILE" 2>/dev/null; then
        
        # Get output file size
        OUTPUT_SIZE=$(du -sh "$OUTPUT_FILE" | cut -f1)
        
        # Calculate compression ratio
        INPUT_BYTES=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")
        OUTPUT_BYTES=$(stat -f%z "$OUTPUT_FILE" 2>/dev/null || stat -c%s "$OUTPUT_FILE")
        RATIO=$((100 - (OUTPUT_BYTES * 100 / INPUT_BYTES)))
        
        echo -e "${GREEN}✓${NC}"
        print_info "  Output: ${BASENAME}_compressed.mp4 [$OUTPUT_SIZE] (-${RATIO}%)"
        ((PROCESSED++))
    else
        print_error "Failed to process: $FILENAME"
        ((FAILED++))
    fi
done

echo ""
print_status "Compression complete!"
echo "  ✓ Processed: $PROCESSED"
echo "  ⊘ Skipped: $SKIPPED"
echo "  ✗ Failed: $FAILED"
echo ""
print_status "Output folder: $OUTPUT_FOLDER"
echo ""
