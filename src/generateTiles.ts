import * as fs from "fs";
import sharp from "sharp";

const tileSize = 256;
const outputDir = "tiles";

const zoomLevels = [
  { zoom: 0, scale: 1 / 64 },
  { zoom: 1, scale: 1 / 32 },
  { zoom: 2, scale: 1 / 16 },
  { zoom: 3, scale: 1 / 8 },
  { zoom: 4, scale: 1 / 4 },
  { zoom: 5, scale: 1 / 2 },
  { zoom: 6, scale: 1 },
];

export async function generateTiles() {
    console.time("Total time");

    if (!fs.existsSync("combined_image.png")) {
        console.error("Error: Combined image file 'combined_image.png' is missing.");
        return;
    }

    try {
        const buffer = fs.readFileSync("combined_image.png");
        const sharpInstance = sharp(buffer);
        const metadata = await sharpInstance.metadata();

        const zoomPromises = zoomLevels.map(async ({ zoom, scale }) => {
            const scaledWidth = Math.floor(metadata.width! * scale);
            const scaledHeight = Math.floor(metadata.height! * scale);
            const zoomDir = `${outputDir}/zoom_${zoom}`;

            fs.mkdirSync(zoomDir, { recursive: true });

            const resizedImage = await sharpInstance
                .clone()
                .resize(scaledWidth, scaledHeight)
                .toBuffer();

            const cols = Math.ceil(scaledWidth / tileSize);
            const rows = Math.ceil(scaledHeight / tileSize);
            const totalTiles = cols * rows;
            let completedTiles = 0;

            const tilePromises = [];
            for (let x = 0; x < cols; x++) {
                for (let y = 0; y < rows; y++) {
                    const left = x * tileSize;
                    const top = y * tileSize;
                    const width = Math.min(tileSize, scaledWidth - left);
                    const height = Math.min(tileSize, scaledHeight - top);
                    const tilePath = `${zoomDir}/${zoom}-${x}-${y}.jpg`;

                    tilePromises.push(
                        sharp(resizedImage)
                            .extract({ left, top, width, height })
                            .toFile(tilePath)
                            .then(() => {
                                completedTiles++;
                                if (
                                    completedTiles % 10 === 0 ||
                                    completedTiles === totalTiles
                                ) {
                                    console.log(`Zoom ${zoom} | ${completedTiles}/${totalTiles}`);
                                }
                            })
                            .catch(error => {
                                console.error(`Error creating tile ${tilePath}:`, error);
                            })
                    );
                }
            }

            await Promise.all(tilePromises);
            console.log(`Completed zoom level ${zoom}`);
        });

        await Promise.all(zoomPromises);

        console.timeEnd("Total time");
        console.log("All tiles generated successfully.");
    } catch (err) {
        console.error("Error generating tiles:", err);
    }
}