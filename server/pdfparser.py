# pip install pdfplumber python-dateutil
import pdfplumber, re, json
from dateutil import parser as dt

PDF_PATH = "syllabus.pdf"     # <-- your file
YEAR_HINT = 2025              # set the course year

# 1) helpful preview so you can adjust the crop box
with pdfplumber.open('./ex-syllabus/examplepdf.pdf') as pdf:
    p0 = pdf.pages[0]
    p0.to_image(resolution=180).save("page0.png")
    print("Saved preview: page0.png (use it to tweak crop coords)")

# 2) fallback: group words by Y (row), inside a cropped region that hugs the grid
def lines_by_y(page, y_tol=3):
    words = page.extract_words() or []
    rows = {}
    for w in words:
        y = round(w["top"]/y_tol)*y_tol
        rows.setdefault(y, []).append(w)
    lines = []
    for y, ws in sorted(rows.items()):
        ws.sort(key=lambda w: w["x0"])
        lines.append(" ".join(w["text"] for w in ws))
    return lines

MONTH = r"(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?"
DATE_RE = re.compile(rf"\b{MONTH}\s*\d{{1,2}}\b", re.I)

def parse_lines(lines, page_num, year=YEAR_HINT):
    items = []
    for line in lines:
        m = DATE_RE.search(line)
        if not m:
            continue
        # parse "Sept. 25" -> 2025-09-25
        try:
            date_iso = dt.parse(f"{m.group(0)} {year}", fuzzy=True).date().isoformat()
        except Exception:
            date_iso = None
        details = line[m.end():].strip(" :—–-|")
        items.append({
            "page": page_num,
            "date_text": m.group(0),
            "date": date_iso,
            "details": details,
            "raw": line
        })
    return items

all_items = []
with pdfplumber.open("./ex-syllabus/examplepdf.pdf") as pdf:
    for i, page in enumerate(pdf.pages, 1):
        #  tweak these 4 numbers after inspecting page0.png
        #  (x0, top, x1, bottom) in PDF points
        region = page.crop((40, 110, page.width-40, page.height-40))
        region.to_image(resolution=180).save(f"page{i}_cropped.png")  # debug
        lines = lines_by_y(region, y_tol=3)
        all_items += parse_lines(lines, i)

print("parsed rows:", len(all_items))
print(json.dumps(all_items[:10], indent=2, ensure_ascii=False))
