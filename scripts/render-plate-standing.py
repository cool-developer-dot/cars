# Headless macro render of a 3D-gel number plate STANDING upright on a wet black
# bumper: thick glossy black characters, low side-on camera, deep navy night.
#   Blender -b --factory-startup --python render-plate-standing.py -- <preview|final> <abs-out.png>
# Pose / look are env vars (CX CY CZ TX TZ LENS ROLL FX FST EXP FS EXT FB ...).
import bpy, math, random, sys, os
from mathutils import Vector, Quaternion

E = os.environ.get
argv = sys.argv[sys.argv.index("--") + 1:]
MODE, OUT = argv[0], argv[1]
random.seed(int(E("SEED", "11")))

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

W, H = (1920, 1100) if MODE == "final" else (768, 440)
sc.render.resolution_x, sc.render.resolution_y = W, H
sc.render.resolution_percentage = 100
cy.samples = 200 if MODE == "final" else 40
cy.use_denoising = True
cy.max_bounces = 12
cy.glossy_bounces = 10
cy.transmission_bounces = 8
cy.caustics_reflective = False
cy.caustics_refractive = False
sc.view_settings.view_transform = "Khronos PBR Neutral"
sc.view_settings.look = "None"
sc.view_settings.exposure = float(E("EXP", "-1.6"))

world = bpy.data.worlds.new("W")
sc.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = (0.0015, 0.004, 0.010, 1)
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


# ------------------------------------------------------------------ plate: 520 x 111 mm, built face-up (+Z) then stood up
PW, PH, PT = 0.520, 0.111, 0.0045
plate_face = mat("PlateFace", (0.52, 0.53, 0.55, 1), rough=0.38, coat=0.35, coat_rough=0.1)
bumpy(plate_face, 900, 0.05, 0.0002)
plate_edge = mat("PlateEdge", (0.66, 0.68, 0.72, 1), rough=0.16, metal=1.0)
gel_black = mat("GelBlack", (0.002, 0.002, 0.003, 1), rough=0.2, coat=1.0, coat_rough=0.04)

bpy.ops.mesh.primitive_cube_add(size=1)
plate = bpy.context.object
plate.name = "Plate"
plate.scale = (PW, PH, PT)
bpy.ops.object.transform_apply(scale=True)
bev = plate.modifiers.new("Bevel", "BEVEL")
bev.width = 0.0019
bev.segments = 4
bev.limit_method = "ANGLE"
plate.data.materials.append(plate_face)
plate.data.materials.append(plate_edge)
bpy.ops.object.modifier_apply(modifier="Bevel")
for p in plate.data.polygons:
    p.material_index = 0 if abs(p.normal.z) > 0.7 else 1

# ------------------------------------------------------------------ gel characters: tall, thick, chamfered
EXT = float(E("EXT", "0.0036"))
fc = bpy.data.curves.new("Chars", "FONT")
fc.body = "AB12 CDE"
fc.font = bpy.data.fonts.load("/System/Library/Fonts/Supplemental/DIN Condensed Bold.ttf")
fc.size = float(E("FS", "0.108"))
fc.extrude = EXT
fc.bevel_depth = 0.0016
fc.bevel_resolution = 4
fc.align_x = "CENTER"
fc.align_y = "CENTER"
fc.space_character = 1.04
fc.space_word = 1.1
chars = bpy.data.objects.new("Chars", fc)
sc.collection.objects.link(chars)
chars.location = (0, -0.0004, PT / 2 + EXT + 0.0004)
chars.data.materials.append(gel_black)

# ------------------------------------------------------------------ the bumper behind: gloss black, fine texture, wet
body_mat = mat("Body", (0.012, 0.016, 0.028, 1), rough=0.18, coat=1.0, coat_rough=0.03)
bumpy(body_mat, 380, 0.22, 0.0007)
bpy.ops.mesh.primitive_plane_add(size=3.0)
body = bpy.context.object
body.name = "Body"
body.data.materials.append(body_mat)
body.location = (0, 0, -0.016)

bpy.ops.object.empty_add(location=(0, 0, 0))
rig = bpy.context.object
for o in (plate, chars, body):
    o.parent = rig

water = mat("Water", (1, 1, 1, 1), rough=0.0, trans=1.0, ior=1.33)


def bead(x, y, z, r):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, segments=20, ring_count=10, location=(x, y, z))
    o = bpy.context.object
    o.scale.z = 0.55
    o.data.materials.append(water)
    bpy.ops.object.shade_smooth()
    o.parent = rig


for _ in range(int(E("FB", "10"))):  # a few drops on the white face
    x = random.uniform(-PW / 2 + 0.01, PW / 2 - 0.01)
    y = random.uniform(-PH / 2 + 0.006, PH / 2 - 0.006)
    r = random.choice([0.0005, 0.0008, 0.0011])
    bead(x, y, PT / 2 + r * 0.45, r)
