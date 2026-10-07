# Headless render: a white front and a yellow rear 3D-gel number plate lying on
# a wet, carbon-speckled bumper with a chrome edge, thick glossy black raised
# characters, low camera, shallow focus, deep-blue night.
#   Blender -b --factory-startup --python render-plates-pair.py -- <preview|final> <abs-out.png>
# Pose / look are env vars (see E(...) calls below).
import bpy, bmesh, math, random, sys, os
from mathutils import Vector, Quaternion

E = os.environ.get

# FINISH (env): gel (default, the original 3D art) | acrylic | acrylicGel | bevel.
# Non-gel finishes are built by plate_finish.py; their origin is the plate face.
FINISH = os.environ.get("FINISH", "gel")
if FINISH != "gel":
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import plate_finish
argv = sys.argv[sys.argv.index("--") + 1:]
MODE, OUT = argv[0], argv[1]
random.seed(int(E("SEED", "5")))

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

RW, RH = int(E("RW", "1800")), int(E("RH", "1400"))
W, H = (RW, RH) if MODE == "final" else (RW * 2 // 5, RH * 2 // 5)
sc.render.resolution_x, sc.render.resolution_y = W, H
sc.render.resolution_percentage = 100
cy.samples = 220 if MODE == "final" else 40
cy.use_denoising = True
cy.max_bounces = 12
cy.glossy_bounces = 10
cy.transmission_bounces = 8
cy.caustics_reflective = False
cy.caustics_refractive = False
sc.view_settings.view_transform = "Khronos PBR Neutral"
sc.view_settings.look = "None"
sc.view_settings.exposure = float(E("EXP", "-1.0"))

world = bpy.data.worlds.new("W")
sc.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = (0.002, 0.006, 0.016, 1)
bg.inputs["Strength"].default_value = 1.0


def mat(name, base, rough=0.5, metal=0.0, coat=0.0, coat_rough=0.03, trans=0.0, ior=1.45, emit=None, emit_str=0.0):
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


def bumpy(m, scale, strength, dist):
    nt = m.node_tree
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = scale
    n.inputs["Detail"].default_value = 8
    b = nt.nodes.new("ShaderNodeBump")
    b.inputs["Strength"].default_value = strength
    b.inputs["Distance"].default_value = dist
    nt.links.new(n.outputs["Fac"], b.inputs["Height"])
    nt.links.new(b.outputs["Normal"], nt.nodes["Principled BSDF"].inputs["Normal"])


# ------------------------------------------------------------------ materials
white_face = mat("White", (0.72, 0.73, 0.76, 1), rough=0.36, coat=0.35, coat_rough=0.1)
bumpy(white_face, 900, 0.05, 0.0002)
yellow_face = mat("Yellow", (1.0, 0.56, 0.0, 1), rough=0.36, coat=0.35, coat_rough=0.1)
bumpy(yellow_face, 900, 0.05, 0.0002)
chrome = mat("Chrome", (0.8, 0.84, 0.9, 1), rough=0.06, metal=1.0)
gel_black = mat("GelBlack", (0.002, 0.002, 0.003, 1), rough=0.2, coat=1.0, coat_rough=0.04)

# carbon-speckled, wet bumper top
body_mat = mat("Body", (0.003, 0.004, 0.009, 1), rough=float(E("SLR", "0.07")), coat=1.0, coat_rough=0.015)
nt = body_mat.node_tree
vor = nt.nodes.new("ShaderNodeTexVoronoi")
vor.inputs["Scale"].default_value = float(E("VS", "260"))
ramp = nt.nodes.new("ShaderNodeValToRGB")
ramp.color_ramp.elements[0].position = 0.10
ramp.color_ramp.elements[1].position = 0.22
nt.links.new(vor.outputs["Distance"], ramp.inputs["Fac"])
pb = nt.nodes["Principled BSDF"]
mixc = nt.nodes.new("ShaderNodeMix")
mixc.data_type = "RGBA"
mixc.inputs["A"].default_value = (0.09, 0.12, 0.2, 1)   # flecks (cell centres)
mixc.inputs["B"].default_value = (0.0025, 0.0035, 0.007, 1)  # carbon base
nt.links.new(ramp.outputs["Color"], mixc.inputs["Factor"])
nt.links.new(mixc.outputs["Result"], pb.inputs["Base Color"])
bumpy(body_mat, 380, 0.25, 0.0008)

# ------------------------------------------------------------------ the bumper: bevelled slab, chrome rim
bpy.ops.mesh.primitive_cube_add(size=1)
slab = bpy.context.object
slab.scale = (1.7, 0.62, 0.03)
slab.location = (0.0, 0.31 - 0.095, -0.0045 - 0.015)
bpy.ops.object.transform_apply(scale=True)
sb = slab.modifiers.new("Bevel", "BEVEL")
sb.width = 0.006
sb.segments = 4
sb.limit_method = "ANGLE"
bpy.ops.object.modifier_apply(modifier="Bevel")
slab.data.materials.append(body_mat)
slab.data.materials.append(chrome)
for p in slab.data.polygons:
    p.material_index = 0 if p.normal.z > 0.9 else 1

# ------------------------------------------------------------------ plates
PW, PH, PT = 0.520, 0.111, 0.0045
EXT = float(E("EXT", "0.0036"))


def make_plate(name, face_mat, PW=PW, PH=PH):
    bm = bmesh.new()
    hw, hh = PW / 2, PH / 2
    vs = [bm.verts.new(v) for v in ((-hw, -hh, 0), (hw, -hh, 0), (hw, hh, 0), (-hw, hh, 0))]
    bm.faces.new(vs)
    bmesh.ops.bevel(bm, geom=vs, offset=0.010, segments=7, profile=0.5, affect="VERTICES")
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(name, me)
    sc.collection.objects.link(o)
    sol = o.modifiers.new("Solid", "SOLIDIFY")
    sol.thickness = PT
    sol.offset = -1
    bev = o.modifiers.new("Bevel", "BEVEL")
    bev.width = 0.0014
    bev.segments = 3
    bev.limit_method = "ANGLE"
    me.materials.append(face_mat)
    me.materials.append(chrome)
    bpy.context.view_layer.objects.active = o
    for m in list(o.modifiers):
        bpy.ops.object.modifier_apply(modifier=m.name)
    for p in me.polygons:
        p.material_index = 0 if p.normal.z > 0.7 else 1
    return o


CHAR_Z = EXT + 0.0004 if FINISH == "gel" else 0.0002


def make_chars(name):
    if FINISH != "gel":
        return plate_finish.build(
            sc, name, FINISH,
            font="/System/Library/Fonts/Supplemental/" + E("FONT", "DIN Alternate Bold.ttf"),
            size=float(E("FS", "0.104")), height=float(E("CH", str(2 * EXT))),
            spc=float(E("SPC", "1.04")), spw=float(E("SPW", "0.9")),
        )
    fc = bpy.data.curves.new(name, "FONT")
    fc.body = "AB12 CDE"
    fc.font = bpy.data.fonts.load("/System/Library/Fonts/Supplemental/" + E("FONT", "DIN Alternate Bold.ttf"))
    fc.size = float(E("FS", "0.104"))
    fc.extrude = EXT
    fc.bevel_depth = 0.0015
    fc.bevel_resolution = 4
    fc.align_x = "CENTER"
    fc.align_y = "CENTER"
    fc.space_character = float(E("SPC", "1.04"))
    fc.space_word = float(E("SPW", "0.9"))
    o = bpy.data.objects.new(name, fc)
    sc.collection.objects.link(o)
    o.data.materials.append(gel_black)
    return o


# white plate (front) at the origin, lying on the slab; yellow behind and higher on screen
_fw, _fh = plate_finish.plate_size() if FINISH != "gel" else (PW, PH)
_rw, _rh = plate_finish.plate_size(rear=True) if FINISH != "gel" else (PW, PH)
white = make_plate("White", white_face, _fw, _fh)
wchars = make_chars("WChars")
_glyphs = FINISH != "gel" and os.environ.get("PLATE_FONT", "plate") == "plate"
NUDGE = float(E("NUDGE", "0" if _glyphs else "0.014"))
wchars.location = (NUDGE, -0.0004, CHAR_Z)
yellow = make_plate("Yellow", yellow_face, _rw, _rh)
ychars = make_chars("YChars")
yellow.location = (float(E("YX", "0.085")), float(E("YY", "0.185")), 0.0)
ychars.location = (yellow.location.x + NUDGE, yellow.location.y - 0.0004, CHAR_Z)
yellow.rotation_euler = (0, 0, math.radians(float(E("YRZ", "2.0"))))
ychars.rotation_euler = yellow.rotation_euler
if FINISH != "gel":
    plate_finish.add_flash(sc, "WFlash", white, _fw, _fh)
    plate_finish.add_border(sc, "WBorder", white, _fw, _fh)
    plate_finish.add_flash(sc, "YFlash", yellow, _rw, _rh)
    plate_finish.add_border(sc, "YBorder", yellow, _rw, _rh)

bpy.ops.object.empty_add(location=(0, 0, 0))
rig = bpy.context.object
for o in (slab, white, wchars, yellow, ychars):
    o.parent = rig

# ------------------------------------------------------------------ water: beads on the slab, a few on the plates
water = mat("Water", (1, 1, 1, 1), rough=0.0, trans=1.0, ior=1.33)


def bead(x, y, z, r):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, segments=18, ring_count=9, location=(x, y, z))
    o = bpy.context.object
    o.scale.z = 0.55
    o.data.materials.append(water)
    bpy.ops.object.shade_smooth()
    o.parent = rig


