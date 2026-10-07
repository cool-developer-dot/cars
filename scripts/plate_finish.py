# Character builder shared by the plate render scripts: one function makes the
# raised characters for any of the site's finishes, so every product page's art
# is built the same way.
#
#   gel         3D gel: domed polyurethane resin, soft rounded edge
#   acrylic     4D: laser-cut solid acrylic, flat top, sharp vertical walls
#   acrylicGel  5D (4D gel): a 4D acrylic base with a domed gel layer on top
#   bevel       Bevel: acrylic with an angled, diamond-cut (chamfered) edge
#   ghost       Ghost: domed characters in a dark smoked tint (the builder's
#               "dark smoked characters for a stealth look")
#   printed     Standard: flat printed characters under the plate's clear face
#
# Plate formats (env, read by every scene script through the helpers below):
#   REG="A12 BCD"      the registration (default AB12 CDE)
#   GROUP_GAP=11       gap between the two groups in mm (11 = no extra gap: a
#                      show plate's custom spacing; default 33, the legal gap)
#   PLATE_W/PLATE_H    front (white) plate size in mm (default 520 x 111)
#   REAR_W/REAR_H      rear (yellow) plate size in mm (default: the front's)
#   BORDER=1           a thin black border round the plate face (a builder option)
#   FLASH=1            a green flash at the left of both plates (EV plates);
#                      the characters move right to make room, as the builder does
#
# Usage from a render script (Blender's own Python):
#   sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
#   import plate_finish
#   chars = plate_finish.build(sc, "WChars", "acrylic", font=..., size=0.106, height=0.012)
#   chars.location = (x, y, plate_top_z)
#
# PLATE_FONT=font (env) keeps the scripts' fonts; by default every build uses
# the plate characters below, whatever font the caller passes.
# font=None draws the registration in the UK number-plate style instead of a
# font (see GLYPHS): 79mm characters, 50mm wide, 11mm apart, a 33mm gap between
# the two groups, chamfered corners, as on a real plate. `size` and the
# spacing arguments are ignored then; the layout is the legal one, in metres.
#
# The returned object is an empty at the plate surface (z = 0 is the face of
# the plate); the character geometry sits on top of it. Anything below the
# face (the curve's lower bevel) is buried in the plate.
import os

import bpy

FINISHES = ("gel", "acrylic", "acrylicGel", "bevel", "ghost", "printed")


def _mat(name, base, rough, coat, coat_rough, ior=1.49, trans=0.0):
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = base
    b.inputs["Roughness"].default_value = rough
    b.inputs["IOR"].default_value = ior
    for k, v in (("Coat Weight", coat), ("Coat Roughness", coat_rough), ("Transmission Weight", trans)):
        if k in b.inputs:
            b.inputs[k].default_value = v
    return m


def materials():
    """Black, non-reflective-by-law characters: gloss comes from the clear surface only."""
    return {
        # resin dome: very glossy clear coat over black
        "gel": _mat("FinishGel", (0.002, 0.002, 0.003, 1), 0.22, 1.0, 0.045, 1.45),
        # cut acrylic: polished faces, slightly crisper than the gel
        "acrylic": _mat("FinishAcrylic", (0.0025, 0.0025, 0.0032, 1), 0.12, 0.85, 0.03),
        # bevel facets: a touch smoother so each facet catches its own highlight
        "bevel": _mat("FinishBevel", (0.0022, 0.0022, 0.003, 1), 0.07, 0.9, 0.02),
        # smoked resin: a dark grey tint the plate face glows faintly through
        # (GHOST_TONE / GHOST_TRANS deepen it where a scene brightens it, e.g. the car photos)
        # print under the acrylic face: matte black with the face's gloss over it
        "printed": _mat("FinishPrinted", (0.003, 0.003, 0.004, 1), 0.5, 0.25, 0.08),
        "ghost": _mat("FinishGhost", (*(float(os.environ.get("GHOST_TONE", "0.075")) * k for k in (1, 1.09, 1.33)), 1),
                      0.12, 1.0, 0.04, 1.45, trans=float(os.environ.get("GHOST_TRANS", "0.62"))),
    }


def _text(sc, name, font, size, spc, spw, body):
    fc = bpy.data.curves.new(name, "FONT")
    fc.body = body
    fc.font = font
    fc.size = size
    fc.align_x = "CENTER"
    fc.align_y = "CENTER"
    fc.space_character = spc
    fc.space_word = spw
    o = bpy.data.objects.new(name, fc)
    sc.collection.objects.link(o)
    return o, fc


