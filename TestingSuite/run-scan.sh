#!/bin/bash

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Default values
CONFIG_FILE="config.yaml"
SKIP_ZAP=false
SKIP_SEMGREP=false
SKIP_SCA=false
SKIP_LIVE=false
LIVE_ONLY=false
BROWSER_SCAN=false
BROWSER_ONLY=false
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -c|--config)
            CONFIG_FILE="$2"
            shift 2
            ;;
        --skip-zap)
            SKIP_ZAP=true
            shift
            ;;
        --skip-semgrep)
            SKIP_SEMGREP=true
            shift
            ;;
        --skip-sca)
            SKIP_SCA=true
            shift
            ;;
        --skip-live)
            SKIP_LIVE=true
            shift
            ;;
        --live-only)
            LIVE_ONLY=true
            shift
            ;;
        --browser)
            BROWSER_SCAN=true
            shift
            ;;
        --browser-only)
            BROWSER_ONLY=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  -c, --config FILE   Config file (default: config.yaml)"
            echo "  --skip-zap          Skip OWASP ZAP daemon scan"
            echo "  --skip-semgrep      Skip Semgrep analysis"
            echo "  --skip-sca          Skip npm audit"
            echo "  --skip-live         Skip live Firebase tests"
            echo "  --live-only         Only run live Firebase tests"
            echo "  --browser           Include authenticated browser scan (Puppeteer+ZAP)"
            echo "  --browser-only      Only run browser-based authenticated scan"
            echo "  -h, --help          Show this help"
            echo ""
            echo "Browser Scan Info:"
            echo "  The --browser option uses Puppeteer (headless Chrome) to:"
            echo "    1. Actually login to your Firebase app"
            echo "    2. Navigate through the app like a real user"
            echo "    3. Proxy traffic through ZAP for vulnerability scanning"
            echo "    4. Find vulnerabilities that daemon-mode ZAP misses on SPAs"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Banner
echo -e "${MAGENTA}"
echo "╔══════════════════════════════════════════════════════════════════════╗"
echo "║     ___  _    _____   _____ ___   _____ ___  ___   _  ___  _  ___    ║"
echo "║    / _ \| |  | _ \ \ / /_  ) __| |_   _/ _ \| _ \ / ||   \/ |/ _ \   ║"
echo "║   | (_) | |/\|  _/\ V / / /\__ \   | || (_) |  _/ | || |) | | (_) |  ║"
echo "║    \___/|__/\|_|   \_/ /___|___/   |_| \___/|_|   |_||___/|_|\___/   ║"
echo "║                                                                      ║"
echo "║  A01: Broken Access Control | A02: Cryptographic Failures            ║"
echo "║  A03: Injection             | Firebase SPA Security Scanner          ║"
echo "╚══════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check config file
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}Error: Config file not found: $CONFIG_FILE${NC}"
    echo "Create a config file from config.yaml template"
    exit 1
fi

echo -e "${CYAN}Config:${NC} $CONFIG_FILE"
echo -e "${CYAN}Date:${NC}   $(date -Iseconds)"
echo ""

# Check dependencies
echo -e "${BLUE}[*] Checking dependencies...${NC}"

# Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js not installed${NC}"
    exit 1
fi
echo -e "  ${GREEN}✓${NC} Node.js $(node --version)"

# npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm not installed${NC}"
    exit 1
fi
echo -e "  ${GREEN}✓${NC} npm $(npm --version)"

# Semgrep
if command -v semgrep &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Semgrep $(semgrep --version 2>/dev/null | head -1)"
else
    echo -e "  ${YELLOW}⚠${NC} Semgrep not installed (pip install semgrep)"
    SKIP_SEMGREP=true
fi

# OWASP ZAP (zaproxy)
if command -v zaproxy &> /dev/null; then
    ZAP_VERSION=$(zaproxy -version 2>/dev/null | head -1 || echo "installed")
    echo -e "  ${GREEN}✓${NC} zaproxy ${ZAP_VERSION}"
