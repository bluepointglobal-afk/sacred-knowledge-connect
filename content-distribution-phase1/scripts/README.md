# FFmpeg Automation Scripts for Content Distribution

This directory contains four powerful FFmpeg scripts for batch processing media files to platform-specific requirements.

## Quick Start

### 1. Initial Setup
```bash
chmod +x setup-scripts.sh
./setup-scripts.sh
```

This will:
- Check for FFmpeg installation
- Make scripts executable
- Create symbolic links (optional)
- Set up media folders

### 2. Process Your Media

#### Resize Images to Platform Specs
```bash
./ffmpeg-batch-resize.sh ./my-images instagram-reels
```

#### Compress Videos
```bash
./ffmpeg-batch-compress.sh ./my-videos medium
```

#### Extract Thumbnails
```bash
./ffmpeg-extract-thumbnails.sh ./my-videos 00:00:05
```

#### Convert Video Format
```bash
./ffmpeg-batch-convert.sh ./my-videos mp4
```

---

## Script Details

### 1. ffmpeg-batch-resize.sh

**Purpose**: Resize images to platform-specific dimensions with proper aspect ratio handling

**Usage**:
```bash
./ffmpeg-batch-resize.sh <input_folder> <platform> [output_folder]
```

**Supported Platforms**:
- `instagram-feed` → 1080×1080 (square posts)
- `instagram-reels` → 1080×1920 (vertical stories/reels)
- `instagram-stories` → 1080×1920 (fullscreen stories)
- `twitter` → 1200×675 (landscape tweets)
- `linkedin` → 1200×627 (professional feed)
- `facebook` → 1200×628 (page posts)
- `tiktok` → 1080×1920 (vertical videos)
- `pinterest` → 1000×1500 (pin format)
- `youtube-thumbnail` → 1280×720 (thumbnails)

**Example**:
```bash
./ffmpeg-batch-resize.sh ./raw-photos pinterest ./pinterest-pins
```

**Output**:
- Files saved as: `[original-name]_[platform].jpg`
- Quality: 80-85% (optimized for web)
- Aspect ratio maintained (with letterbox if needed)

---

### 2. ffmpeg-batch-compress.sh

**Purpose**: Compress videos using H.264/H.265 codec with quality presets

**Usage**:
```bash
./ffmpeg-batch-compress.sh <input_folder> <preset> [output_folder]
```

**Compression Presets**:
- `fast` → CRF 23, fast encoding (high quality, quick process)
- `medium` → CRF 26, balanced (good quality, reasonable size)
- `slow` → CRF 28, slow encoding (smaller files, longer process)
- `ultraslow` → CRF 30, very slow (highly compressed)

**CRF Explanation**:
- Lower CRF = better quality (0 = lossless, 51 = worst)
- Default CRF for H.264 is 23 (visually lossless)
- Each +6 CRF roughly halves file size

**Example**:
```bash
./ffmpeg-batch-compress.sh ./raw-videos slow ./compressed-videos
```

**Output**:
- Files saved as: `[original-name]_compressed.mp4`
- Codec: H.264 (universal compatibility)
- Audio: AAC 128kbps
- Shows compression ratio (e.g., -45% reduction)

**Best Practices**:
- Use `fast` for high-quality archives
- Use `medium` for social media balance
- Use `slow` for file size critical situations (storage)
- Use `ultraslow` for heavy compression (archived content)

---

### 3. ffmpeg-extract-thumbnails.sh

**Purpose**: Extract key frames from videos as thumbnail images

**Usage**:
```bash
./ffmpeg-extract-thumbnails.sh <input_folder> [frame_time] [output_folder]
```

**Frame Time Options**:
- `0` → First frame of video
- `00:00:05` → At 5 seconds
- `00:00:30` → At 30 seconds
- `50%` → Middle of video
- `00:01:00` → At 1 minute

**Examples**:
```bash
# Extract at 1 second (default)
./ffmpeg-extract-thumbnails.sh ./videos

# Extract first frame
./ffmpeg-extract-thumbnails.sh ./videos 0

# Extract at middle
./ffmpeg-extract-thumbnails.sh ./videos 50% ./thumbs

# Extract at 5 seconds for specific platform
./ffmpeg-extract-thumbnails.sh ./videos 00:00:05 ./youtube-thumbs
```

**Output**:
- Files saved as: `[original-name]_thumb.jpg`
- Size: 1280×720 (YouTube thumbnail standard)
- Maintains aspect ratio with black letterbox

**Use Cases**:
- Generate preview images for social posts
- Create YouTube thumbnails
- Extract key moments from videos
- Quick video organization

---

### 4. ffmpeg-batch-convert.sh

**Purpose**: Convert between different video formats and codecs

**Usage**:
```bash
./ffmpeg-batch-convert.sh <input_folder> <output_format> [output_folder]
```

