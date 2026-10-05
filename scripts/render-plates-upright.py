# Headless render: a white front and a yellow rear 3D-gel number plate STANDING
# upright (leaning back a touch) on a mirror-wet carbon-speckled black bumper, so
# the plates and their thick glossy characters reflect in the surface. Close low
# camera, strong perspective, shallow focus, deep-blue night.
#   Blender -b --factory-startup --python render-plates-upright.py -- <preview|final> <abs-out.png>
# Pose / look are env vars (see E(...) calls below).
import bpy, bmesh, math, random, sys, os
from mathutils import Vector, Quaternion

E = os.environ.get
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

W, H = (1800, 1400) if MODE == "final" else (720, 560)
sc.render.resolution_x, sc.render.resolution_y = W, H
sc.render.resolution_percentage = 100
cy.samples = 240 if MODE == "final" else 48
cy.use_denoising = True
cy.max_bounces = 14
cy.glossy_bounces = 12
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
bg.inputs["Color"].default_value = (0.002, 0.007, 0.016, 1)
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
white_face = mat("White", (0.74, 0.75, 0.78, 1), rough=0.34, coat=0.4, coat_rough=0.08)
bumpy(white_face, 900, 0.05, 0.0002)
yellow_face = mat("Yellow", (1.0, 0.56, 0.0, 1), rough=0.34, coat=0.4, coat_rough=0.08)
bumpy(yellow_face, 900, 0.05, 0.0002)
chrome = mat("Chrome", (0.82, 0.86, 0.92, 1), rough=0.05, metal=1.0)
gel_black = mat("GelBlack", (0.002, 0.002, 0.003, 1), rough=float(E("GELR", "0.3")), coat=0.7, coat_rough=0.06)

# mirror-wet carbon: dark base, light flecks, low roughness so the plates reflect
body_mat = mat("Body", (0.003, 0.004, 0.009, 1), rough=float(E("SLR", "0.1")), coat=float(E("COAT", "0.18")), coat_rough=0.04, ior=float(E("SIOR", "1.3")))
nt = body_mat.node_tree
vor = nt.nodes.new("ShaderNodeTexVoronoi")
vor.inputs["Scale"].default_value = float(E("VS", "300"))
ramp = nt.nodes.new("ShaderNodeValToRGB")
ramp.color_ramp.elements[0].position = 0.10
ramp.color_ramp.elements[1].position = 0.22
nt.links.new(vor.outputs["Distance"], ramp.inputs["Fac"])
pb = nt.nodes["Principled BSDF"]
mixc = nt.nodes.new("ShaderNodeMix")
mixc.data_type = "RGBA"
mixc.inputs["A"].default_value = (0.16, 0.22, 0.34, 1)
mixc.inputs["B"].default_value = (0.0025, 0.0035, 0.007, 1)
nt.links.new(ramp.outputs["Color"], mixc.inputs["Factor"])
nt.links.new(mixc.outputs["Result"], pb.inputs["Base Color"])
# flecks are a bit rougher than the mirror coat
rmix = nt.nodes.new("ShaderNodeMapRange")
rmix.inputs["To Min"].default_value = 0.35
rmix.inputs["To Max"].default_value = float(E("SLR", "0.1"))
nt.links.new(ramp.outputs["Color"], rmix.inputs["Value"])
nt.links.new(rmix.outputs["Result"], pb.inputs["Roughness"])
bumpy(body_mat, 340, 0.2, 0.0006)

# ------------------------------------------------------------------ geometry
PW, PH, PT = 0.520, 0.111, 0.0045
EXT = float(E("EXT", "0.0058"))
LEAN = math.radians(float(E("LEAN", "12")))
ALPHA = math.radians(90) - LEAN  # rotation about X that stands the face up


def make_plate(name, face_mat):
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


