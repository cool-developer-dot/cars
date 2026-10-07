# Renders one plate from a camera solved against a photo (see photo-plates.py),
# on a transparent background, ready to paste over the photo's own plate.
#   Blender -b --factory-startup --python render-plate-in-photo.py -- <spec.json> <out.png>
import bpy, bmesh, json, os, sys
from mathutils import Matrix, Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import plate_finish  # noqa: E402

argv = sys.argv[sys.argv.index("--") + 1:]
spec = json.load(open(argv[0]))
OUT = argv[1]

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = "CYCLES"
cy = sc.cycles
cy.device = "GPU"
prefs = bpy.context.preferences.addons["cycles"].preferences
try:
    prefs.compute_device_type = "METAL"
    prefs.get_devices()
    for d in prefs.devices:
        d.use = True
except Exception as e:
    print("gpu setup:", e)

S = spec.get("scale", 2)
sc.render.resolution_x = int(spec["w"] * S)
sc.render.resolution_y = int(spec["h"] * S)
sc.render.film_transparent = True
cy.samples = 128
cy.use_denoising = True
sc.view_settings.view_transform = "Khronos PBR Neutral"
sc.view_settings.look = "None"

world = bpy.data.worlds.new("W")
sc.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
# a dark garage: glossy black characters stay black, with only the lights in them
bg.inputs["Color"].default_value = (0.03, 0.035, 0.045, 1)
bg.inputs["Strength"].default_value = 1.0


