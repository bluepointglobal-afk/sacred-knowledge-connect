#!/bin/bash

# FFmpeg Batch Image Resize Script
# Purpose: Resize images to platform-specific dimensions
# Usage: ./ffmpeg-batch-resize.sh <input_folder> <platform> <output_folder>
# Platforms: instagram-feed, instagram-reels, twitter, linkedin, facebook, tiktok, pinterest

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Platform dimensions (width x height, quality)
declare -A PLATFORMS=(
    ["instagram-feed"]="1080x1080:85"
    ["instagram-reels"]="1080x1920:85"
    ["instagram-stories"]="1080x1920:85"
    ["twitter"]="1200x675:80"
    ["linkedin"]="1200x627:85"
    ["facebook"]="1200x628:85"
    ["tiktok"]="1080x1920:85"
    ["pinterest"]="1000x1500:85"
    ["youtube-thumbnail"]="1280x720:85"
)

# Check arguments
if [ $# -lt 2 ]; then
    echo "Usage: $0 <input_folder> <platform> [output_folder]"
    echo ""
    echo "Available platforms:"
    for platform in "${!PLATFORMS[@]}"; do
        echo "  - $platform"
    done
    exit 1
fi

INPUT_FOLDER="$1"
PLATFORM="$2"
OUTPUT_FOLDER="${3:-./${PLATFORM}_output}"

# Validate inputs
if [ ! -d "$INPUT_FOLDER" ]; then
    print_error "Input folder not found: $INPUT_FOLDER"
    exit 1
fi

if [ -z "${PLATFORMS[$PLATFORM]}" ]; then
    print_error "Unknown platform: $PLATFORM"
    echo "Available platforms: ${!PLATFORMS[@]}"
    exit 1
fi

# Create output folder
mkdir -p "$OUTPUT_FOLDER"
print_status "Output folder: $OUTPUT_FOLDER"

# Parse platform dimensions
IFS=':' read -r DIMENSIONS QUALITY <<< "${PLATFORMS[$PLATFORM]}"

print_status "Platform: $PLATFORM"
print_status "Dimensions: $DIMENSIONS"
print_status "Quality: $QUALITY"
echo ""

# Counter for processed files
PROCESSED=0
SKIPPED=0

# Process images
for file in "$INPUT_FOLDER"/*.{jpg,jpeg,png,gif,bmp,webp}; do
    # Skip if file doesn't exist (glob didn't match)
    [ -e "$file" ] || continue
    
    FILENAME=$(basename "$file")
    EXTENSION="${FILENAME##*.}"
    BASENAME="${FILENAME%.*}"
    OUTPUT_FILE="$OUTPUT_FOLDER/${BASENAME}_${PLATFORM}.jpg"
    
    # Skip if output already exists
    if [ -f "$OUTPUT_FILE" ]; then
        print_warning "Skipping (already exists): $FILENAME"
        ((SKIPPED++))
        continue
    fi
    
    echo -n "Processing: $FILENAME ... "
    
    # Use ffmpeg to resize
    # -vf: video filter (scale to dimensions, maintain aspect ratio with pad)
    # -q:v: quality (1-31, lower is better)
    # -c:v: codec (mjpeg for JPG)
    if ffmpeg -i "$file" \
        -vf "scale=$DIMENSIONS:force_original_aspect_ratio=decrease,pad=$DIMENSIONS:(ow-iw)/2:(oh-ih)/2:white" \
        -q:v $QUALITY \
        -y \
        "$OUTPUT_FILE" 2>/dev/null; then
        print_status "$FILENAME → ${BASENAME}_${PLATFORM}.jpg"
        ((PROCESSED++))
    else
        print_error "Failed to process: $FILENAME"
        ((SKIPPED++))
    fi
done

echo ""
print_status "Processing complete!"
echo "  ✓ Processed: $PROCESSED"
echo "  ⊘ Skipped: $SKIPPED"
echo ""
print_status "Output folder: $OUTPUT_FOLDER"
echo ""
