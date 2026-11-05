"""Build uz-UZ (Latin) and uz-Cyrl-UZ (Cyrillic) locale files.

uz-UZ.json is the hand-written source; this normalises its apostrophes,
checks keys/placeholders against en.json and transliterates it to Cyrillic.

usage (from the repo root):
  python3 -I scripts/build-uzbek-locales.py packages/excalidraw/locales/uz-UZ.json \\
    packages/excalidraw/locales/en.json packages/excalidraw/locales
"""
import json, re, sys
draft_p, en_p, out_dir = sys.argv[1:4]
draft = json.load(open(draft_p, encoding="utf-8"))
en = json.load(open(en_p, encoding="utf-8"))

def walk(a, b, path=""):
    """check keys and placeholders match English"""
    errs = []
    for k, v in a.items():
        p = f"{path}.{k}" if path else k
        if k not in b:
            errs.append(f"missing {p}"); continue
        if isinstance(v, dict):
            errs += walk(v, b[k], p)
        else:
            tok = lambda s: sorted(re.findall(r"\{\{?\w+\}\}?|</?\w+>", s))
            if tok(v) != tok(b[k]):
                errs.append(f"placeholder mismatch {p}: {tok(v)} vs {tok(b[k])}")
            if not b[k].strip() and v.strip():
                errs.append(f"empty {p}")
    for k in b:
        if k not in a:
            errs.append(f"extra {path}.{k}")
    return errs

def latin_fix(s):
    s = s.replace("Qarg'a", "Qargʻa")
    return s.replace("'", "ʼ")   # remaining ASCII apostrophes = tutuq belgisi

def mapv(d, f):
    return {k: mapv(v, f) if isinstance(v, dict) else f(v) for k, v in d.items()}

latn = mapv(draft, latin_fix)

# --- Latin -> Cyrillic -------------------------------------------------------
KEEP = r"\{\{?\w+\}\}?|</?\w+>|\{filename\}|\bDoska(?=ʼ| Pro)|\b(?:Pro|PNG|SVG|PWA|Mermaid|GitHub|Discord|Firefox|Brave|Twitter|MIT|URL|Hex|IFrame|Ctrl|Shift|Esc|Enter|Alt|Cmd|Option|Delete|Tab|AI|Beta|ER|ID|Aggressively Block Fingerprinting|dom\.events\.asyncClipboard\.clipboardItem|true|about:config|embed)(?![A-Za-z])"
VOW = "aeiouoʻAEIOU"
MULTI = [("shʻ", "шъ"), ("sh", "ш"), ("ch", "ч"), ("oʻ", "ў"), ("gʻ", "ғ"), ("yo", "ё"), ("yu", "ю"), ("ya", "я")]
SINGLE = dict(zip("abdfghijklmnopqrstuvxyz", "абдфгҳижклмнопқрстувхйз"))

def word_to_cyr(w):
    out, i = [], 0
    while i < len(w):
        ch = w[i]; low = w[i:].lower(); up = ch.isupper()
        def put(c, n):
            nonlocal i
            out.append(c.upper() if up else c); i += n
        if ch == "ʼ":
            put("ъ" if i > 0 else "ʼ", 1); continue
        m = next(((l, c) for l, c in MULTI if low.startswith(l)), None)
        if m:
            put(m[1], len(m[0])); continue
        if low.startswith("ye") and (i == 0 or w[i-1].lower() in "aeiou"):
            put("е", 2); continue
        if ch.lower() == "e":
            put("э" if i == 0 or w[i-1].lower() in "aeiou" else "е", 1); continue
        if ch.lower() in SINGLE:
            put(SINGLE[ch.lower()], 1); continue
        out.append(ch); i += 1
    return "".join(out)

def to_cyr(s):
    parts = re.split(f"({KEEP})", s)
    res = []
    for idx, part in enumerate(parts):
        if idx % 2 == 1:
            res.append(part)   # protected token
        else:
            res.append(re.sub(r"[A-Za-zʻʼ]+", lambda m: word_to_cyr(m.group(0)), part))
    out = "".join(res)
    for a, b in (("бйект", "бъект"), ("итсенз", "иценз")):
        out = out.replace(a, b)
    return out

cyr = mapv(latn, to_cyr)

errs = walk(latn, en) + walk(cyr, en)
if errs:
    print("\n".join(errs)); sys.exit(1)
for name, data in (("uz-UZ", latn), ("uz-Cyrl-UZ", cyr)):
    with open(f"{out_dir}/{name}.json", "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2); fh.write("\n")
print("ok")
