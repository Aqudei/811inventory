import qrcode
import json
import base64
from PIL import Image, ImageDraw, ImageFont
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import legal, letter, A4
from reportlab.lib.utils import ImageReader
import io

# Select page size
PAGE_SIZES = {
    "legal": legal,
    "letter": letter,
    "a4": A4,
}


def generate_qr_with_text(data_text, label_text, qr_size=100):
    """Generate a QR code with centered text below."""
    qr = qrcode.QRCode(version=1, box_size=10, border=2)
    qr.add_data(data_text)
    qr.make(fit=True)

    qr_img = qr.make_image(fill_color="black", back_color="white")
    qr_img = qr_img.resize((qr_size, qr_size), Image.LANCZOS)

    font = ImageFont.load_default()
    text_height = 40
    final = Image.new("RGB", (qr_size, qr_size + text_height), "white")
    final.paste(qr_img, (0, 0))

    draw = ImageDraw.Draw(final)
    bbox = draw.textbbox((0, 0), label_text, font=font)
    text_width = bbox[2] - bbox[0]

    draw.text(
        ((qr_size - text_width) // 2, qr_size + 5),
        label_text,
        fill="black",
        font=font
    )

    return final


def create_pdf(images, pdf_file, paper="legal", padding=10):
    """Auto-layout images into multiple PDF pages."""
    page_w, page_h = PAGE_SIZES[paper]

    # Check image size
    img_w, img_h = images[0].size

    # Calculate max columns and rows per page
    cols = int((page_w - padding) // (img_w + padding))
    rows = int((page_h - padding) // (img_h + padding))

    if cols < 1: cols = 1
    if rows < 1: rows = 1

    per_page = cols * rows

    c = canvas.Canvas(pdf_file, pagesize=PAGE_SIZES[paper])

    for page_start in range(0, len(images), per_page):
        batch = images[page_start:page_start + per_page]

        x = padding
        y = page_h - img_h - padding

        for idx, img in enumerate(batch):
            # PIL image -> Reportlab ImageReader
            buf = io.BytesIO()
            img.save(buf, format="PNG")
            buf.seek(0)

            c.drawImage(ImageReader(buf), x, y, width=img_w, height=img_h)

            # Move position
            x += img_w + padding
            if (idx + 1) % cols == 0:
                x = padding
                y -= img_h + padding

        c.showPage()

    c.save()


def main():
    images = []

    for i in range(200):
        data = {"v": 1, "qr": f"a:{i+1}"}
        encoded = base64.b64encode(json.dumps(data).encode()).decode()

        img = generate_qr_with_text(encoded, f"a:{i+1}")
        images.append(img)

    create_pdf(images, "qr_codes.pdf", paper="legal")


if __name__ == "__main__":
    main()