def mat(name, base, rough, coat=0.0, metal=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = base
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if "Coat Weight" in b.inputs:
        b.inputs["Coat Weight"].default_value = coat
    return m


face_col = (0.8, 0.82, 0.85, 1) if spec["face"] == "white" else (1.0, 0.56, 0.02, 1)
face = mat("Face", face_col, 0.35, coat=0.3)
edge = mat("Edge", (0.85, 0.86, 0.88, 1), 0.3)

PW, PH = spec["pw"], spec["ph"]
# a hair larger than the measured face, so none of the old plate shows round it
GROW = 1.012
# The photo's plate is a standard 520 x 111mm one; this run's plate may be a
# short or oversized format (plate_finish.plate_size), drawn at the same scale.
rear = spec["face"] == "yellow"
real_w, real_h = plate_finish.plate_size(rear)
sx, sy = PW / 0.520, PH / 0.111
pw, ph = real_w * sx, real_h * sy
grow = GROW if real_w >= 0.52 else 1.0


def rounded(name, w, h, r, thick, mats, z=0.0):
    bm = bmesh.new()
    vs = [bm.verts.new(v) for v in ((-w / 2, -h / 2, 0), (w / 2, -h / 2, 0), (w / 2, h / 2, 0), (-w / 2, h / 2, 0))]
    bm.faces.new(vs)
    bmesh.ops.bevel(bm, geom=vs, offset=r, segments=6, profile=0.5, affect="VERTICES")
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(name, me)
    sc.collection.objects.link(o)
    o.location.z = z
    if thick:
        sol = o.modifiers.new("Solid", "SOLIDIFY")
        sol.thickness = thick
        sol.offset = -1
        bpy.context.view_layer.objects.active = o
        bpy.ops.object.modifier_apply(modifier="Solid")
    for m in mats:
        me.materials.append(m)
    if len(mats) > 1:
        for p in me.polygons:
            p.material_index = 0 if p.normal.z > 0.7 else 1
    return o


plate = rounded("Plate", pw * grow, ph * grow, min(pw, ph) * 0.07, 0.004, [face, edge])

if real_w < 0.52:
    # a short plate leaves part of the recess bare: a dark mounting panel the
    # size of the old plate covers it, as the car's own plate surround would
    panel = mat("Recess", (0.012, 0.013, 0.016, 1), 0.55)
    rounded("Recess", PW * GROW, PH * GROW, min(PW, PH) * 0.07, 0.0, [panel], z=-0.0045)

if spec.get("border"):
    # the black edge band some plates (rear, in the photos) have round the face
    b = spec["border"] * ph
    rounded("Border", pw * grow + 2 * b, ph * grow + 2 * b, min(pw, ph) * 0.09, 0.0,
            [mat("BorderBlack", (0.01, 0.01, 0.012, 1), 0.4)], z=-0.0006)

chars = plate_finish.build(
    sc, "Chars", spec["finish"],
    font="/System/Library/Fonts/Supplemental/DIN Alternate Bold.ttf",
    size=0.11, height=spec.get("ch", 0.0065), spc=1.05, spw=1.1,
)
legal = os.environ.get("PLATE_FONT", "plate") == "plate"
if legal:
    # plate characters, flash and border are laid out in real millimetres on a
    # face scaled to the photo's plate
    face_rig = bpy.data.objects.new("Face", None)
    sc.collection.objects.link(face_rig)
    face_rig.scale = (sx, sy, 1)
    chars.parent = face_rig
    chars.location = (0, 0, 0.0002)
    plate_finish.add_flash(sc, "Flash", face_rig, real_w, real_h)
    plate_finish.add_border(sc, "BorderInk", face_rig, real_w, real_h)
else:
    # fit the registration to the plate as the photo's own characters sit
    bpy.context.view_layer.update()
    lo = Vector((1e9, 1e9))
    hi = Vector((-1e9, -1e9))
    for o in chars.children:
        for c in o.bound_box:
            wc = o.matrix_world @ Vector(c)
            lo.x, lo.y = min(lo.x, wc.x), min(lo.y, wc.y)
            hi.x, hi.y = max(hi.x, wc.x), max(hi.y, wc.y)
    cw, chh = hi.x - lo.x, hi.y - lo.y
    chars.scale = (PW * 0.84 / cw, PH * spec.get("char_h", 0.66) / chh, 1)
    chars.location = (-(lo.x + hi.x) / 2 * chars.scale.x, -(lo.y + hi.y) / 2 * chars.scale.y, 0.0002)

cam_d = bpy.data.cameras.new("Cam")
cam_d.sensor_fit = "HORIZONTAL"
cam_d.sensor_width = 36
cam_d.lens = spec["f"] * 36 / spec["w"]
cam = bpy.data.objects.new("Cam", cam_d)
sc.collection.objects.link(cam)
sc.camera = cam
R = Matrix(spec["rot"])
cam.matrix_world = Matrix.Translation(Vector(spec["loc"])) @ R.to_4x4()


def area(name, loc, size, energy, color=(1, 1, 1), sy=None, glossy=False):
    l = bpy.data.lights.new(name, "AREA")
    l.shape = "RECTANGLE"
    l.size = size
    l.size_y = sy or size
    l.energy = energy
    l.color = color
    o = bpy.data.objects.new(name, l)
    sc.collection.objects.link(o)
    o.location = loc
    o.rotation_euler = (Vector((0, 0, 0)) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    o.visible_glossy = glossy


# soft key above the camera and a cooler side fill light the plate face; they
# stay out of reflections so the glossy characters read black, as in the photos.
# A thin strip high above draws the bright line along the character edges.
cl = Vector(spec["loc"])
area("Key", (cl.x * 0.6, cl.y * 0.6 + 0.9, cl.z * 0.8 + 0.5), 1.2, 140)
area("Fill", (-1.2, 0.2, 0.8), 1.0, 40, (0.8, 0.88, 1.0))
area("Strip", (0.0, 1.6, 1.0), 2.4, 60, (0.95, 0.97, 1.0), sy=0.04, glossy=True)

sc.render.filepath = OUT
sc.render.image_settings.file_format = "PNG"
sc.render.image_settings.color_mode = "RGBA"
bpy.ops.render.render(write_still=True)
print("DONE", OUT)
