/**
 * Numbered contact sheets of a photo folder, so a whole shoot can be reviewed
 * (and labelled, ordered, picked for the hero) by looking at a few images.
 *
 *   npm run contact-sheet                       -> public/images/property
 *   npm run contact-sheet -- public/images/foo
 *
 * Writes .contact-sheet/sheet-1.jpg, sheet-2.jpg ... (20 photos each). The
 * number on each tile is the photo's position in the folder's sorted order,
 * which is also its filename prefix after `npm run images`.
 */
import sharp from "sharp";
import { mkdirSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";

const dir = process.argv[2] ?? "public/images/property";
const out = path.join(process.cwd(), ".contact-sheet");
const PER_SHEET = 20;
const COLS = 4;
const W = 420;
const H = 280;
const GAP = 8;

const files = readdirSync(dir)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (!files.length) {
  console.error(`No images in ${dir}`);
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const escape = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);

for (let sheet = 0; sheet * PER_SHEET < files.length; sheet++) {
  const batch = files.slice(sheet * PER_SHEET, (sheet + 1) * PER_SHEET);
  const rows = Math.ceil(batch.length / COLS);
  const tiles = await Promise.all(
    batch.map(async (file, i) => {
      const n = sheet * PER_SHEET + i + 1;
      const name = escape(file.length > 38 ? `${file.slice(0, 35)}...` : file);
      const label = Buffer.from(
        `<svg width="${W}" height="${H}"><rect x="0" y="${H - 30}" width="${W}" height="30" fill="black" fill-opacity="0.65"/>` +
          `<text x="10" y="${H - 10}" font-family="Helvetica, Arial" font-size="15" fill="white"><tspan font-weight="bold">#${n}</tspan>  ${name}</text></svg>`,
      );
      const input = await sharp(path.join(dir, file))
        .rotate()
        .resize(W, H, { fit: "cover" })
        .composite([{ input: label }])
        .toBuffer();
      return { input, left: (i % COLS) * (W + GAP), top: Math.floor(i / COLS) * (H + GAP) };
    }),
  );
  const file = path.join(out, `sheet-${sheet + 1}.jpg`);
  await sharp({
    create: { width: COLS * W + (COLS - 1) * GAP, height: rows * H + (rows - 1) * GAP, channels: 3, background: "#111" },
  })
    .composite(tiles)
    .jpeg({ quality: 72 })
    .toFile(file);
  console.log(file);
}