# ——— UK number-plate characters ———
# Each glyph is a list of closed outlines in millimetres (origin bottom-left,
# 79mm tall): the first is the outside, any others are holes. Corners are
# chamfered the way plate characters are.
CHAR_H = 79.0
GLYPHS = {
    "A": (50, [
        [(0, 0), (14.3, 0), (17.7, 16), (32.3, 16), (35.7, 0), (50, 0), (33, 79), (17, 79)],
        [(20.5, 29), (29.5, 29), (25, 49.8)],
    ]),
    "B": (50, [
        [(0, 0), (40, 0), (50, 10), (50, 32), (44, 39.5), (50, 47), (50, 69), (40, 79), (0, 79)],
        [(14, 13), (31, 13), (36.5, 18.5), (36.5, 27.5), (31, 33), (14, 33)],
        [(14, 46), (30.5, 46), (36, 51.5), (36, 60.5), (30.5, 66), (14, 66)],
    ]),
    "1": (26, [
        [(12, 0), (26, 0), (26, 79), (15, 79), (1, 67), (1, 53), (12, 63)],
    ]),
    "2": (50, [
        [(0, 0), (50, 0), (50, 13), (19, 13), (47, 39), (50, 44), (50, 69), (40, 79), (10, 79), (0, 69),
         (0, 57), (14, 57), (14, 61), (19, 66), (31, 66), (36, 61), (36, 49), (33, 45), (0, 14)],
    ]),
    "C": (50, [
        [(10, 0), (40, 0), (50, 10), (50, 22), (36, 22), (36, 18), (31, 13), (19, 13), (14, 18), (14, 61),
         (19, 66), (31, 66), (36, 61), (36, 57), (50, 57), (50, 69), (40, 79), (10, 79), (0, 69), (0, 10)],
    ]),
    "D": (50, [
        [(0, 0), (38, 0), (50, 12), (50, 67), (38, 79), (0, 79)],
        [(14, 13), (30.5, 13), (36, 18.5), (36, 60.5), (30.5, 66), (14, 66)],
    ]),
    "E": (50, [
        [(0, 0), (50, 0), (50, 13), (14, 13), (14, 33), (42, 33), (42, 46), (14, 46), (14, 66), (50, 66),
         (50, 79), (0, 79)],
    ]),
}
CHAR_GAP = 11.0
GROUP_GAP = float(os.environ.get("GROUP_GAP", "33"))
# the EV green flash: a band at the plate's left edge (as the builder draws it)
FLASH_W, FLASH_INSET = 34.0, 4.0


def env_on(name):
    return os.environ.get(name, "0") not in ("", "0")


def plate_size(rear=False, default=(0.520, 0.111)):
    """(width, height) in metres of the front or rear plate for this run."""
    w = float(os.environ.get("PLATE_W", default[0] * 1000)) / 1000
    h = float(os.environ.get("PLATE_H", default[1] * 1000)) / 1000
    if rear:
        w = float(os.environ.get("REAR_W", w * 1000)) / 1000
        h = float(os.environ.get("REAR_H", h * 1000)) / 1000
    return w, h


def char_shift():
    """How far right the registration sits to clear the green flash, in metres."""
    return (FLASH_W + FLASH_INSET) / 2000 if env_on("FLASH") else 0.0


def add_flash(sc, name, parent, w, h, z=0.0003, corner=0.004):
    """A green flash on a plate whose face is the parent's XY plane at height z."""
    if not env_on("FLASH"):
        return None
    import bmesh
    m = bpy.data.materials.get("Flash") or _mat("Flash", (0.02, 0.36, 0.08, 1), 0.35, 0.5, 0.06)
    fw, ins = FLASH_W / 1000, FLASH_INSET / 1000
    x0, x1 = -w / 2 + ins, -w / 2 + ins + fw
    y0, y1 = -h / 2 + ins, h / 2 - ins
    bm = bmesh.new()
    vs = [bm.verts.new(v) for v in ((x0, y0, 0), (x1, y0, 0), (x1, y1, 0), (x0, y1, 0))]
    bm.faces.new(vs)
    bmesh.ops.bevel(bm, geom=vs, offset=corner, segments=6, profile=0.5, affect="VERTICES")
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    me.materials.append(m)
    o = bpy.data.objects.new(name, me)
    sc.collection.objects.link(o)
    o.parent = parent
    o.location = (0, 0, z)
    return o


def _area(pts):
    return sum(x0 * y1 - x1 * y0 for (x0, y0), (x1, y1) in zip(pts, pts[1:] + pts[:1])) / 2


def _plate_curve(sc, name, body, scale=1.0):
    """The registration as one 2D curve (holes included), centred on the origin, in metres."""
    widths = []
    for ch in body:
        widths.append(GROUP_GAP - CHAR_GAP if ch == " " else GLYPHS[ch][0])
    total = sum(widths) + CHAR_GAP * (len([c for c in body if c != " "]) - 1)
    cu = bpy.data.curves.new(name, "CURVE")
    cu.dimensions = "2D"
    cu.fill_mode = "BOTH"
    x = -total / 2 + char_shift() * 1000 / scale
    for ch, w in zip(body, widths):
        if ch != " ":
            for i, outline in enumerate(GLYPHS[ch][1]):
                pts = list(outline)
                # outsides anticlockwise, holes clockwise
                if (_area(pts) > 0) != (i == 0):
                    pts.reverse()
                sp = cu.splines.new("POLY")
                sp.points.add(len(pts) - 1)
                for p, (px, py) in zip(sp.points, pts):
                    p.co = ((x + px) * scale / 1000, (py - CHAR_H / 2) * scale / 1000, 0, 1)
                sp.use_cyclic_u = True
            x += w + CHAR_GAP
        else:
            x += w
    o = bpy.data.objects.new(name, cu)
    sc.collection.objects.link(o)
    return o, cu


