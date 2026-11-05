"""Build an Excalifont add-on subset with the Uzbek glyphs it lacks:
ʻ (U+02BB), Ғ ғ, Қ қ, Ҳ ҳ — composed from Excalifont's own strokes.
Needs: pip install fonttools brotli
usage: python uzfont.py <Excalifont latin subset .woff2> <Excalifont cyrillic subset .woff2> <out.woff2>
(latin = the subset containing U+0020-007E, cyrillic = the one containing U+0400-045F)"""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools import subset

lat_p, cyr_p, out_p = sys.argv[1:4]
lat, cyr = TTFont(lat_p), TTFont(cyr_p)
lgs, cgs = lat.getGlyphSet(), cyr.getGlyphSet()
lcm, ccm = lat.getBestCmap(), cyr.getBestCmap()

def bounds(gs, name):
    bp = BoundsPen(gs); gs[name].draw(bp); return bp.bounds

def build(base_char, parts):
    """parts: list of (glyphset, glyphname, transform)"""
    base = ccm[ord(base_char)]
    pen = TTGlyphPen(None)
    cgs[base].draw(pen)
    for gs, name, tr in parts:
        gs[name].draw(TransformPen(pen, tr))
    return pen.glyph(), cyr["hmtx"][base]

bar = lcm[ord("|")]
hyph = lcm[ord("-")]
comma = lcm[ord(",")]
bx0, by0, bx1, by1 = bounds(lgs, bar)
hx0, hy0, hx1, hy1 = bounds(lgs, hyph)
cx0, cy0, cx1, cy1 = bounds(lgs, comma)

def descender(base_char, scale=1.0):
    """hand-drawn tail hanging from the bottom-right of the leg (Қ, Ҳ),
    reusing Excalifont's own comma stroke"""
    from fontTools.pens.recordingPen import DecomposingRecordingPen
    x0, y0, x1, y1 = bounds(cgs, ccm[ord(base_char)])
    rec = DecomposingRecordingPen(cgs); cgs[ccm[ord(base_char)]].draw(rec)
    pts = [pt for _, args in rec.value for pt in args]
    # right end of the bottom-right leg: rightmost point near the baseline
    x1 = max(x for x, y in pts if y < y0 + 0.25 * (y1 - y0))
    scale *= 0.6                        # Excalifont's comma is ~410 units tall
    dx = x1 - 10 - (cx0 + cx1) / 2 * scale
    dy = y0 + 70 - cy1 * scale          # overlap the leg so it reads as one stroke
    return [(lgs, comma, (scale, 0, 0, scale, dx, dy))]

def crossbar(base_char):
    """horizontal stroke across the stem at ~45% height (Ғ)"""
    x0, y0, x1, y1 = bounds(cgs, ccm[ord(base_char)])
    target_w = (x1 - x0) * 0.62
    sx = target_w / (hx1 - hx0)
    sy = 0.9
    dx = x0 - (x1 - x0) * 0.16 - hx0 * sx
    ymid = y0 + (y1 - y0) * 0.45
    dy = ymid - (hy0 + hy1) / 2 * sy
    return [(lgs, hyph, (sx, 0, 0, sy, dx, dy))]

new = {
    0x0492: ("Gestroke", build("Г", crossbar("Г"))),
    0x0493: ("gestroke", build("г", crossbar("г"))),
    0x049A: ("Kadescender", build("К", descender("К"))),
    0x049B: ("kadescender", build("к", descender("к", 0.85))),
    0x04B2: ("Hadescender", build("Х", descender("Х"))),
    0x04B3: ("hadescender", build("х", descender("х", 0.85))),
}
# ʻ = Excalifont's own left single quote
pen = TTGlyphPen(None); lgs[lcm[0x2018]].draw(pen)
new[0x02BB] = ("uni02BB", (pen.glyph(), lat["hmtx"][lcm[0x2018]]))

order = cyr.getGlyphOrder()
for cp, (name, (glyph, metrics)) in new.items():
    order.append(name)
    cyr["glyf"][name] = glyph
    cyr["hmtx"][name] = metrics
cyr.setGlyphOrder(order)
for table in cyr["cmap"].tables:
    if table.isUnicode():
        for cp, (name, _) in new.items():
            table.cmap[cp] = name
cyr["maxp"].numGlyphs = len(order)

opts = subset.Options(); opts.flavor = "woff2"; opts.notdef_outline = True
opts.layout_features = []; opts.name_IDs = ["*"]; opts.name_languages = ["*"]
s = subset.Subsetter(opts); s.populate(unicodes=list(new)); s.subset(cyr)
cyr.flavor = "woff2"; cyr.save(out_p)
print("wrote", out_p, sorted(hex(c) for c in cyr.getBestCmap()))