def make_chars(name):
    fc = bpy.data.curves.new(name, "FONT")
    fc.body = "AB12 CDE"
    fc.font = bpy.data.fonts.load("/System/Library/Fonts/Supplemental/" + E("FONT", "DIN Alternate Bold.ttf"))
    fc.size = float(E("FS", "0.106"))
    fc.extrude = EXT
    fc.bevel_depth = 0.0016
    fc.bevel_resolution = 4
    fc.align_x = "CENTER"
    fc.align_y = "CENTER"
    fc.space_character = float(E("SPC", "1.04"))
    fc.space_word = float(E("SPW", "0.9"))
    o = bpy.data.objects.new(name, fc)
    sc.collection.objects.link(o)
    o.data.materials.append(gel_black)
    return o


NUDGE = float(E("NUDGE", "0.012"))
white = make_plate("White", white_face)
wchars = make_chars("WChars")
wchars.location = (NUDGE, -0.0004, EXT + 0.0004)
yellow = make_plate("Yellow", yellow_face)
ychars = make_chars("YChars")
YX, YY = float(E("YX", "0.095")), float(E("YY", "0.105"))
yellow.location = (YX, YY, 0.0)
ychars.location = (YX + NUDGE, YY - 0.0004, EXT + 0.0004)

# plates + chars: build face-up, then stand up / lean back as one group
plates = bpy.data.objects.new("Plates", None)
sc.collection.objects.link(plates)
for o in (white, wchars, yellow, ychars):
    o.parent = plates
plates.rotation_euler = (ALPHA, 0, 0)
# lowest point of the plates -> sit exactly on the bumper
low = -(PH / 2) * math.sin(ALPHA) - PT * abs(math.cos(ALPHA))
plates.location = (0, 0, -low + 0.0004)

# the bumper: a bevelled slab, chrome rim, top at z = 0
bpy.ops.mesh.primitive_cube_add(size=1)
slab = bpy.context.object
slab.scale = (1.9, 0.9, 0.03)
slab.location = (0.0, 0.9 / 2 - float(E("EDGE_Y", "0.17")), -0.015)
bpy.ops.object.transform_apply(scale=True)
sb = slab.modifiers.new("Bevel", "BEVEL")
sb.width = float(E("CHW", "0.011"))
sb.segments = 5
sb.limit_method = "ANGLE"
bpy.ops.object.modifier_apply(modifier="Bevel")
slab.data.materials.append(body_mat)
slab.data.materials.append(chrome)
for p in slab.data.polygons:
    p.material_index = 0 if p.normal.z > 0.9 else 1

# a dark panel behind, with blue-lit slits: the engine bay of the reference
panel_mat = mat("Panel", (0.006, 0.010, 0.02, 1), rough=0.25, metal=0.6)
bpy.ops.mesh.primitive_cube_add(size=1)
panel = bpy.context.object
panel.scale = (2.4, 0.05, 0.7)
panel.location = (0.2, float(E("PANEL_Y", "0.62")), 0.3)
panel.rotation_euler = (0, math.radians(-6), 0)
bpy.ops.object.transform_apply(scale=True)
panel.data.materials.append(panel_mat)

root = bpy.data.objects.new("Root", None)
sc.collection.objects.link(root)
for o in (plates, slab, panel):
    o.parent = root

# ------------------------------------------------------------------ water on the bumper
water = mat("Water", (1, 1, 1, 1), rough=0.0, trans=1.0, ior=1.33)


def bead(x, y, z, r):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, segments=18, ring_count=9, location=(x, y, z))
    o = bpy.context.object
    o.scale.z = 0.5
    o.data.materials.append(water)
    bpy.ops.object.shade_smooth()
    o.parent = root


for _ in range(int(E("BB", "900"))):
    x = random.uniform(-0.85, 0.85)
    y = random.uniform(-0.16, 0.7)
    if abs(x) < PW / 2 + 0.006 and abs(y) < 0.012:
        continue
    r = random.choice([0.0004, 0.0007, 0.0011, 0.0017, 0.0026, 0.0036])
    bead(x, y, r * 0.4, r)