**Supported Formats**:
- `mp4` → H.264 (universal compatibility)
- `webm` → VP9 (web-optimized, smaller)
- `mov` → H.264 in QuickTime container (Apple)
- `avi` → MPEG-4 (older systems)
- `mkv` → H.264 in Matroska container (flexible)
- `hevc` → H.265/HEVC (newer, smaller files)

**Examples**:
```bash
# Convert to MP4 (safest option)
./ffmpeg-batch-convert.sh ./videos mp4 ./mp4-output

# Convert to WebM (web streaming)
./ffmpeg-batch-convert.sh ./videos webm ./webm-output

# Convert to HEVC (modern, smaller)
./ffmpeg-batch-convert.sh ./videos hevc ./hevc-output
```

**Output**:
- Files saved as: `[original-name].[extension]`
- Quality: CRF 26-32 depending on format
- Shows file size for each conversion

**Recommendations**:
- Use `mp4` for social media (maximum compatibility)
- Use `webm` for websites (better compression, modern browsers)
- Use `hevc` for archival (newest standard, smaller files)
- Use `mov` for Mac/Apple ecosystems

---

## Batch Processing Workflow

### Complete Media Processing Pipeline

```bash
# Step 1: Place raw media in input folder
# (Copy images, videos to ./input/)

# Step 2: Compress videos if needed
./ffmpeg-batch-compress.sh ./input medium ./step-1-compressed

# Step 3: Extract thumbnails
./ffmpeg-extract-thumbnails.sh ./step-1-compressed ./step-2-thumbs

# Step 4: Resize images for platforms
./ffmpeg-batch-resize.sh ./input instagram-reels ./step-3-instagram-reels
./ffmpeg-batch-resize.sh ./input pinterest ./step-3-pinterest
./ffmpeg-batch-resize.sh ./input twitter ./step-3-twitter

# Step 5: Organize output
# Find all processed files in respective output folders
```

### Automated Batch Script (Optional)

Create `process-all-media.sh`:

```bash
#!/bin/bash

INPUT="./input"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "🎬 Processing all media..."

# Create output folders
mkdir -p output/{compressed,instagram-reels,pinterest,twitter,thumbnails}

# Compress videos
echo "Compressing videos..."
"$SCRIPT_DIR/ffmpeg-batch-compress.sh" "$INPUT" medium output/compressed

# Extract thumbnails
echo "Extracting thumbnails..."
"$SCRIPT_DIR/ffmpeg-extract-thumbnails.sh" output/compressed 50% output/thumbnails

# Resize for each platform
echo "Resizing for Instagram..."
"$SCRIPT_DIR/ffmpeg-batch-resize.sh" "$INPUT" instagram-reels output/instagram-reels

echo "Resizing for Pinterest..."
"$SCRIPT_DIR/ffmpeg-batch-resize.sh" "$INPUT" pinterest output/pinterest

echo "Resizing for Twitter..."
"$SCRIPT_DIR/ffmpeg-batch-resize.sh" "$INPUT" twitter output/twitter

echo "✅ All media processed!"
```

Then run:
```bash
chmod +x process-all-media.sh
./process-all-media.sh
```

---

## Installation & Dependencies

### FFmpeg Installation

#### macOS (Homebrew)
```bash
brew install ffmpeg
```

#### Ubuntu/Debian
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

#### Windows
Option 1: Chocolatey
```bash
choco install ffmpeg
```

Option 2: Download from https://ffmpeg.org/download.html

#### Verify Installation
```bash
ffmpeg -version
ffmpeg -codecs | grep libx264
```

### Required Codecs

All scripts work best with these codecs (usually included):
- **H.264** (libx264) - Universal video codec
- **AAC** - Standard audio codec
- **libx265** (optional) - For HEVC compression
- **libvpx-vp9** (optional) - For WebM conversion

Check available codecs:
```bash
ffmpeg -codecs | grep 'h264\|h265\|vp9\|aac'
```

---

## Advanced Usage

### Resize with Custom Dimensions

Modify script to add custom dimension:

```bash
# In ffmpeg-batch-resize.sh, add to PLATFORMS array:
["custom-16-9"]="1920x1080:85"

# Then run:
./ffmpeg-batch-resize.sh ./images custom-16-9
```

### Compress with Custom CRF

```bash
# Modify PRESETS array in ffmpeg-batch-compress.sh:
["quality"]="18:medium"  # Higher quality (lower CRF)
["economy"]="32:fast"    # Maximum compression

# Then run:
./ffmpeg-batch-compress.sh ./videos quality
```

### Extract Multiple Frames

Create a loop script:

```bash
#!/bin/bash
INPUT="./videos"
OUTPUT="./frames"
mkdir -p "$OUTPUT"

for time in 0 "00:00:05" "00:00:10" "50%"; do
    ./ffmpeg-extract-thumbnails.sh "$INPUT" "$time" "$OUTPUT-$time"
done
```

