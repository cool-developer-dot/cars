# Headless render: the product-page hero art. A white front and a yellow rear
# plate lying on a wet, glitter-flecked navy surface, the white one resting over
# the end of the yellow one, seen from above with a soft blue softbox glowing in
# the wet surface behind them (the look of public/3d/plates-3d-gel.webp).
#   Blender -b --factory-startup --python render-plates-hero.py -- <preview|final> <abs-out.png> <finish>
# finish: acrylic | acrylicGel | bevel | gel. Pose / look are env vars (E(...) below).
import bpy, bmesh, math, os, random, sys
from mathutils import Vector, Quaternion

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import plate_finish  # noqa: E402

E = os.environ.get
argv = sys.argv[sys.argv.index("--") + 1:]
MODE, OUT, FINISH = argv[0], argv[1], argv[2]
random.seed(int(E("SEED", "7")))

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

RW, RH = int(E("RW", "2000")), int(E("RH", "1000"))
W, H = (RW, RH) if MODE == "final" else (RW * 2 // 5, RH * 2 // 5)
sc.render.resolution_x, sc.render.resolution_y = W, H
cy.samples = 260 if MODE == "final" else 40
cy.use_denoising = True
cy.max_bounces = 12
cy.glossy_bounces = 10
cy.caustics_reflective = False
cy.caustics_refractive = False
sc.view_settings.view_transform = "Khronos PBR Neutral"
sc.view_settings.look = "None"
sc.view_settings.exposure = float(E("EXP", "-0.9"))

world = bpy.data.worlds.new("W")
sc.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = (0.002, 0.006, 0.016, 1)
bg.inputs["Strength"].default_value = 1.0


def mat(name, base, rough=0.5, metal=0.0, coat=0.0, coat_rough=0.03, emit=None, emit_str=0.0):
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


white_face = mat("White", (0.72, 0.74, 0.78, 1), rough=0.3, coat=0.5, coat_rough=0.06)
bumpy(white_face, 900, 0.05, 0.0002)
yellow_face = mat("Yellow", (1.0, 0.55, 0.02, 1), rough=0.3, coat=0.5, coat_rough=0.06)
bumpy(yellow_face, 900, 0.05, 0.0002)
edge_mat = mat("Edge", (0.8, 0.82, 0.86, 1), rough=0.25, coat=0.4)

# floor: glossy navy, orange-peel ripples, a glitter of tiny bright flecks
floor_mat = mat("Floor", (0.004, 0.009, 0.025, 1), rough=float(E("FR", "0.12")), coat=float(E("FC", "1.0")), coat_rough=float(E("FCR", "0.02")))
nt = floor_mat.node_tree
pb = nt.nodes["Principled BSDF"]
vor = nt.nodes.new("ShaderNodeTexVoronoi")
vor.inputs["Scale"].default_value = float(E("VS", "520"))
ramp = nt.nodes.new("ShaderNodeValToRGB")
ramp.color_ramp.elements[0].position = 0.0
ramp.color_ramp.elements[0].color = (1, 1, 1, 1)
ramp.color_ramp.elements[1].position = float(E("GLIT", "0.035"))
ramp.color_ramp.elements[1].color = (0, 0, 0, 1)
nt.links.new(vor.outputs["Distance"], ramp.inputs["Fac"])
# only some cells sparkle
cell_ramp = nt.nodes.new("ShaderNodeValToRGB")
cell_ramp.color_ramp.elements[0].position = 0.86
cell_ramp.color_ramp.elements[0].color = (0, 0, 0, 1)
cell_ramp.color_ramp.elements[1].position = 0.87
nt.links.new(vor.outputs["Color"], cell_ramp.inputs["Fac"])
mul = nt.nodes.new("ShaderNodeMix")
mul.data_type = "RGBA"
mul.blend_type = "MULTIPLY"
mul.inputs["Factor"].default_value = 1.0
nt.links.new(ramp.outputs["Color"], mul.inputs["A"])
nt.links.new(cell_ramp.outputs["Color"], mul.inputs["B"])
pb.inputs["Emission Color"].default_value = (0.75, 0.85, 1.0, 1)
nt.links.new(mul.outputs["Result"], pb.inputs["Emission Strength"])
emit_scale = nt.nodes.new("ShaderNodeMath")
emit_scale.operation = "MULTIPLY"
emit_scale.inputs[1].default_value = float(E("SPARK", "6"))
nt.links.new(mul.outputs["Result"], emit_scale.inputs[0])
nt.links.new(emit_scale.outputs["Value"], pb.inputs["Emission Strength"])
bumpy(floor_mat, float(E("RIP", "60")), float(E("RIPS", "0.12")), 0.002)

bpy.ops.mesh.primitive_plane_add(size=8)
floor = bpy.context.object
floor.data.materials.append(floor_mat)

# ------------------------------------------------------------------ plates
PW, PH, PT = 0.520, 0.111, 0.004


def make_plate(name, face, PW=PW, PH=PH):
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
    bev.width = 0.0012
    bev.segments = 3
    bev.limit_method = "ANGLE"
    me.materials.append(face)
    me.materials.append(edge_mat)
    bpy.context.view_layer.objects.active = o
    for m in list(o.modifiers):
        bpy.ops.object.modifier_apply(modifier=m.name)
    for p in me.polygons:
        p.material_index = 0 if p.normal.z > 0.7 else 1
    return o


FONT = "/System/Library/Fonts/Supplemental/" + E("FONT", "DIN Alternate Bold.ttf")
CH = float(E("CH", "0.009"))


def plate_with_chars(name, face, loc, rz, tilt=0.0, rear=False):
    root = bpy.data.objects.new(name + "Rig", None)
    sc.collection.objects.link(root)
    w, h = plate_finish.plate_size(rear)
    p = make_plate(name, face, w, h)
    plate_finish.add_flash(sc, name + "Flash", root, w, h)
    plate_finish.add_border(sc, name + "Border", root, w, h)
    c = plate_finish.build(sc, name + "Chars", FINISH, font=FONT, size=float(E("FS", "0.104")), height=CH)
    # (NUDGE centred the old font; the plate characters are centred already)
    glyphs = os.environ.get("PLATE_FONT", "plate") == "plate"
    c.location = (float(E("NUDGE", "0" if glyphs else "0.012")), -0.0004, 0.0002)
    p.parent = root
    c.parent = root
    root.location = loc
    root.rotation_euler = (0, tilt, rz)
    return root


# yellow lies flat; the white one rests across its left end, tipped a hair
YX, YY = float(E("YX", "0.27")), float(E("YY", "-0.03"))
yellow = plate_with_chars("Yellow", yellow_face, (YX, YY, PT), 0, rear=True)
white = plate_with_chars("White", white_face, (0, 0, PT + float(E("WZ", "0.0045"))), 0, math.radians(float(E("WT", "0.6"))))
white.location.y = float(E("WY", "0.075"))

rig = bpy.data.objects.new("Rig", None)
sc.collection.objects.link(rig)
yellow.parent = rig
white.parent = rig
rig.rotation_euler = (0, 0, math.radians(float(E("RZ", "18"))))

# ------------------------------------------------------------------ camera
cam_d = bpy.data.cameras.new("Cam")
cam_d.lens = float(E("LENS", "50"))
cam_d.sensor_width = 36
cam_d.dof.use_dof = True
cam_d.dof.aperture_fstop = float(E("FST", "8"))
cam_d.shift_x = float(E("SX", "0"))
cam_d.shift_y = float(E("SY", "0"))
cam = bpy.data.objects.new("Cam", cam_d)
sc.collection.objects.link(cam)
sc.camera = cam
cam.location = (float(E("CX", "-0.05")), float(E("CY", "-0.78")), float(E("CZ", "0.62")))
tgt = Vector((float(E("TX", "0.13")), float(E("TY", "0.03")), 0.0))
q = (tgt - cam.location).to_track_quat("-Z", "Y")
q = q @ Quaternion((0, 0, 1), math.radians(float(E("ROLL", "0"))))
cam.rotation_euler = q.to_euler()
foc = bpy.data.objects.new("Focus", None)
sc.collection.objects.link(foc)
foc.location = (float(E("FX", "0.1")), float(E("FY", "0.03")), 0.01)
cam_d.dof.focus_object = foc


def area(name, loc, tgt, size, energy, color=(1, 1, 1), sy=None, glossy=True, cam=False):
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
    o.visible_camera = cam


T = (0.1, 0.05, 0)
# the blue softbox far behind: seen only as its glow in the wet floor
area("Glow", (float(E("GX", "0.1")), float(E("GY", "3.2")), float(E("GZ", "0.75"))), (0.1, 0.6, 0), float(E("GS", "1.6")), float(E("GLOW", "160")), (0.45, 0.62, 1.0), sy=float(E("GS", "1.6")) * 0.5)
# warm key from the front-left on the plates (kept out of reflections)
area("Key", (-0.6, -0.5, 0.7), T, 0.6, float(E("KEY", "38")), (1.0, 0.97, 0.92), sy=0.4, glossy=False)
# long strip above: the bright line along the character tops
area("Strip", (0.0, 0.25, 0.55), T, 1.2, float(E("STRIP", "18")), (0.95, 0.97, 1.0), sy=0.03, glossy=False)
# cool rim from the right edge
area("Rim", (0.9, 0.1, 0.18), T, 0.8, float(E("RIM", "16")), (0.7, 0.85, 1.0), sy=0.05, glossy=False)
# faint warm bounce at the far left (the amber smear in the 3D art)
area("Amber", (-1.1, 0.6, 0.35), T, 0.4, float(E("AMB", "40")), (1.0, 0.6, 0.25), sy=0.6)

sc.render.filepath = OUT
sc.render.image_settings.file_format = "PNG"
sc.render.image_settings.color_mode = "RGB"
bpy.ops.render.render(write_still=True)
print("DONE", OUT)
