# Swaps the number plate in the 3D page's car photos for a plate of another
# finish, so each style page shows its own characters in the same photos.
#
#   python3 scripts/photo-plates.py <work-dir> <finish> <out-dir> [photo ...]
#     finish: acrylic | acrylicGel | bevel | ghost | gel
#
# For each photo: the plate's four corners (hand-placed below) give a
# homography; from it we solve the focal length and the plate's apparent
# proportions, then the camera pose (solvePnP). Blender renders the new plate
# from that camera on a transparent background (render-plate-in-photo.py), we
# match its tone to the original plate, and paste it over the old one.
import json, os, subprocess, sys
import cv2
import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "public", "3d")
BLENDER = "/Applications/Blender.app/Contents/MacOS/Blender"

# Plate face corners in each photo: top-left, top-right, bottom-right, bottom-left
PHOTOS = {
    "legal-car": {"quad": [(246, 258), (1322, 132), (1291, 556), (228, 537)], "face": "white", "blur": 0.8},
    "faq-car": {"quad": [(477, 715), (855, 735), (850, 835), (476, 825)], "face": "white", "blur": 1.0},
    "replace-lost": {"quad": [(109, 323), (623, 373), (591, 550), (77, 445)], "face": "white", "blur": 0.9},
    "replace-match": {"quad": [(79, 171), (612, 271), (605, 508), (82, 340)], "face": "white", "blur": 1.0},
    # the rear plate runs off the right edge (corners extrapolated); the zoom
    # callout over its left end stays as it is
    "replace-cracked": {
        "quad": [(262, 246), (880, 171), (880, 341), (265, 494)],
        "border": 0.03,
        # extrapolated corners can't pin the lens down; use a normal one
        "f": 900,
        "face": "yellow",
        "blur": 0.9,
        "keep_circle": ((231, 215), 167),
    },
}


def solve(quad, w, h, f_fixed=None):
    """Focal length (px), plate aspect and pose from the plate's corners."""
    img = np.array(quad, dtype=np.float64)
    c = np.array([w / 2, h / 2])
    obj = np.array([(-0.5, 0.5), (0.5, 0.5), (0.5, -0.5), (-0.5, -0.5)], dtype=np.float64)
    H, _ = cv2.findHomography(obj, img - c)
    h1, h2 = H[:, 0], H[:, 1]
    f2 = -(h1[0] * h2[0] + h1[1] * h2[1]) / (h1[2] * h2[2])
    f = float(np.sqrt(f2)) if f2 > 0 else 1.4 * max(w, h)
    # an implausible lens (near-frontal views are ill-conditioned) falls back
    if not (0.6 * max(w, h) < f < 6 * max(w, h)):
        f = 1.4 * max(w, h)
    if f_fixed:
        f = f_fixed
    Ki = np.diag([1 / f, 1 / f, 1.0])
    aspect = np.linalg.norm(Ki @ h1) / np.linalg.norm(Ki @ h2)
    PW = 0.52
    PH = PW / aspect
    objp = np.array([(-PW / 2, PH / 2, 0), (PW / 2, PH / 2, 0), (PW / 2, -PH / 2, 0), (-PW / 2, -PH / 2, 0)])
    K = np.array([[f, 0, c[0]], [0, f, c[1]], [0, 0, 1]])
    ok, rvec, tvec = cv2.solvePnP(objp, img, K, None, flags=cv2.SOLVEPNP_IPPE)
    R, _ = cv2.Rodrigues(rvec)
    # OpenCV camera (x right, y down, z forward) -> Blender camera (y up, looks down -z)
    cam_rot = R.T @ np.diag([1, -1, -1])
    cam_loc = (-R.T @ tvec).ravel()
    return {
        "f": f, "w": w, "h": h, "pw": PW, "ph": PH,
        "loc": cam_loc.tolist(), "rot": cam_rot.tolist(),
    }


def main():
    work, finish, out_dir = sys.argv[1], sys.argv[2], sys.argv[3]
    names = sys.argv[4:] or list(PHOTOS)
    os.makedirs(work, exist_ok=True)
    os.makedirs(out_dir, exist_ok=True)
    for name in names:
        cfg = PHOTOS[name]
        photo = Image.open(os.path.join(SRC, name + ".webp")).convert("RGB")
        w, h = photo.size
        spec = solve(cfg["quad"], w, h, cfg.get("f"))
        spec.update(finish=finish, face=cfg["face"], scale=2, border=cfg.get("border", 0))
        spec_path = os.path.join(work, f"{name}-{finish}.json")
        json.dump(spec, open(spec_path, "w"))
        render = os.path.join(work, f"{name}-{finish}.png")
        env = dict(os.environ)
        if finish == "ghost":
            # the tone match lifts the smoked tint toward grey; start it deeper
            env.setdefault("GHOST_TONE", "0.03")
            env.setdefault("GHOST_TRANS", "0.3")
        subprocess.run(
            [BLENDER, "-b", "--factory-startup", "--python", os.path.join(HERE, "render-plate-in-photo.py"),
             "--", spec_path, render],
            check=True, capture_output=True, env=env,
        )
        plate = Image.open(render).convert("RGBA").resize((w, h), Image.LANCZOS)
        plate = match_tone(photo, plate, cfg["quad"], cfg.get("keep_circle"))
        if cfg.get("blur"):
            # the photos are soft; a crisp CG plate would stand out
            rgb = plate.convert("RGB").filter(ImageFilter.GaussianBlur(cfg["blur"]))
            plate = Image.merge("RGBA", (*rgb.split(), plate.split()[3].filter(ImageFilter.GaussianBlur(0.6))))
        if cfg.get("keep_circle"):
            (cx, cy), r = cfg["keep_circle"]
            hole = Image.new("L", photo.size, 255)
            from PIL import ImageDraw
            ImageDraw.Draw(hole).ellipse((cx - r, cy - r, cx + r, cy + r), fill=0)
            a = np.minimum(np.asarray(plate.split()[3]), np.asarray(hole))
            plate.putalpha(Image.fromarray(a))
        out = photo.copy()
        out.paste(plate, (0, 0), plate)
        out.save(os.path.join(out_dir, name + ".png"))
        print("done", name, f"f={spec['f']:.0f}px aspect={spec['pw'] / spec['ph']:.2f}")


def match_tone(photo, plate, quad, circle=None):
    """Scale the render's colours so its plate face matches the photo's."""
    mask = Image.new("L", photo.size, 0)
    from PIL import ImageDraw
    ImageDraw.Draw(mask).polygon(quad, fill=255)
    if circle:
        (cx, cy), r = circle
        ImageDraw.Draw(mask).ellipse((cx - r, cy - r, cx + r, cy + r), fill=0)
    p = np.asarray(photo, dtype=np.float32)
    m = np.asarray(mask) > 0
    r = np.asarray(plate, dtype=np.float32)
    ra = r[..., 3] > 250
    # face pixels: the bright ones (characters are near-black in both)
    def face(px):
        lum = px.mean(axis=1)
        return px[lum > np.percentile(lum, 55)]
    src = face(p[m])
    dst = face(r[ra][:, :3])
    gain = np.median(src, axis=0) / np.maximum(np.median(dst, axis=0), 1)
    r[..., :3] = np.clip(r[..., :3] * gain, 0, 255)
    return Image.fromarray(r.astype(np.uint8))


if __name__ == "__main__":
    main()