for _ in range(int(E("BB", "420"))):
    x = random.uniform(-0.8, 0.8)
    y = random.uniform(-0.1, 0.5)
    if abs(x) < PW / 2 + 0.006 and abs(y) < PH / 2 + 0.006:
        continue
    if abs(x - float(E("YX", "0.085"))) < PW / 2 + 0.006 and abs(y - float(E("YY", "0.185"))) < PH / 2 + 0.006:
        continue
    r = random.choice([0.0004, 0.0007, 0.0011, 0.0017, 0.0026, 0.0034])
    bead(x, y, -0.0045 + r * 0.45, r)
for _ in range(int(E("FB", "10"))):
    bead(random.uniform(-0.22, 0.22), random.uniform(-0.045, 0.045), random.choice([0.0005, 0.0008]), random.choice([0.0005, 0.0008]))

# ------------------------------------------------------------------ pose + camera
rig.rotation_euler = (math.radians(float(E("RX", "-8"))), 0, math.radians(float(E("RZ", "-20"))))

cam_data = bpy.data.cameras.new("Cam")
cam_data.sensor_width = 36
cam_data.lens = float(E("LENS", "50"))
cam_data.dof.use_dof = True
cam_data.dof.aperture_fstop = float(E("FST", "3.6"))
cam_data.shift_x = float(E("SX", "0"))
cam_data.shift_y = float(E("SY", "0"))
cam = bpy.data.objects.new("Cam", cam_data)
sc.collection.objects.link(cam)
sc.camera = cam
cam.location = (float(E("CX", "-0.12")), float(E("CY", "-0.42")), float(E("CZ", "0.2")))
target = Vector((float(E("TX", "0.06")), float(E("TY", "0.08")), 0.0))
q = (target - cam.location).to_track_quat("-Z", "Y")
q = q @ Quaternion((0, 0, 1), math.radians(float(E("ROLL", "0"))))
cam.rotation_euler = q.to_euler()
focus = bpy.data.objects.new("Focus", None)
sc.collection.objects.link(focus)
focus.location = Vector((float(E("FX", "0.10")), float(E("FY", "-0.03")), 0.01))
cam_data.dof.focus_object = focus


