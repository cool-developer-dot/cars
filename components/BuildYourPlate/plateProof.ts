import { plateFont } from "@/lib/fonts";
import { COMPANY } from "@/lib/site";
import { sizeById, styleById, type BuildState } from "./buildConfig";

/*
 * Order proof: a flat, to-scale PNG of every plate in the order, sent to the
 * backend as `preview_base64` (the client's builder sent a canvas snapshot).
 * Flat on purpose — it's what the workshop makes the plate from, so layout
 * and text matter more than lighting.
 */

const PX_PER_MM = 2;
const GAP = 24;
const PAD = 24;

type Side = "front" | "rear";

function plateOutline(ctx: CanvasRenderingContext2D, W: number, H: number, hex: boolean, inset = 0) {
  ctx.beginPath();
  if (hex) {
    const c = H * 0.2;
    ctx.moveTo(c + inset, inset);
    ctx.lineTo(W - c - inset, inset);
    ctx.lineTo(W - inset, H / 2);
    ctx.lineTo(W - c - inset, H - inset);
    ctx.lineTo(c + inset, H - inset);
    ctx.lineTo(inset, H / 2);
    ctx.closePath();
  } else {
    ctx.roundRect(inset, inset, W - inset * 2, H - inset * 2, Math.max(2, 7 - inset * 0.5));
  }
}

function drawFlag(ctx: CanvasRenderingContext2D, badge: string, x: number, y: number, w: number) {
  const h = (w * 2) / 3;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(w / 60, h / 40);
  const line = (d: [number, number, number, number][], color: string, width: number) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    for (const [x1, y1, x2, y2] of d) {
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    ctx.stroke();
  };
  const diag: [number, number, number, number][] = [[0, 0, 60, 40], [60, 0, 0, 40]];
  const cross: [number, number, number, number][] = [[30, 0, 30, 40], [0, 20, 60, 20]];
  ctx.beginPath();
  ctx.rect(0, 0, 60, 40);
  ctx.clip();
  if (badge === "uk") {
    ctx.fillStyle = "#012169";
    ctx.fillRect(0, 0, 60, 40);
    line(diag, "#fff", 8);
    line(diag, "#C8102E", 4);
    line(cross, "#fff", 12);
    line(cross, "#C8102E", 6);
  } else if (badge === "eng") {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 60, 40);
    line(cross, "#CE1124", 8);
  } else if (badge === "sco") {
    ctx.fillStyle = "#005EB8";
    ctx.fillRect(0, 0, 60, 40);
    line(diag, "#fff", 7);
  }
  ctx.restore();
}

function drawPlate(ctx: CanvasRenderingContext2D, s: BuildState, side: Side, family: string) {
  const size = sizeById(side === "front" ? s.frontSize : s.rearSize);
  const W = size.widthMm;
  const H = size.heightMm;
  const finish = styleById(s.styleId).finish;
  const text = s.reg.trim() || "YOUR REG";

  // Face
  plateOutline(ctx, W, H, s.hex);
  ctx.fillStyle = side === "front" ? "#f7f8fa" : "#fcca0f";
  ctx.fill();
  ctx.lineWidth = 0.8;
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.stroke();
  if (finish === "ghost") {
    ctx.fillStyle = "rgba(12,14,20,0.35)";
    ctx.fill();
  }

  if (s.border === "black") {
    plateOutline(ctx, W, H, s.hex, 4.5);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";
    ctx.stroke();
  }

  // Side badge
  let left = 0;
  if (s.badge !== "none") {
    const bw = s.badge === "ev" ? 34 : 44;
    left = 4 + bw;
    ctx.beginPath();
    ctx.roundRect(4, 4, bw, H - 8, 4);
    ctx.fillStyle = s.badge === "ev" ? "#1fa84f" : "#1a3fb4";
    ctx.fill();
    if (s.badge !== "ev") {
      drawFlag(ctx, s.badge, 4 + bw * 0.16, 4 + (H - 8) * 0.14, bw * 0.68);
      const code = { uk: "UK", eng: "ENG", sco: "SCO" }[s.badge];
      ctx.fillStyle = "#fff";
      ctx.font = `700 ${code.length > 2 ? 13 : 15}px system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(code, 4 + bw / 2, H - 4 - (H - 8) * 0.14);
    }
  }

  // Characters — same metrics as the on-screen render
  const hexPad = s.hex ? H * 0.12 : 0;
  const available = W - left - 22 - hexPad * 2;
  const chars = text.replace(/ /g, "").length;
  const spaces = text.length - chars;
  const widthEm = chars * 0.54 + spaces * 0.28 - 0.08;
  const fontSize = Math.min(79 / 0.7, available / widthEm);
  ctx.font = `700 ${fontSize}px ${family}`;
  ctx.letterSpacing = `${fontSize * 0.08}px`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = finish === "ghost" ? "#23272e" : "#0b0c0e";
  const cx = left + (W - left) / 2 + fontSize * 0.04;
  const baseline = H / 2 + (fontSize * 0.7) / 2 - H * 0.025;
  if (finish !== "standard") {
    // A hint of relief so the proof shows raised characters at a glance
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillText(text, cx + 1.2, baseline + 2.2);
    ctx.restore();
  }
  ctx.fillText(text, cx, baseline);
  ctx.letterSpacing = "0px";

  // Supplier marking
  ctx.font = `600 5px system-ui, sans-serif`;
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillText(`${COMPANY.brand} · RNPS ${COMPANY.rnps} · BS AU 145e`.toUpperCase(), cx, H - 4.5);
}

/** Render the order's plates to a PNG data URL, or null if the browser can't */
export async function renderPlateProof(s: BuildState): Promise<string | null> {
  try {
    const family = plateFont.style.fontFamily;
    await document.fonts.load(`700 100px ${family}`);

    const sides: Side[] = s.amount === "both" ? ["front", "rear"] : [s.amount];
    const sizes = sides.map((side) => sizeById(side === "front" ? s.frontSize : s.rearSize));
    const widthMm = Math.max(...sizes.map((z) => z.widthMm));
    const heightMm = sizes.reduce((sum, z) => sum + z.heightMm, 0) + GAP * (sides.length - 1);

    const canvas = document.createElement("canvas");
    canvas.width = Math.round((widthMm + PAD * 2) * PX_PER_MM);
    canvas.height = Math.round((heightMm + PAD * 2) * PX_PER_MM);
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(PX_PER_MM, PX_PER_MM);

    let y = PAD;
    sides.forEach((side, i) => {
      ctx.save();
      // Centre narrower plates
      ctx.translate(PAD + (widthMm - sizes[i].widthMm) / 2, y);
      drawPlate(ctx, s, side, family);
      ctx.restore();
      y += sizes[i].heightMm + GAP;
    });

    return canvas.toDataURL("image/png");
  } catch {
    return null;
  }
}
