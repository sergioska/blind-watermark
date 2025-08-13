import * as fs from "fs";
import { addWatermark, extractWatermark } from "../src/watermark";
import { WatermarkOptions } from "../src/types";

(async () => {
  process.on("unhandledRejection", (e) => {
    console.error("UNHANDLED REJECTION:", e);
    process.exit(1);
  });

  console.log("Inizio test");
  const inputPath = "demo/input.jpeg";
  if (!fs.existsSync(inputPath)) {
    console.error(`File non trovato: ${inputPath}`);
    process.exit(1);
  }

  const original = fs.readFileSync(inputPath);
  console.log("original", original);

  const wmText = "il mio watermark invisibile";
  const opts: WatermarkOptions = { q: 22, channel: 1, seed: 1234, reps: 5 };
  console.log("opts", opts);

  try {
    console.time("addWatermark");
    console.log("addWatermark");
    const { image } = await addWatermark(original, wmText, opts);
    console.log("addWatermark done");
    console.timeEnd("addWatermark");

    fs.writeFileSync("demo/watermarked.jpeg", image);
    console.log("Watermark aggiunto -> watermarked.png");

    const savedImage = fs.readFileSync("demo/watermarked.jpeg");

    console.time("extractWatermark");
    const extracted = await extractWatermark(savedImage, opts);
    console.timeEnd("extractWatermark");

    console.log("Watermark estratto:", JSON.stringify(extracted));
  } catch (err) {
    console.error("Errore nel test:", err);
  }
})();