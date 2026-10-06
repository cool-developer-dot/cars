# Headless render: the "What are … number plates?" art. A white front plate
# above and a yellow rear plate in front of it, both standing and facing the
# camera at a slight tilt, on a wet navy floor that mirrors the yellow plate,
# with soft blue light streaks behind (the look of public/3d/gel-plates.webp).
#   Blender -b --factory-startup --python render-plates-stack.py -- <preview|final> <abs-out.png> <finish>
# finish: gel | acrylic | acrylicGel | bevel | ghost. Pose / look are env vars (E(...) below).
import bpy, bmesh, math, os, random, sys
from mathutils import Vector, Quaternion

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import plate_finish  # noqa: E402

E = os.environ.get
argv = sys.argv[sys.argv.index("--") + 1:]
MODE, OUT, FINISH = argv[0], argv[1], argv[2]
random.seed(int(E("SEED", "3")))

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

RW, RH = int(E("RW", "1522")), int(E("RH", "1010"))
W, H = (RW, RH) if MODE == "final" else (RW * 2 // 5, RH * 2 // 5)
sc.render.resolution_x, sc.render.resolution_y = W, H
cy.samples = 260 if MODE == "final" else 48
cy.use_denoising = True
cy.max_bounces = 12
cy.glossy_bounces = 10
cy.transmission_bounces = 8
cy.caustics_reflective = False
cy.caustics_refractive = False
sc.view_settings.view_transform = "Khronos PBR Neutral"
sc.view_settings.look = "None"
sc.view_settings.exposure = float(E("EXP", "-0.8"))

world = bpy.data.worlds.new("W")
sc.world = world
world.use_nodes = True
bg = world.node_tree.nodes["Background"]
bg.inputs["Color"].default_value = (0.004, 0.012, 0.03, 1)
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


white_face = mat("White", (float(E("WA", "0.6")), float(E("WA", "0.6")) + 0.02, float(E("WA", "0.6")) + 0.05, 1), rough=0.3, coat=float(E("FCOAT", "0.3")), coat_rough=0.08)
bumpy(white_face, 900, 0.04, 0.0002)
yellow_face = mat("Yellow", (1.0, float(E("YG", "0.47")), 0.0, 1), rough=0.3, coat=float(E("FCOAT", "0.3")), coat_rough=0.08)
bumpy(yellow_face, 900, 0.04, 0.0002)
rim = mat("Rim", (0.86, 0.88, 0.92, 1), rough=0.16, metal=1.0)

# ------------------------------------------------------------------ plates
PW, PH, PT = 0.520, 0.111, float(E("PT", "0.007"))
CH = float(E("CH", "0.006"))


def make_plate(name, face):
    bm = bmesh.new()
    hw, hh = PW / 2, PH / 2
    vs = [bm.verts.new(v) for v in ((-hw, -hh, 0), (hw, -hh, 0), (hw, hh, 0), (-hw, hh, 0))]
    bm.faces.new(vs)
    bmesh.ops.bevel(bm, geom=vs, offset=0.011, segments=8, profile=0.5, affect="VERTICES")
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(name, me)
    sc.collection.objects.link(o)
    sol = o.modifiers.new("Solid", "SOLIDIFY")
    sol.thickness = PT
    sol.offset = -1
    bev = o.modifiers.new("Bevel", "BEVEL")
    bev.width = float(E("RIMW", "0.0024"))
    bev.segments = 4
    bev.limit_method = "ANGLE"
    me.materials.append(face)
    me.materials.append(rim)
    bpy.context.view_layer.objects.active = o
    for m in list(o.modifiers):
        bpy.ops.object.modifier_apply(modifier=m.name)
    for p in me.polygons:
        p.material_index = 0 if p.normal.z > 0.9 else 1
    return o


def bezel(name):
    """A slightly larger silver tray behind the face: the bright edge round the plate."""
    bm = bmesh.new()
    B = float(E("BEZ", "0.0045"))
    hw, hh = PW / 2 + B, PH / 2 + B
    vs = [bm.verts.new(v) for v in ((-hw, -hh, 0), (hw, -hh, 0), (hw, hh, 0), (-hw, hh, 0))]
    bm.faces.new(vs)
    bmesh.ops.bevel(bm, geom=vs, offset=0.011 + B, segments=8, profile=0.5, affect="VERTICES")
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(name, me)
    sc.collection.objects.link(o)
    sol = o.modifiers.new("Solid", "SOLIDIFY")
    sol.thickness = PT
    sol.offset = -1
    bev = o.modifiers.new("Bevel", "BEVEL")
    bev.width = B * 0.8
    bev.segments = 5
    bev.limit_method = "ANGLE"
    me.materials.append(rim)
    bpy.context.view_layer.objects.active = o
    for m in list(o.modifiers):
        bpy.ops.object.modifier_apply(modifier=m.name)
    return o


def standing_plate(name, face, loc):
    """A plate (face toward -Y) with its characters, standing at `loc` (its centre)."""
    rig = bpy.data.objects.new(name + "Rig", None)
    sc.collection.objects.link(rig)
    bz = bezel(name + "Bezel")
    bz.location = (0, 0, -0.0012)
    bz.parent = rig
    p = make_plate(name, face)
    c = plate_finish.build(sc, name + "Chars", FINISH, height=CH)
    c.location = (0, 0, 0.0002)
    p.parent = rig
    c.parent = rig
    rig.location = loc
    # +90 about X turns the face (+Z) toward -Y; LEAN tips the top back
    rig.rotation_euler = (math.radians(90 - float(E("LEAN", "6"))), 0, math.radians(float(E("YAW", "0"))))
    return rig


GAP = float(E("GAP", "0.016"))
yellow = standing_plate("Yellow", yellow_face, (float(E("YX", "0.07")), 0.0, PH / 2 + 0.002))
white = standing_plate("White", white_face, (0.0, float(E("WY", "0.05")), PH * 1.5 + GAP + 0.002))

# ------------------------------------------------------------------ floor: wet navy, mirrors the yellow plate
floor_mat = mat("Floor", (0.002, 0.006, 0.016, 1), rough=float(E("FR", "0.06")), coat=float(E("FC", "1.0")),
                coat_rough=float(E("FCR", "0.03")))
bumpy(floor_mat, 30, float(E("RIPS", "0.08")), 0.002)
bpy.ops.mesh.primitive_plane_add(size=8)
bpy.context.object.data.materials.append(floor_mat)

# ------------------------------------------------------------------ backdrop: blue light streaks, far and blurred
streak = mat("Streak", (0, 0, 0, 1), rough=1, emit=(0.18, 0.45, 1.0, 1), emit_str=float(E("STR", "40")))
# long thin lights lying on the far floor, angled: soft blue streaks above the plates once blurred
for x, y, ang, ln, r in ((-0.9, 2.4, 18, 2.2, 0.012), (0.2, 3.2, 12, 2.6, 0.016), (-0.4, 1.7, 22, 1.2, 0.008),
                         (1.1, 2.6, 8, 1.6, 0.01)):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=ln, location=(x, y, r))
    o = bpy.context.object
    o.rotation_euler = (0, math.radians(90), math.radians(ang))
    o.data.materials.append(streak)
