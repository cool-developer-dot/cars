#!/usr/bin/env bash
# Renders the plate art for the 4D, 5D, Bevel and Ghost product pages (and the shared
# finish close-ups) with headless Blender, using the settings tuned for the 3D
# page's look. PNGs land in $OUT; scripts/export-product-art.py turns them into
# the WebPs under public/.
#   bash scripts/render-product-art.sh <out-dir> [preview|final] [product ...]
# products: 4d 5d bevel ghost finishes (default: all). ONLY="hero care" limits the shots.
set -euo pipefail
cd "$(dirname "$0")"
OUT=$(cd "${1:?out dir}" && pwd)
MODE=${2:-final}
shift 2 || true
WHAT=${*:-4d 5d bevel ghost finishes}
B=/Applications/Blender.app/Contents/MacOS/Blender

want() { [ -z "${ONLY:-}" ] || [[ " $ONLY " == *" $1 "* ]]; }
# (a skipped shot's `want` is false; the loop ends with `:` so that isn't the exit status)

run() { # script out [args...] — env comes from the caller
  local script=$1 out=$2
  shift 2
  "$B" -b --factory-startup --python "$script" -- "$MODE" "$out" "$@" 2>&1 | grep -E "DONE|Error|Traceback" || true
}

finish_of() {
  case $1 in
    4d) echo acrylic ;;
    5d) echo acrylicGel ;;
    bevel) echo bevel ;;
    ghost) echo ghost ;;
  esac
}

for p in $WHAT; do
  if [ "$p" = finishes ]; then
    for f in gel acrylic acrylicGel bevel ghost; do
      (export EXP=-2.2 LENS=68 FST=14 TX=0.022 TY=0.016 GSC=1.4
       run render-finish-char.py "$OUT/finish-$f.png" "$f")
    done
    continue
  fi
  f=$(finish_of "$p")

  # hero: white + yellow pair on the glitter-navy floor, seen from above
  want hero && (export WT=0 KEY=20 GLIT=0.07 SPARK=120 VS=700 RZ=20 \
     YX=0.27 YY=-0.101 WY=0.0 WZ=0.0042 GX=0.3 GS=2.6 GY=4.0 GZ=1.3 LENS=42 FX=0.12 FY=-0.05 \
     CX=-0.04 CY=-0.84 CZ=0.56 TX=0.15 TY=-0.04 SX=-0.05 SY=-0.03 FR=0.3 RIP=18 RIPS=0.4 \
     FC=0.6 FCR=0.12 GLOW=120 RW=2000 RH=1000
   run render-plates-hero.py "$OUT/$p-hero.png" "$f")

  # "What are … plates?": white over yellow, standing on a wet navy floor (public/3d/gel-plates.webp's look)
  want intro && (export ROLL=-11 CH=0.009 TZ=0.11 GLOW=0 RIMW=0.002 FR=0.3 FC=0.6 FCR=0.15 RIPS=0.35 \
     YAW=-8 CX=-0.2 CY=-0.78 CZ=0.36 TX=0.05 SIDEG=0 STRIP=26 SHEEN=22 FILL=3 SX=-0.01 LENS=43 \
     YG=0.55 KEY=16 EXP=-1.1 STR=12 FST=2.8 RW=1522 RH=1010
   run render-plates-stack.py "$OUT/$p-intro.png" "$f")

  # care: wet macro of the whole registration, kept to the right of the frame
  want care && (export FINISH=$f RZ=-6 CX=0.2 CY=-0.2 CZ=0.12 LENS=42 TX=0.02 FX=0.06 SX=-0.08 \
     FST=5 FB=10 RW=1920 RH=1100 CH=0.0034 EXP=-2.8
   run render-plate-macro.py "$OUT/$p-care.png")

  # closing call to action: low close-up along the registration
  want cta && (export FINISH=$f FST=4 FB=10 RW=1610 RH=884 CH=0.0034 EXP=-3.2 RZ=14 CX=-0.2 CY=-0.24 CZ=0.13 \
     LENS=60 TX=-0.04 FX=-0.06
   run render-plate-macro.py "$OUT/$p-cta.png")

  # guides + reviews band: the pair on a wet bumper (the 3D page's settings)
  want guides && (export FINISH=$f CH=0.010 RZ=-17 RX=0 TX=0.04 TY=0.06 FX=0.1 FY=-0.02 CX=0.2 CY=-0.38 CZ=0.36 \
     SLR=0.07 BB=800 TOP=12 LENS=36 SX=-0.1 SY=-0.07 RW=2160 RH=600
   run render-plates-pair.py "$OUT/$p-guides.png")
  want guides && (export FINISH=$f CH=0.010 RZ=-17 RX=0 TX=0.04 TY=0.06 FX=0.1 FY=-0.02 CX=0.2 CY=-0.38 CZ=0.36 \
     SLR=0.07 BB=800 TOP=12 LENS=36 SX=-0.05 SY=-0.07 RW=1100 RH=592
   run render-plates-pair.py "$OUT/$p-guides-mobile.png")
  :
done
