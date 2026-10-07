# Headless macro render of a white 3D-gel plate: raised glossy black characters,
# wet, low angle, dark navy night scene.  usage:
#   Blender -b --factory-startup --python plate_macro.py -- <preview|final> <out.png> [view]
import bpy, math, random, sys
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:]
MODE = argv[0]
OUT = argv[1]
VIEW = argv[2] if len(argv) > 2 else "wide"
random.seed(11)

# ------------------------------------------------------------------ scene
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

if VIEW == "wide":
    W, H = (1700, 1300) if MODE == "final" else (680, 520)
else:  # tall crop for phones
    W, H = (1300, 1300) if MODE == "final" else (520, 520)
_rw, _rh = __import__("os").environ.get("RW"), __import__("os").environ.get("RH")
if _rw and _rh:  # an explicit size (preview = 2/5 of it)
    W, H = (int(_rw), int(_rh)) if MODE == "final" else (int(_rw) * 2 // 5, int(_rh) * 2 // 5)
sc.render.resolution_x, sc.render.resolution_y = W, H
sc.render.resolution_percentage = 100
cy.samples = 160 if MODE == "final" else 40
cy.use_denoising = True
cy.max_bounces = 10
cy.glossy_bounces = 8
cy.transmission_bounces = 8
cy.caustics_reflective = False
cy.caustics_refractive = False
sc.view_settings.view_transform = "Khronos PBR Neutral"
sc.view_settings.look = "None"
sc.view_settings.exposure = float(__import__("os").environ.get("EXP", "-0.6"))
sc.render.film_transparent = False

# ------------------------------------------------------------------ world: deep navy + a few bokeh sources
world = bpy.data.worlds.new("W")
sc.world = world
world.use_nodes = True
wn = world.node_tree.nodes
wl = world.node_tree.links
bg = wn["Background"]
bg.inputs["Color"].default_value = (0.004, 0.012, 0.03, 1)
bg.inputs["Strength"].default_value = 1.0

def mat(name, base, rough=0.5, metal=0.0, spec=0.5, coat=0.0, coat_rough=0.03, trans=0.0, ior=1.45, emit=None, emit_str=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = base
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    b.inputs["IOR"].default_value = ior
    for k, v in (("Coat Weight", coat), ("Coat Roughness", coat_rough), ("Transmission Weight", trans)):
        if k in b.inputs:
            b.inputs[k].default_value = v
    if emit is not None:
        b.inputs["Emission Color"].default_value = emit
        b.inputs["Emission Strength"].default_value = emit_str
    return m

# ------------------------------------------------------------------ plate (520 x 111 x 3 mm), face + rolled edge
PW, PH, PT = 0.520, 0.111, 0.003
_FINISH = __import__("os").environ.get("FINISH", "gel")
if _FINISH != "gel":
    sys.path.insert(0, __import__("os").path.dirname(__import__("os").path.abspath(__file__)))
    import plate_finish as _pf
    PW, PH = _pf.plate_size()
plate_face = mat("PlateFace", (0.40, 0.41, 0.43, 1), rough=0.38, coat=0.35, coat_rough=0.1)
# faint orange-peel / micro-scratch so the white isn't CG-flat
nt = plate_face.node_tree
noise = nt.nodes.new("ShaderNodeTexNoise")
noise.inputs["Scale"].default_value = 900
noise.inputs["Detail"].default_value = 8
bump = nt.nodes.new("ShaderNodeBump")
bump.inputs["Strength"].default_value = 0.05
bump.inputs["Distance"].default_value = 0.0002
nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
nt.links.new(bump.outputs["Normal"], nt.nodes["Principled BSDF"].inputs["Normal"])
plate_edge = mat("PlateEdge", (0.62, 0.64, 0.68, 1), rough=0.18, metal=1.0)
gel_black = mat("GelBlack", (0.002, 0.002, 0.003, 1), rough=0.22, coat=1.0, coat_rough=0.045, spec=0.3)

bpy.ops.mesh.primitive_cube_add(size=1)
plate = bpy.context.object
plate.name = "Plate"
plate.scale = (PW, PH, PT)
bpy.ops.object.transform_apply(scale=True)
bev = plate.modifiers.new("Bevel", "BEVEL")
bev.width = 0.0016
bev.segments = 4
bev.limit_method = "ANGLE"
plate.data.materials.append(plate_face)
plate.data.materials.append(plate_edge)
# edge faces (not the big front/back) get the metal
me = plate.data
for p in me.polygons:
    n = p.normal
    p.material_index = 0 if abs(n.z) > 0.9 else 1
bpy.ops.object.modifier_apply(modifier="Bevel")
for p in plate.data.polygons:
    p.material_index = 0 if abs(p.normal.z) > 0.7 else 1

# ------------------------------------------------------------------ gel characters
FINISH = __import__("os").environ.get("FINISH", "gel")
if FINISH != "gel":
    import os as _os
    sys.path.insert(0, _os.path.dirname(_os.path.abspath(__file__)))
    import plate_finish
fcurve = bpy.data.curves.new("Chars", "FONT")
fcurve.body = "AB12 CDE"
fcurve.font = bpy.data.fonts.load("/System/Library/Fonts/Supplemental/" + __import__("os").environ.get("FONT", "DIN Condensed Bold.ttf"))
fcurve.size = float(__import__("os").environ.get("FS", "0.108"))
fcurve.extrude = 0.0015
fcurve.bevel_depth = 0.0017
fcurve.bevel_resolution = 5
fcurve.align_x = "CENTER"
fcurve.align_y = "CENTER"
fcurve.space_character = 1.04
fcurve.space_word = 1.1
chars = bpy.data.objects.new("Chars", fcurve)
sc.collection.objects.link(chars)
chars.location = (0, -0.0004, PT / 2 + 0.0015)
chars.data.materials.append(gel_black)
if FINISH != "gel":
    # swap the gel curve for the chosen finish, sitting on the plate face
    bpy.data.objects.remove(chars)
    chars = plate_finish.build(
        sc, "Chars", FINISH, font=fcurve.font, size=fcurve.size, spc=1.04, spw=1.1,
        height=float(__import__("os").environ.get("CH", "0.0034")),
    )
    chars.location = (0, -0.0004, PT / 2)
    plate_finish.add_flash(sc, "Flash", plate, PW, PH, z=PT / 2 + 0.0003)
    plate_finish.add_border(sc, "Border", plate, PW, PH, z=PT / 2 + 0.0003)

# ------------------------------------------------------------------ the car behind: gloss-black body with a drain of water beads
body_mat = mat("Body", (0.01, 0.014, 0.025, 1), rough=0.12, coat=1.0, coat_rough=0.02)
bpy.ops.mesh.primitive_plane_add(size=3.0)
body = bpy.context.object
body.name = "Body"
body.data.materials.append(body_mat)
body.location = (0, 0, -0.012)

# group the plate + chars so the whole piece can be posed
bpy.ops.object.empty_add(location=(0, 0, 0))
rig = bpy.context.object
rig.name = "Rig"
for o in (plate, chars, body):
    o.parent = rig

# water beads on plate / gel / body
water = mat("Water", (1, 1, 1, 1), rough=0.0, trans=1.0, ior=1.33)
water.node_tree.nodes["Principled BSDF"].inputs["Specular IOR Level"].default_value = 0.5

def bead(x, y, z, r):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, segments=24, ring_count=12, location=(x, y, z))
    o = bpy.context.object
    o.scale.z = 0.55
    o.data.materials.append(water)
    bpy.ops.object.shade_smooth()
    o.parent = rig
    return o

for _ in range(int(__import__("os").environ.get("FB", "10"))):  # on the white face
    x = random.uniform(-PW / 2 + 0.01, PW / 2 - 0.01)
    y = random.uniform(-PH / 2 + 0.006, PH / 2 - 0.006)
    r = random.choice([0.0005, 0.0008, 0.0011, 0.0016])
    bead(x, y, PT / 2 + r * 0.45, r)
for _ in range(240):  # on the body panel around it
    x = random.uniform(-0.55, 0.55)
    y = random.uniform(-0.25, 0.25)
    if abs(x) < PW / 2 + 0.002 and abs(y) < PH / 2 + 0.002:
        continue
    r = random.choice([0.0004, 0.0007, 0.001, 0.0016])
    bead(x, y, -0.012 + r * 0.45, r)

# a few beads sitting on the gel itself (tops of letters)
for _ in range(26):
    x = random.uniform(-0.2, 0.2)
    y = random.uniform(-0.02, 0.02)
    bead(x, y, PT / 2 + 0.0024, random.choice([0.0004, 0.0006]))

# sparkles: tiny hot specks on the gel and the plate (soft bokeh dots after DoF)
spark = mat("Spark", (0, 0, 0, 1), rough=1, emit=(1, 1, 1, 1), emit_str=400)
for _ in range(46):
    x = random.uniform(-0.23, 0.23)
    y = random.uniform(-0.035, 0.035)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=random.choice([0.00022, 0.0003, 0.00045]), segments=8, ring_count=6,
                                         location=(x, y, PT / 2 + random.choice([0.0004, 0.0032])))
    o = bpy.context.object
    o.data.materials.append(spark)
    o.parent = rig