# ------------------------------------------------------------------ pose + camera
root.rotation_euler = (0, 0, math.radians(float(E("RZ", "0"))))

cam_data = bpy.data.cameras.new("Cam")
cam_data.sensor_width = 36
cam_data.lens = float(E("LENS", "36"))
cam_data.dof.use_dof = True
cam_data.dof.aperture_fstop = float(E("FST", "5.6"))
cam_data.shift_x = float(E("SX", "0"))
cam_data.shift_y = float(E("SY", "0"))
cam = bpy.data.objects.new("Cam", cam_data)
sc.collection.objects.link(cam)
sc.camera = cam
cam.location = (float(E("CX", "0.28")), float(E("CY", "-0.36")), float(E("CZ", "0.13")))
target = Vector((float(E("TX", "0.02")), float(E("TY", "0.0")), float(E("TZ", "0.045"))))
q = (target - cam.location).to_track_quat("-Z", "Y")
q = q @ Quaternion((0, 0, 1), math.radians(float(E("ROLL", "10"))))
cam.rotation_euler = q.to_euler()
focus = bpy.data.objects.new("Focus", None)
sc.collection.objects.link(focus)
focus.location = Vector((float(E("FX", "0.12")), float(E("FY", "-0.01")), 0.05))
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


T = (0.0, 0.0, 0.05)
area("Key", (-0.55, -0.55, 0.45), T, 0.40, float(E("KEY", "20")), (1.0, 0.98, 0.95), sy=0.25, glossy=False)
area("Rim", (0.75, 0.30, 0.25), T, 0.70, float(E("RIM", "14")), (0.7, 0.85, 1.0), sy=0.06, glossy=False)
# long strips: the bright streaks that run along the plate faces and the wet surface
area("Top", (0.0, -0.20, 0.70), T, 1.1, float(E("TOP", "16")), (0.95, 0.97, 1.0), sy=0.02)
area("Edge", (0.1, -0.85, 0.08), T, 1.5, float(E("EDGE", "40")), (0.8, 0.9, 1.0), sy=0.02)
area("Fill", (-0.6, -0.1, 0.1), T, 0.6, 1, (0.35, 0.55, 1.0), sy=0.3, glossy=False)

# reflected overhead lights on the surface (the two white orbs in the reference) + bay lights
glint = mat("Glint", (0, 0, 0, 1), rough=1, emit=(0.8, 0.9, 1.0, 1), emit_str=float(E("GL", "160")))
for (x, y, z, r) in ((-0.52, 0.28, 0.0, 0.03), (-0.5, 0.22, 0.0, 0.02), (-0.2, 0.5, 0.0, 0.018)):
    bpy.ops.mesh.primitive_circle_add(vertices=40, radius=r, fill_type="NGON")
    o = bpy.context.object
    o.location = (x, y, 0.004)
    o.data.materials.append(glint)
    o.parent = root
bay = mat("Bay", (0, 0, 0, 1), rough=1, emit=(0.4, 0.7, 1.0, 1), emit_str=float(E("BAY", "70")))
for i in range(6):
    bpy.ops.mesh.primitive_cube_add(size=1)
    o = bpy.context.object
    o.scale = (random.uniform(0.3, 0.9), 0.014, 0.016)
    o.location = (random.uniform(-0.3, 1.1), float(E("PANEL_Y", "0.62")) - 0.05, random.uniform(0.04, 0.32))
    o.rotation_euler = (0, math.radians(random.uniform(-14, 6)), 0)
    o.data.materials.append(bay)
    o.parent = root

sc.render.filepath = OUT
sc.render.image_settings.file_format = "PNG"
sc.render.image_settings.color_mode = "RGB"
bpy.ops.render.render(write_still=True)
print("DONE", OUT)
