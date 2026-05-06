import fitz
import os

pdf_path = "GRAVITY CLINIC LOGO (1).pdf"
out_path = "public/logo.png"

# Ensure public directory exists
os.makedirs("public", exist_ok=True)

# Open PDF
doc = fitz.open(pdf_path)

# Load first page
page = doc.load_page(0)

# Render to pixmap with high resolution and transparency
pix = page.get_pixmap(dpi=300, alpha=True)

# Save to public directory
pix.save(out_path)
print(f"Successfully saved logo to {out_path}")
