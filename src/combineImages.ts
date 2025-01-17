import * as fs from "fs";
import { createCanvas, loadImage } from 'canvas';

const imagePaths = [
    "minimap_0_0.png",
    "minimap_0_1.png",
    "minimap_1_0.png",
    "minimap_1_1.png",
    "minimap_2_0.png",
    "minimap_2_1.png"
];

const canvasWidth = 8192;
const canvasHeight = 12288;

export async function combineImages() {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    for (let i = 0; i < imagePaths.length; i++) {
        if (!fs.existsSync(imagePaths[i])) {
            console.error(`Error: File ${imagePaths[i]} is missing.`);
            return;
        }

        try {
            const img = await loadImage(imagePaths[i]);
            const xOffset = (i % 2) * 4096; // 2 images per row
            const yOffset = Math.floor(i / 2) * 4096; // 3 rows
            ctx.drawImage(img, xOffset, yOffset, 4096, 4096);
        } catch (error) {
            console.error(`Error loading image ${imagePaths[i]}:`, error);
            return;
        }
    }

    try {
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync('combined_image.png', buffer);
        console.log('Images combined successfully');
    } catch (error) {
        console.error('Error saving combined image:', error);
    }
}