# ------------------------------------------------------------------ lights
def area(name, loc, tgt, size, energy, color=(1, 1, 1), sy=None, glossy=True):
    l = bpy.data.lights.new(name, "AREA")
    l.shape = "RECTANGLE"
    l.size = size
    l.size_y = sy or size
    l.energy = energy
    l.color = color
    o = bpy.data.objects.new(name, l)
    sc.collection.objects.link(o)
    o.location = loc
    o.rotation_euler = (Vector(tgt) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    o.visible_glossy = glossy


area("Key", (-0.55, -0.35, 0.55), (0.05, 0.05, 0), 0.40, float(E("KEY", "12")), (1.0, 0.98, 0.95), sy=0.22, glossy=False)
area("Strip", (0.3, -0.5, 0.35), (0.05, 0.05, 0), 0.9, float(E("STRIP", "6")), (0.9, 0.95, 1.0), sy=0.03)
area("Rim", (0.7, 0.35, 0.2), (0.05, 0.05, 0), 0.7, float(E("RIM", "14")), (0.7, 0.85, 1.0), sy=0.05, glossy=False)
area("Top", (0.0, -0.05, 0.62), (0.05, 0.05, 0), 1.0, float(E("TOP", "9")), (0.95, 0.97, 1.0), sy=0.018)
area("Edge", (0.1, -0.75, 0.06), (0.05, 0.0, 0), 1.4, float(E("EDGE", "18")), (0.8, 0.9, 1.0), sy=0.02)
area("Fill", (-0.6, -0.1, 0.1), (0.05, 0.05, 0), 0.6, 1, (0.35, 0.55, 1.0), sy=0.3, glossy=False)

# blue-white glints on the wet slab (reflected strip lights) and distant bokeh
glint = mat("Glint", (0, 0, 0, 1), rough=1, emit=(0.7, 0.88, 1.0, 1), emit_str=float(E("GL", "130")))
for i in range(7):
    bpy.ops.mesh.primitive_circle_add(vertices=40, radius=random.uniform(0.012, 0.03), fill_type="NGON")
    o = bpy.context.object
    o.location = (random.uniform(-0.6, -0.1), random.uniform(0.55, 1.1), random.uniform(0.1, 0.5))
    o.rotation_euler = (math.radians(90), 0, 0)
    o.data.materials.append(glint)
# long blue strip lights in the dark engine bay behind
bay = mat("Bay", (0, 0, 0, 1), rough=1, emit=(0.35, 0.65, 1.0, 1), emit_str=float(E("BAY", "40")))
for i in range(5):
    bpy.ops.mesh.primitive_cube_add(size=1)
    o = bpy.context.object
    o.scale = (random.uniform(0.3, 0.9), 0.01, 0.012)
    o.location = (random.uniform(-0.3, 0.9), random.uniform(0.9, 1.3), random.uniform(0.1, 0.5))
    o.rotation_euler = (0, math.radians(random.uniform(-12, 8)), 0)
    o.data.materials.append(bay)

sc.render.filepath = OUT
sc.render.image_settings.file_format = "PNG"
sc.render.image_settings.color_mode = "RGB"
bpy.ops.render.render(write_still=True)
print("DONE", OUT)