elif [ -f "/usr/share/zaproxy/zap.sh" ]; then
    echo -e "  ${GREEN}✓${NC} zaproxy found at /usr/share/zaproxy/"
elif [ -f "/Applications/ZAP.app/Contents/Java/zap.sh" ]; then
    echo -e "  ${GREEN}✓${NC} zaproxy found (macOS app)"
else
    echo -e "  ${YELLOW}⚠${NC} zaproxy not found - install from https://www.zaproxy.org/download/"
    echo -e "      Ubuntu/Debian: sudo apt install zaproxy"
    echo -e "      macOS: brew install --cask zap"
    SKIP_ZAP=true
fi

# Install Node dependencies if needed
if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
    echo -e "\n${BLUE}[*] Installing Node dependencies...${NC}"
    cd "$SCRIPT_DIR"
    npm install
fi

echo ""

# Create reports directory
REPORT_DIR="./reports"
mkdir -p "$REPORT_DIR"

# ============================================================================
# RUN TESTS
# ============================================================================

# Browser-only mode
if [ "$BROWSER_ONLY" = true ]; then
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}[*] Running Authenticated Browser Scan Only${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    CONFIG_ABS_PATH=$(realpath "$CONFIG_FILE")
    node "$SCRIPT_DIR/modules/browser-scanner.js" --config "$CONFIG_ABS_PATH"
    exit $?
fi

if [ "$LIVE_ONLY" = true ]; then
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}[*] Running Live Firebase Tests Only${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    CONFIG_ABS_PATH=$(realpath "$CONFIG_FILE")
    node "$SCRIPT_DIR/modules/live-scanner.js" --config "$CONFIG_ABS_PATH"
    exit $?
fi

# 1. Main Scanner (Static Analysis + Semgrep + ZAP + SCA)
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}[1/5] Running Main Security Scanner${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd "$SCRIPT_DIR"

CMD="node scanner.js --config $CONFIG_FILE"
[ "$SKIP_ZAP" = true ] && CMD="$CMD --skip-zap"
[ "$SKIP_SEMGREP" = true ] && CMD="$CMD --skip-semgrep"
[ "$SKIP_SCA" = true ] && CMD="$CMD --skip-sca"
[ "$SKIP_LIVE" = true ] && CMD="$CMD --skip-live"

eval $CMD

# 2. Live Firebase Tests
if [ "$SKIP_LIVE" = false ]; then
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}[5/5] Running Live Firebase Tests${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Pass the absolute path to the config file
    CONFIG_ABS_PATH=$(realpath "$CONFIG_FILE")
    node "$SCRIPT_DIR/modules/live-scanner.js" --config "$CONFIG_ABS_PATH"
fi

# 3. Browser-based Authenticated Scan (optional)
if [ "$BROWSER_SCAN" = true ]; then
    echo -e "\n${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${MAGENTA}[BONUS] Running Authenticated Browser Scan (Puppeteer + ZAP)${NC}"
    echo -e "${MAGENTA}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    
    
    CONFIG_ABS_PATH=$(realpath "$CONFIG_FILE")
    node "$SCRIPT_DIR/modules/browser-scanner.js" --config "$CONFIG_ABS_PATH"
fi

CONFIG_ABS_PATH=$(realpath "$CONFIG_FILE")
node "$SCRIPT_DIR/modules/combine-reports.js" --config "$CONFIG_ABS_PATH"


# ============================================================================
# FINAL SUMMARY
# ============================================================================

echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}[✓] Security Scan Complete${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "\nReports generated in: ${CYAN}$REPORT_DIR/${NC}"
ls -la "$REPORT_DIR"/*.{json,html,md} 2>/dev/null || true

echo -e "\n${CYAN}View HTML report:${NC} open $REPORT_DIR/security-report.html"