### Parallel Processing (Speed Up)

For large batches, process multiple files simultaneously:

```bash
#!/bin/bash

INPUT="./videos"
PRESET="medium"
PARALLEL_JOBS=4

# Find all videos and process in parallel
find "$INPUT" -type f \( -name "*.mp4" -o -name "*.mov" \) | \
    xargs -P $PARALLEL_JOBS -I {} \
    ffmpeg -i {} -c:v libx264 -crf 26 -preset medium {}.compressed.mp4
```

---

## Troubleshooting

### "Command not found: ffmpeg"
**Solution**: Install FFmpeg (see Installation section above)

### Script permissions error
```bash
chmod +x *.sh
```

### Output folder permission denied
```bash
mkdir -p output
chmod 755 output
```

### FFmpeg codec not available
```bash
# Check available codecs
ffmpeg -codecs | grep h264

# If missing, reinstall FFmpeg with all dependencies
# macOS: brew reinstall ffmpeg --with-libx265
# Ubuntu: sudo apt-get install --reinstall ffmpeg libx265-dev
```

### File conversion fails
1. Verify input file is readable: `ffmpeg -i input.file`
2. Check available disk space: `df -h`
3. Try with a smaller file first
4. Check FFmpeg error messages (remove `2>/dev/null` to see errors)

### Very slow processing
- Use a faster preset: `fast` instead of `slow`
- Process smaller batches
- Enable parallel processing (advanced)
- Consider using hardware acceleration (GPU)

---

## Platform-Specific Recommendations

### Instagram
- **Feed**: 1080×1080 (square), 2-4 MB max
- **Reels**: 1080×1920 (vertical), 4-8 MB max
- **Stories**: 1080×1920 (vertical), 4 MB max
- **Format**: MP4 or JPEG
- **Best Preset**: `medium` compression

### TikTok
- **Dimensions**: 1080×1920 (vertical only)
- **Duration**: 15 seconds to 10 minutes
- **Format**: MP4 only
- **File Size**: 200 MB max
- **Best Preset**: `slow` (maximize quality in vertical format)

### Twitter/X
- **Image**: 1200×675 (16:9 aspect ratio)
- **Video**: 1200×675, max 15 MB, 2 hours max
- **Format**: MP4 recommended
- **Best Preset**: `fast` (quick processing)

### LinkedIn
- **Image**: 1200×627 (1.91:1 ratio)
- **Video**: 1200×627, max 10 MB
- **Format**: MP4 or MOV
- **Best Preset**: `medium` (professional quality)

### Pinterest
- **Image**: 1000×1500 (2:3 vertical)
- **Video**: 1000×1500, 15 seconds to 15 minutes
- **Format**: MP4 or WebM
- **Best Preset**: `medium` (balance quality/size)

### YouTube
- **Thumbnail**: 1280×720 (16:9)
- **Video**: 3840×2160 (4K) to 1280×720 (720p)
- **Format**: MP4 (H.264 + AAC)
- **Best Preset**: `fast` (preserve quality for archive)

---

## Performance Tips

### Speed Up Processing
1. Use `fast` preset instead of `slow`
2. Lower target resolution (resize smaller)
3. Process in parallel (multiple scripts simultaneously)
4. Use SSD for input/output folders

### Reduce File Size
1. Use `slow` or `ultraslow` preset
2. Reduce resolution (720p instead of 1080p)
3. Lower audio bitrate (64kbps instead of 128kbps)
4. Consider WebM format (better compression)

### Quality vs Speed Tradeoff
- `fast` CRF 23: High quality, quick processing
- `medium` CRF 26: Good balance (recommended)
- `slow` CRF 28: Smaller files, slow processing
- `ultraslow` CRF 30: Maximum compression

---

## Scheduling & Automation

### Cron Job for Nightly Processing

```bash
# Edit crontab
crontab -e

# Add this line to process at 2 AM daily
0 2 * * * /path/to/ffmpeg-batch-compress.sh /path/to/input medium /path/to/output
```

### Watch Folder for Auto-Processing

Create `watch-folder.sh`:

```bash
#!/bin/bash

INPUT="./watch"
OUTPUT="./output"

while true; do
    if [ "$(ls -A $INPUT)" ]; then
        ./ffmpeg-batch-compress.sh "$INPUT" medium "$OUTPUT"
        # Move processed files to archive
        mv "$INPUT"/* "./archive/"
    fi
    sleep 60  # Check every minute
done
```

---

## Contact & Support

- **FFmpeg Documentation**: https://ffmpeg.org/documentation.html
- **FFmpeg Wiki**: https://trac.ffmpeg.org/wiki
- **FFmpeg Forum**: https://ffmpeg.org/pipermail/

---

**Last Updated**: 2026-02-05  
**Version**: 1.0  
**Status**: Production Ready
