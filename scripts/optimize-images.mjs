/**
 * Shrinks a folder of photographer originals for the web.
 *
 *   npm run images -- "/path/to/Photographer Export"            -> public/images/property
 *   npm run images -- "/path/to/Photographer Export" my-folder  -> public/images/my-folder
 *
 * Each photo becomes a 2000px-wide mozjpeg (next/image makes the smaller sizes
 * on demand). Filenames are slugged and numbered in the source's sort order,
 * so "01-front-exterior.jpg" style names from the photographer keep their
 * order. Then list the files in `images` in site.config.ts.
 */
import sharp from "sharp";
import { mkdirSync, readdirSync } from "node:fs";
import path from "node:path";

const [src, folder = "property"] = process.argv.slice(2);
if (!src) {
  console.error('Usage: npm run images -- "<source folder>" [output folder name]');
  process.exit(1);
}

const out = path.join(process.cwd(), "public", "images", folder);
mkdirSync(out, { recursive: true });

const files = readdirSync(src)
  .filter((f) => /\.(jpe?g|png|webp|tiff?|heic)$/i.test(f))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const slug = (file) =>
  file
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

let after = 0;
for (const [i, file] of files.entries()) {
  const name = `${String(i + 1).padStart(2, "0")}-${slug(file)}.jpg`.replace(/^(\d+)-\1-/, "$1-");
  const input = path.join(src, file);
  const info = await sharp(input)
    .rotate()
    .resize({ width: 2000, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(path.join(out, name));
  after += info.size;
  console.log(`${name}  ${(info.size / 1024).toFixed(0)} KB`);
}

console.log(`\n${files.length} photos -> public/images/${folder} (${(after / 1048576).toFixed(1)} MB)`);