glow = mat("Glow", (0, 0, 0, 1), rough=1, emit=(0.6, 0.78, 1.0, 1), emit_str=float(E("GLOW", "18")))
bpy.ops.mesh.primitive_circle_add(vertices=48, radius=0.18, fill_type="NGON", location=(0.95, 1.8, 0.7))
o = bpy.context.object
o.rotation_euler = (math.radians(90), 0, 0)
o.data.materials.append(glow)

# ------------------------------------------------------------------ camera
cam_d = bpy.data.cameras.new("Cam")
cam_d.lens = float(E("LENS", "55"))
cam_d.sensor_width = 36
cam_d.dof.use_dof = True
cam_d.dof.aperture_fstop = float(E("FST", "6"))
cam_d.shift_x = float(E("SX", "0"))
cam_d.shift_y = float(E("SY", "0"))
cam = bpy.data.objects.new("Cam", cam_d)
sc.collection.objects.link(cam)
sc.camera = cam
cam.location = (float(E("CX", "-0.16")), float(E("CY", "-0.95")), float(E("CZ", "0.26")))
tgt = Vector((float(E("TX", "0.04")), 0.0, float(E("TZ", "0.12"))))
q = (tgt - cam.location).to_track_quat("-Z", "Y")
q = q @ Quaternion((0, 0, 1), math.radians(float(E("ROLL", "12"))))
cam.rotation_euler = q.to_euler()
foc = bpy.data.objects.new("Focus", None)
sc.collection.objects.link(foc)
foc.location = (0.03, 0.0, 0.12)
cam_d.dof.focus_object = foc


def area(name, loc, size, energy, color=(1, 1, 1), sy=None, glossy=True, tgt=(0.03, 0.02, 0.12)):
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


# soft key from the front-left lights the faces (kept out of the glossy tops)
area("Key", (-0.7, -0.9, 0.7), 0.9, float(E("KEY", "60")), (1.0, 0.98, 0.95), sy=0.6, glossy=False)
# long strips above and to the right: the bright lines along the character edges
area("StripTop", (0.1, -0.5, 0.75), 1.4, float(E("STRIP", "26")), (0.95, 0.97, 1.0), sy=0.03)
area("StripSide", (0.9, -0.6, 0.25), 1.0, float(E("SIDE", "14")), (0.8, 0.9, 1.0), sy=0.03, glossy=bool(int(E("SIDEG", "0"))))
# broad softbox high front-right: the sheen that grades across the plate faces
area("Sheen", (0.5, -0.7, 0.9), 1.2, float(E("SHEEN", "30")), (0.92, 0.95, 1.0), sy=0.5, glossy=False)
# cool fill low on the left
area("Fill", (-0.8, -0.3, 0.05), 0.6, float(E("FILL", "10")), (0.45, 0.65, 1.0), sy=0.3, glossy=False)
# rim from behind-right: separates the plates from the dark backdrop
area("Rim", (0.8, 0.6, 0.45), 0.6, float(E("RIM", "30")), (0.6, 0.8, 1.0), sy=0.1, glossy=False)

sc.render.filepath = OUT
sc.render.image_settings.file_format = "PNG"
sc.render.image_settings.color_mode = "RGB"
bpy.ops.render.render(write_still=True)
print("DONE", OUT)