def build(sc, name, finish, *, font=None, size=0.11, height, spc=1.04, spw=0.9, body="AB12 CDE", glyph_scale=1.0):
    """Characters of `finish`, `height` metres tall above the plate face.
    glyph_scale enlarges the plate characters (close-ups of a single one)."""
    if os.environ.get("PLATE_FONT", "plate") == "plate":
        font = None
        if body == "AB12 CDE":
            # (an underscore stands for the space, for shells that split on it)
            body = os.environ.get("REG", body).replace("_", " ")
    if finish not in FINISHES:
        raise ValueError(f"unknown finish {finish!r}; expected one of {FINISHES}")
    if isinstance(font, str):
        font = bpy.data.fonts.load(font, check_existing=True)
    mats = materials()

    root = bpy.data.objects.new(name, None)
    sc.collection.objects.link(root)

    def part(suffix, extrude, depth, res, offset, mat, z):
        if font is None:
            o, fc = _plate_curve(sc, name + suffix, body, glyph_scale)
        else:
            o, fc = _text(sc, name + suffix, font, size, spc, spw, body)
        fc.extrude = extrude
        fc.bevel_depth = depth
        fc.bevel_resolution = res
        fc.offset = offset
        o.data.materials.append(mat)
        o.parent = root
        o.location = (0, 0, z)
        return o

    h = height
    # a bevel wider than about a fifth of the stroke folds the outline in on itself
    # (plate characters have a 14mm stroke)
    cap = 0.0042 * glyph_scale if font is None else size * 0.024
    if finish == "printed":
        # ink, not relief: a hair of thickness so it renders, no edges to catch light
        part("", 0.00004, 0.0, 0, 0.0, mats["printed"], 0.0)
    elif finish in ("gel", "ghost"):
        # thin core, big round bevel: a dome whose edge rolls into the plate
        b = min(h * 0.55, cap)
        e = h - b
        part("", e, b, 5, 0.0, mats[finish], 0.0)
    elif finish == "acrylic":
        # tall vertical wall, a hair of edge softening so highlights read
        # (a plate-scale character gets a slightly wider arris, so its edge reads)
        b = min(0.0005 if font is None else 0.00022, h * 0.06)
        e = h - b
        part("", e, b, 3, -b, mats["acrylic"], 0.0)
    elif finish == "acrylicGel":
        # 4D base (about 60% of the height) ...
        hb = h * 0.62
        b = min(0.0004 if font is None else 0.0002, hb * 0.06)
        e = hb - b
        part("Base", e, b, 3, -b, mats["acrylic"], 0.0)
        # ... capped with a domed gel layer the same outline as the base.
        # The cap is a flat pillow centred on the base's top face, so its lower
        # half is hidden inside the acrylic and only the dome shows.
        cb = min(h - hb, cap)
        part("Gel", cb * 0.08, cb, 6, -cb * 0.92, mats["gel"], hb)
    else:  # bevel
        # short wall, wide 45-degree chamfer: the faceted, diamond-cut edge
        b = min(h * 0.7, cap * 1.15)
        e = h - b
        part("", e, b, 0, -b, mats["bevel"], 0.0)
    return root


def add_border(sc, name, parent, w, h, z=0.0003, inset=0.0045, width=0.003, corner=0.008):
    """BORDER=1: a black rounded-rectangle ring on the plate face (parent's XY plane at z)."""
    if not env_on("BORDER"):
        return None
    import bmesh
    m = bpy.data.materials.get("BorderInk") or _mat("BorderInk", (0.004, 0.004, 0.005, 1), 0.45, 0.5, 0.06)

    def outline(hw, hh, r):
        bm = bmesh.new()
        vs = [bm.verts.new(v) for v in ((-hw, -hh, 0), (hw, -hh, 0), (hw, hh, 0), (-hw, hh, 0))]
        bm.faces.new(vs)
        bmesh.ops.bevel(bm, geom=vs, offset=r, segments=6, profile=0.5, affect="VERTICES")
        bm.faces.ensure_lookup_table()
        pts = [v.co.copy() for v in bm.faces[0].verts]
        bm.free()
        return pts

    ow, oh = w / 2 - inset, h / 2 - inset
    outer = outline(ow, oh, corner)
    inner = outline(ow - width, oh - width, max(corner - width, 0.001))
    # a 2D curve with the inner outline as a hole fills exactly the ring
    cu = bpy.data.curves.new(name, "CURVE")
    cu.dimensions = "2D"
    cu.fill_mode = "BOTH"
    for i, pts in enumerate((outer, inner)):
        sp = cu.splines.new("POLY")
        sp.points.add(len(pts) - 1)
        for p, co in zip(sp.points, pts if i == 0 else list(reversed(pts))):
            p.co = (co.x, co.y, 0, 1)
        sp.use_cyclic_u = True
    cu.extrude = 0.00004
    cu.materials.append(m)
    o = bpy.data.objects.new(name, cu)
    sc.collection.objects.link(o)
    o.parent = parent
    o.location = (0, 0, z)
    return o