for _ in range(int(E("BB", "320"))):  # many on the bumper
    x = random.uniform(-0.7, 0.7)
    y = random.uniform(-0.3, 0.3)
    if abs(x) < PW / 2 + 0.004 and abs(y) < PH / 2 + 0.004:
        continue
    r = random.choice([0.0003, 0.0005, 0.0008, 0.0012])
    bead(x, y, -0.016 + r * 0.45, r)
for _ in range(24):  # drops on top of the gel
    bead(random.uniform(-0.2, 0.2), random.uniform(-0.02, 0.02), PT / 2 + EXT + 0.0016, random.choice([0.0004, 0.0006]))

spark = mat("Spark", (0, 0, 0, 1), rough=1, emit=(1, 1, 1, 1), emit_str=float(E("SPE", "160")))
for _ in range(int(E("SP", "30"))):
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=random.choice([0.00012, 0.00018, 0.00028]), segments=8, ring_count=6,
        location=(random.uniform(-0.23, 0.23), random.uniform(-0.035, 0.035), PT / 2 + random.choice([0.0004, EXT * 2 + 0.002])))
    o = bpy.context.object
    o.data.materials.append(spark)
    o.parent = rig

# stand the whole thing up: face (+Z) -> faces the camera at -Y, plate height -> world Z
rig.rotation_euler = (math.radians(90), 0, 0)

# ------------------------------------------------------------------ camera: low, from the right, rolled
cam_data = bpy.data.cameras.new("Cam")
cam_data.sensor_width = 36
cam_data.lens = float(E("LENS", "52"))
cam_data.dof.use_dof = True
cam_data.dof.aperture_fstop = float(E("FST", "4.4"))
cam_data.shift_x = float(E("SX", "0"))
cam_data.shift_y = float(E("SY", "0"))
cam = bpy.data.objects.new("Cam", cam_data)
sc.collection.objects.link(cam)
sc.camera = cam
cam.location = (float(E("CX", "0.30")), float(E("CY", "-0.22")), float(E("CZ", "-0.035")))
target = Vector((float(E("TX", "0.05")), 0.0, float(E("TZ", "0.0"))))
q = (target - cam.location).to_track_quat("-Z", "Y")
q = q @ Quaternion((0, 0, 1), math.radians(float(E("ROLL", "-12"))))
cam.rotation_euler = q.to_euler()
focus = bpy.data.objects.new("Focus", None)
sc.collection.objects.link(focus)
focus.location = Vector((float(E("FX", "0.10")), -0.004, 0.0))
cam_data.dof.focus_object = focus


# ------------------------------------------------------------------ lights
def area(name, loc, tgt, size, energy, color=(1, 1, 1), sy=None):
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


# big soft key, upper left and in front: sheen across the white face
area("Key", (-0.40, -0.55, 0.30), (0, 0, 0), 0.30, float(E("KEY", "30")), (1.0, 0.98, 0.95), sy=0.18)
# long thin strips: the bright streaks that run along the gel bevels
area("StripTop", (0.0, -0.40, 0.42), (0, 0, 0), 0.60, float(E("STRIP", "16")), (0.95, 0.97, 1.0), sy=0.025)
area("StripSide", (-0.45, -0.25, 0.0), (0, 0, 0), 0.40, float(E("STRIP", "16")), (1.0, 0.97, 0.92), sy=0.02)
# cool rim from the right: lights the plate edge and wet bumper
area("Rim", (0.60, -0.10, 0.08), (0, 0, 0), 0.80, float(E("RIM", "30")), (0.92, 0.95, 1.0), sy=0.07)
area("Fill", (-0.35, -0.50, -0.08), (0, 0, 0), 0.60, 3, (0.6, 0.75, 1.0), sy=0.30)

# reflected glints on the wet bumper: small bright discs out of shot, in front of it
glint = mat("Glint", (0, 0, 0, 1), rough=1, emit=(0.8, 0.9, 1.0, 1), emit_str=110)
glint_w = mat("GlintW", (0, 0, 0, 1), rough=1, emit=(1.0, 0.94, 0.82, 1), emit_str=170)
for i in range(9):
    bpy.ops.mesh.primitive_circle_add(vertices=40, radius=random.uniform(0.012, 0.03), fill_type="NGON")
    o = bpy.context.object
    o.location = (random.uniform(-0.9, -0.1), random.uniform(-1.4, -0.9), random.uniform(0.05, 0.45))
    o.rotation_euler = (math.radians(90), 0, 0)
    o.data.materials.append(glint if i % 3 else glint_w)

sc.render.filepath = OUT
sc.render.image_settings.file_format = "PNG"
sc.render.image_settings.color_mode = "RGB"
bpy.ops.render.render(write_still=True)
print("DONE", OUT)
