from PIL import Image

image_paths = [
    "minimap_0_0.png",
    "minimap_0_1.png",
    "minimap_1_0.png",
    "minimap_1_1.png",
    "minimap_2_0.png",
    "minimap_2_1.png"
]

combined_image = Image.new('RGBA', (8192, 12288), (0, 0, 0, 0))

for i, image_path in enumerate(image_paths):
    img = Image.open(image_path).convert("RGBA")
    x_offset = (i % 2) * 4096  # 2 images per row
    y_offset = (i // 2) * 4096  # 3 rows
    combined_image.paste(img, (x_offset, y_offset), img)

combined_image.save("combined_image.png")