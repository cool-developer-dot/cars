# Headless macro of ONE character ("A") on a white plate, for the finish
# comparison cards: the same studio, lens and light for every finish, so the
# cards on a page compare like with like.
#   Blender -b --factory-startup --python render-finish-char.py -- <preview|final> <abs-out.png> <finish>
# finish: gel | acrylic | acrylicGel | bevel. Pose / look are env vars (E(...) below).
import bpy, math, os, sys
from mathutils import Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import plate_finish  # noqa: E402

E = os.environ.get
argv = sys.argv[sys.argv.index("--") + 1:]
MODE, OUT, FINISH = argv[0], argv[1], argv[2]

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

W, H = (1160, 928) if MODE == "final" else (580, 464)
sc.render.resolution_x, sc.render.resolution_y = W, H
cy.samples = 200 if MODE == "final" else 48
cy.use_denoising = True
cy.max_bounces = 12
cy.glossy_bounces = 10
cy.caustics_reflective = False
cy.caustics_refractive = False
sc.view_settings.view_transform = "Khronos PBR Neutral"
sc.view_settings.look = "None"
sc.view_settings.exposure = float(E("EXP", "-1.1"))

world = bpy.data.worlds.new("W")
sc.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = (0.012, 0.03, 0.07, 1)
bg.inputs["Strength"].default_value = 1.0


def mat(name, base, rough=0.5, metal=0.0, coat=0.0, coat_rough=0.05, emit=None, emit_str=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = base
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    for k, v in (("Coat Weight", coat), ("Coat Roughness", coat_rough)):
        if k in b.inputs:
            b.inputs[k].default_value = v
    if emit is not None:
        b.inputs["Emission Color"].default_value = emit
        b.inputs["Emission Strength"].default_value = emit_str
    return m


# a large white plate face (only a corner of it is in frame)
face = mat("Face", (0.46, 0.48, 0.52, 1), rough=0.3, coat=0.5, coat_rough=0.06)
nt = face.node_tree
n = nt.nodes.new("ShaderNodeTexNoise")
n.inputs["Scale"].default_value = 700
bump = nt.nodes.new("ShaderNodeBump")
bump.inputs["Strength"].default_value = 0.04
bump.inputs["Distance"].default_value = 0.0002
nt.links.new(n.outputs["Fac"], bump.inputs["Height"])
nt.links.new(bump.outputs["Normal"], nt.nodes["Principled BSDF"].inputs["Normal"])
bpy.ops.mesh.primitive_plane_add(size=1)
plate = bpy.context.object
plate.scale = (0.5, 0.3, 1)
plate.data.materials.append(face)

SIZE = float(E("FS", "0.2"))
chars = plate_finish.build(
    sc, "Char", FINISH,
    font="/System/Library/Fonts/Supplemental/" + E("FONT", "DIN Alternate Bold.ttf"),
    size=SIZE, height=float(E("CH", "0.0105")), body=E("BODY", "A"), glyph_scale=float(E("GSC", "1.8")),
)
chars.location = (0, 0, 0)


# camera: front-left, looking down onto the letter
cam_d = bpy.data.cameras.new("Cam")
cam_d.lens = float(E("LENS", "58"))
cam_d.sensor_width = 36
cam_d.dof.use_dof = True
cam_d.dof.aperture_fstop = float(E("FST", "7.0"))
cam = bpy.data.objects.new("Cam", cam_d)
sc.collection.objects.link(cam)
sc.camera = cam
cam.location = (float(E("CX", "-0.07")), float(E("CY", "-0.2")), float(E("CZ", "0.15")))
tgt = Vector((float(E("TX", "0.004")), float(E("TY", "0.004")), 0.0))
cam.rotation_euler = (tgt - cam.location).to_track_quat("-Z", "Y").to_euler()
foc = bpy.data.objects.new("Focus", None)
sc.collection.objects.link(foc)
foc.location = (0, -0.01, 0.005)
cam_d.dof.focus_object = foc


def area(name, loc, size, energy, color=(1, 1, 1), sy=None, tgt=(0, 0, 0)):
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


K = float(E("K", "1"))
# big soft key above-front: the long highlight across the tops
area("Key", (-0.15, -0.25, 0.55), 0.5, 26 * K, (1.0, 0.98, 0.95), sy=0.22)
# hard strip behind-right: the bright edge line along the walls / facets
area("Strip", (0.35, 0.25, 0.18), 0.6, 18 * K, (0.85, 0.92, 1.0), sy=0.025)
# cool fill low left
area("Fill", (-0.45, -0.05, 0.08), 0.4, 5 * K, (0.5, 0.7, 1.0), sy=0.2)
# overhead sky: even sheen on the white face
area("Sky", (0, 0.05, 0.9), 1.2, 22 * K, (0.92, 0.95, 1.0), sy=0.8)

sc.render.filepath = OUT
sc.render.image_settings.file_format = "PNG"
sc.render.image_settings.color_mode = "RGB"
bpy.ops.render.render(write_still=True)
print("DONE", OUT)