# ------------------------------------------------------------------ pose + camera
rig.rotation_euler = (0, 0, math.radians(float(__import__("os").environ.get("RZ", "0"))))
rig.location = (0, 0, 0)

cam_data = bpy.data.cameras.new("Cam")
cam_data.lens = 90
cam_data.sensor_width = 36
cam_data.dof.use_dof = True
cam_data.dof.aperture_fstop = float(__import__("os").environ.get("FST", "5.0"))
cam = bpy.data.objects.new("Cam", cam_data)
sc.collection.objects.link(cam)
sc.camera = cam

import os
E = os.environ.get
cam.location = (float(E("CX", "0.24")), float(E("CY", "-0.2")), float(E("CZ", "0.17")))
target = Vector((float(E("TX", "0.07")), float(E("TY", "0.0")), 0.0))
cam_data.lens = float(E("LENS", "70"))
cam_data.shift_x = float(E("SX", "0"))
cam_data.shift_y = float(E("SY", "0"))
direction = target - cam.location
cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
focus_empty = bpy.data.objects.new("Focus", None)
sc.collection.objects.link(focus_empty)
focus_empty.location = Vector((float(E("FX", "0.09")), 0.0, 0.004))
cam_data.dof.focus_object = focus_empty

# ------------------------------------------------------------------ lights
def area(name, loc, target_pt, size, energy, color=(1, 1, 1), shape="RECTANGLE", sy=None):
    l = bpy.data.lights.new(name, "AREA")
    l.shape = shape
    l.size = size
    if sy:
        l.size_y = sy
    l.energy = energy
    l.color = color
    o = bpy.data.objects.new(name, l)
    sc.collection.objects.link(o)
    o.location = loc
    o.rotation_euler = (Vector(target_pt) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    return o

# big softbox up-left: soft sheen across the white face
area("Key", (-0.3, -0.22, 0.6), (0.0, 0.0, 0.0), 0.16, 9, (1.0, 0.98, 0.95), sy=0.1)
# cool strip light low on the right: rim along the plate edge and the wet body
area("Rim", (0.55, 0.12, 0.12), (0.0, 0.0, 0.0), 0.9, 45, (0.82, 0.9, 1.0), sy=0.06)
area("Strip", (-0.12, 0.08, 0.5), (0.0, 0.0, 0.0), 0.45, 14, (1.0, 0.97, 0.92), sy=0.02)
area("Sky", (0.0, 0.0, 1.1), (0.0, 0.0, 0.0), 1.4, 15, (0.9, 0.94, 1.0), sy=1.0)
# warm kicker from behind for the gel highlights
# (no back kicker: it sat in the mirror direction of the gel tops)
# deep-blue fill from the left, low
area("Fill", (-0.5, -0.2, 0.05), (0.0, 0.0, 0.0), 0.5, 4, (0.35, 0.55, 1.0), sy=0.3)

# distant bokeh: emissive discs far behind the car
def cam_only(m):
    nt = m.node_tree
    lp = nt.nodes.new("ShaderNodeLightPath")
    mul = nt.nodes.new("ShaderNodeMath")
    mul.operation = "MULTIPLY"
    b = nt.nodes["Principled BSDF"]
    mul.inputs[1].default_value = b.inputs["Emission Strength"].default_value
    nt.links.new(lp.outputs["Is Camera Ray"], mul.inputs[0])
    nt.links.new(mul.outputs["Value"], b.inputs["Emission Strength"])
    return m
bokeh = cam_only(mat("Bokeh", (0, 0, 0, 1), rough=1, emit=(0.5, 0.75, 1.0, 1), emit_str=70))
bokeh_w = cam_only(mat("BokehW", (0, 0, 0, 1), rough=1, emit=(1.0, 0.93, 0.8, 1), emit_str=110))
for i in range(16):
    bpy.ops.mesh.primitive_circle_add(vertices=48, radius=random.uniform(0.012, 0.035), fill_type="NGON")
    o = bpy.context.object
    o.location = (random.uniform(-0.7, 0.2), random.uniform(0.6, 1.1), random.uniform(0.0, 0.5))
    o.rotation_euler = (math.radians(90), 0, 0)
    o.data.materials.append(bokeh if i % 3 else bokeh_w)

sc.render.filepath = OUT
sc.render.image_settings.file_format = "PNG"
sc.render.image_settings.color_mode = "RGB"
bpy.ops.render.render(write_still=True)
print("DONE", OUT)
