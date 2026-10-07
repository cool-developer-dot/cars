# Turns the renders from render-product-art.sh and photo-plates.py into the
# WebPs the style pages load, at the same sizes as the 3D page's files.
#   python3 scripts/export-product-art.py <render-dir> <photo-dir-root> [page ...]
# <photo-dir-root>/<photos>/ holds photo-plates.py output (by finish for the style
# pages, by page for Standard and the speciality pages). Files not rendered yet
# are skipped, so a partial batch exports what it has.
import os, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.join(HERE, "..", "public")
# page -> its folder of car-photo composites
FINISH = {
    "4d": "acrylic",
    "5d": "acrylicGel",
    "bevel": "bevel",
    "ghost": "ghost",
    "standard": "standard",
    "short": "short",
    "oversized": "oversized",
    "show": "show",
    "ev": "ev",
}
# format comparison cards: render -> public/formats/<name>.webp
CARDS = ("standard-front", "standard-rear", "short", "oversized", "show", "ev")

# render name -> [(file, width, height)]
RENDERS = {
    "hero": [("hero", 2000, 1000), ("hero-mobile", 1200, 600)],
    "intro": [("intro", 1522, 1010)],
    "care": [("care", 1920, 1100), ("care-mobile", 960, 550)],
    "cta": [("cta", 805, 442), ("cta-mobile", 680, 373)],
    "guides": [("guides", 2160, 600)],
    "guides-mobile": [("guides-mobile", 1100, 592)],
}
PHOTOS = {
    "legal-car": [("legal-car", 1492, 868)],
    "faq-car": [("faq-car", 1050, 1113), ("faq-car-mobile", 700, 742)],
    "replace-cracked": [("replace-cracked", 640, 568)],
    "replace-lost": [("replace-lost", 752, 568)],
    "replace-match": [("replace-match", 666, 666)],
}


def save(src, dst, w, h, q=82):
    if not os.path.exists(src):
        return
    im = Image.open(src).convert("RGB")
    if im.size != (w, h):
        im = im.resize((w, h), Image.LANCZOS)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    im.save(dst, "WEBP", quality=q, method=6)
    print(f"{os.path.relpath(dst, PUBLIC)}  {w}x{h}  {os.path.getsize(dst) // 1024}KB")


def main():
    renders, photos = sys.argv[1], sys.argv[2]
    pages = sys.argv[3:] or list(FINISH)
    for page, finish in FINISH.items():
        if page not in pages:
            continue
        for name, outs in RENDERS.items():
            for out, w, h in outs:
                save(os.path.join(renders, f"{page}-{name}.png"), os.path.join(PUBLIC, page, out + ".webp"), w, h)
        for name, outs in PHOTOS.items():
            for out, w, h in outs:
                save(os.path.join(photos, finish, name + ".png"), os.path.join(PUBLIC, page, out + ".webp"), w, h)
    # the finish close-ups shared by every page's comparison cards
    for finish, out in (("gel", "gel"), ("acrylic", "acrylic"), ("acrylicGel", "acrylic-gel"), ("bevel", "bevel"),
                        ("ghost", "ghost"), ("printed", "printed")):
        save(os.path.join(renders, f"finish-{finish}.png"), os.path.join(PUBLIC, "finishes", out + ".webp"), 580, 464)
    for card in CARDS:
        save(os.path.join(renders, f"card-{card}.png"), os.path.join(PUBLIC, "formats", card + ".webp"), 580, 464)


if __name__ == "__main__":
    main()
