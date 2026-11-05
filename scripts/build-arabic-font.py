"""Build the Arabic add-on face for Excalifont from Playpen Sans Arabic (OFL).
Needs: pip install fonttools brotli
usage: python scripts/build-arabic-font.py <PlaypenSansArabic[wght].ttf> <weight> <out.woff2>
(Doska ships weight 500, which matches Excalifont's stroke.)"""
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

src, weight, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
font = TTFont(src)
font = instancer.instantiateVariableFont(font, {"wght": weight}, updateFontNames=False)

# Arabic block, Arabic presentation forms A/B, and the joiner/direction marks
unicodes = (
    list(range(0x0600, 0x0700))
    + list(range(0xFB50, 0xFE00))
    + list(range(0xFE70, 0xFF00))
    + list(range(0x200C, 0x2010))
)
opts = subset.Options()
opts.flavor = "woff2"
opts.layout_features = ["*"]          # keep joining, ligatures, mark positioning
opts.name_IDs = ["*"]
opts.name_languages = ["*"]
opts.notdef_outline = True
opts.hinting = False
opts.desubroutinize = True
s = subset.Subsetter(opts)
s.populate(unicodes=unicodes)
s.subset(font)
font.flavor = "woff2"
font.save(out)
cmap = font.getBestCmap()
print(out, "glyphs:", len(font.getGlyphOrder()), "codepoints:", len(cmap))
