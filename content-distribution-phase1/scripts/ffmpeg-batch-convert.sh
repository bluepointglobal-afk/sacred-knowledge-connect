#!/bin/bash

# FFmpeg Batch Format Conversion Script
# Purpose: Convert videos to different formats and codecs
# Usage: ./ffmpeg-batch-convert.sh <input_folder> <output_format> [output_folder]
# Formats: mp4, webm, mov, avi, mkv

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

# Format-specific settings (codec:quality:extension)
declare -A FORMATS=(
    ["mp4"]="libx264:26:mp4"
    ["webm"]="libvpx-vp9:32:webm"
    ["mov"]="libx264:26:mov"
    ["avi"]="mpeg4:26:avi"
    ["mkv"]="libx264:26:mkv"
    ["hevc"]="libx265:28:mp4"
)

# Check arguments
if [ $# -lt 2 ]; then
    echo "Usage: $0 <input_folder> <output_format> [output_folder]"
    echo ""
    echo "Available formats:"
    for format in "${!FORMATS[@]}"; do
        echo "  - $format"
    done
    exit 1
fi

INPUT_FOLDER="$1"
OUTPUT_FORMAT="$2"
OUTPUT_FOLDER="${3:-./${OUTPUT_FORMAT}_output}"

# Validate inputs
if [ ! -d "$INPUT_FOLDER" ]; then
    print_error "Input folder not found: $INPUT_FOLDER"
    exit 1
fi

if [ -z "${FORMATS[$OUTPUT_FORMAT]}" ]; then
    print_error "Unknown format: $OUTPUT_FORMAT"
    echo "Available formats: ${!FORMATS[@]}"
    exit 1
fi

# Create output folder
mkdir -p "$OUTPUT_FOLDER"

# Parse format settings
IFS=':' read -r CODEC CRF EXTENSION <<< "${FORMATS[$OUTPUT_FORMAT]}"

print_status "Output format: $OUTPUT_FORMAT"
print_status "Codec: $CODEC"
print_status "Quality (CRF): $CRF"
print_status "Output folder: $OUTPUT_FOLDER"
echo ""

PROCESSED=0
SKIPPED=0
FAILED=0

# Process videos
for file in "$INPUT_FOLDER"/*.{mp4,mov,avi,mkv,flv,wmv,webm}; do
    [ -e "$file" ] || continue
    
    FILENAME=$(basename "$file")
    BASENAME="${FILENAME%.*}"
    OUTPUT_FILE="$OUTPUT_FOLDER/${BASENAME}.${EXTENSION}"
    
    # Skip if output already exists
    if [ -f "$OUTPUT_FILE" ]; then
        print_warning "Skipping (already exists): $FILENAME"
        ((SKIPPED++))
        continue
    fi
    
    echo -n "Converting: $FILENAME ... "
    
    # Build ffmpeg command based on codec
    case $CODEC in
        libx264)
            ffmpeg -i "$file" \
                -c:v libx264 \
                -crf $CRF \
                -preset medium \
                -c:a aac \
                -b:a 128k \
                -movflags +faststart \
                -y \
                "$OUTPUT_FILE" 2>/dev/null
            ;;
        libx265)
            ffmpeg -i "$file" \
                -c:v libx265 \
                -crf $CRF \
                -preset medium \
                -c:a aac \
                -b:a 128k \
                -tag:v hvc1 \
                -y \
                "$OUTPUT_FILE" 2>/dev/null
            ;;
        libvpx-vp9)
            ffmpeg -i "$file" \
                -c:v libvpx-vp9 \
                -crf $CRF \
                -b:v 0 \
                -c:a libopus \
                -b:a 128k \
                -y \
                "$OUTPUT_FILE" 2>/dev/null
            ;;
        mpeg4)
            ffmpeg -i "$file" \
                -c:v mpeg4 \
                -q:v 5 \
                -c:a libmp3lame \
                -b:a 128k \
                -y \
                "$OUTPUT_FILE" 2>/dev/null
            ;;
        *)
            ffmpeg -i "$file" \
                -c copy \
                -y \
                "$OUTPUT_FILE" 2>/dev/null
            ;;
    esac
    
    if [ -f "$OUTPUT_FILE" ]; then
        SIZE=$(du -sh "$OUTPUT_FILE" | cut -f1)
        print_status "$FILENAME → ${BASENAME}.${EXTENSION} [$SIZE]"
        ((PROCESSED++))
    else
        print_error "Failed: $FILENAME"
        ((FAILED++))
    fi
done

echo ""
print_status "Conversion complete!"
echo "  ✓ Processed: $PROCESSED"
echo "  ⊘ Skipped: $SKIPPED"
echo "  ✗ Failed: $FAILED"
echo ""
