#!/bin/bash
set -euo pipefail

STATE_DIR="$HOME/.openclaw/watchdog"
mkdir -p "$STATE_DIR"
RECOVERY_FILE="$STATE_DIR/last-recovery.json"
STRIKE_FILE="$STATE_DIR/strike-count"

log() {
  # goes to LaunchAgent StandardOutPath
  echo "[$(/bin/date -u +"%Y-%m-%dT%H:%M:%SZ")] $*"
}

# --- 2-strike rule ---
# Strike 1: record and exit (no restart)
# Strike 2 (consecutive): restart + notify

# Use a cheap, dependency-light health probe to avoid false positives from openclaw CLI/tooling.
# We treat "gateway up" as: HTTP GET / returns quickly.
HEALTH_URL="http://127.0.0.1:18789/"
HEALTH_TIMEOUT_S=2

RESTART_TIMEOUT_S=30

# Health probe
if /usr/bin/curl -sS --max-time "$HEALTH_TIMEOUT_S" "$HEALTH_URL" >/dev/null 2>&1; then
  # success -> clear strikes
  rm -f "$STRIKE_FILE" >/dev/null 2>&1 || true
  exit 0
fi

# failed -> increment strikes
STRIKES=0
if [[ -f "$STRIKE_FILE" ]]; then
  STRIKES=$(cat "$STRIKE_FILE" 2>/dev/null || echo 0)
fi
STRIKES=$((STRIKES + 1))
echo "$STRIKES" > "$STRIKE_FILE"
log "watchdog strike=$STRIKES health_probe_failed url=$HEALTH_URL timeout=${HEALTH_TIMEOUT_S}s"

# First strike: do nothing (avoid false positives)
if [[ "$STRIKES" -lt 2 ]]; then
  exit 0
fi

# Second consecutive strike -> restart + reset strikes
rm -f "$STRIKE_FILE" >/dev/null 2>&1 || true

log "watchdog restarting gateway"

# Restart gateway via CLI (bounded)
/usr/bin/python3 - <<'PY' "$RESTART_TIMEOUT_S"
import subprocess, sys

timeout_s=int(sys.argv[1])
cmd=['/opt/homebrew/bin/openclaw','gateway','restart']
try:
  subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=timeout_s)
except subprocess.TimeoutExpired:
  pass
PY

NOW_ISO=$(/bin/date -u +"%Y-%m-%dT%H:%M:%SZ")
cat >"$RECOVERY_FILE" <<JSON
{"recoveredAt":"$NOW_ISO","reason":"gateway http health probe timeout/failure"}
JSON
