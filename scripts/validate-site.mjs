import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const pages = [
  "index.html",
  "servicios.html",
  "proyectos.html",
  "nosotros.html",
  "trabaja.html",
  "contacto.html"
];

const requiredFiles = [
  ...pages,
  "src/css/main.css",
  "src/js/config.js",
  "src/js/data.js",
  "src/js/main.js",
  "assets/brand/favicon.svg",
  "assets/brand/logo.svg",
  "assets/brand/og-image.svg",
  "vercel.json",
  "robots.txt",
  "sitemap.xml",
  "site.webmanifest"
];

const failures = [];

function assertFile(path) {
  if (!existsSync(join(root, path))) {
    failures.push(`Missing required file: ${path}`);
  }
}

requiredFiles.forEach(assertFile);

const assetRegex = /\b(?:href|src|content)=["']([^"']+\.(?:css|js|svg|jpeg|jpg|png|webp|mp4|xml|webmanifest))["']/gi;

for (const page of pages) {
  const pagePath = join(root, page);
  if (!existsSync(pagePath)) continue;
  const html = readFileSync(pagePath, "utf8");

  if (!html.includes('<meta name="viewport"')) {
    failures.push(`${page} is missing viewport meta tag`);
  }

  if (!html.includes("site-header")) {
    failures.push(`${page} is missing the shared header`);
  }

  if (!html.includes("src/js/config.js") || !html.includes("src/js/main.js")) {
    failures.push(`${page} is missing shared JavaScript files`);
  }

  for (const match of html.matchAll(assetRegex)) {
    const value = match[1];
    if (/^(https?:|mailto:|tel:|#|\[)/.test(value)) continue;
    const cleanPath = value.replace(/^\//, "");
    if (!existsSync(join(root, cleanPath))) {
      failures.push(`${page} references missing asset: ${value}`);
    }
  }
}

const data = readFileSync(join(root, "src/js/data.js"), "utf8");
for (const project of data.matchAll(/src:\s*"([^"]+)"/g)) {
  const path = project[1];
  if (!existsSync(join(root, path))) {
    failures.push(`Project data references missing asset: ${path}`);
  }
}

const css = readFileSync(join(root, "src/css/main.css"), "utf8");
for (const cssAsset of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
  const value = cssAsset[1];
  if (/^(https?:|data:)/.test(value)) continue;
  const absoluteFromCss = join(root, "src/css", value);
  if (!existsSync(absoluteFromCss)) {
    failures.push(`CSS references missing asset: ${value}`);
  }
}

const config = readFileSync(join(root, "src/js/config.js"), "utf8");
if (!config.includes("CRIDA_CONFIG")) {
  failures.push("src/js/config.js must expose CRIDA_CONFIG");
}

if (failures.length) {
  console.error("Site validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Site validation passed.");
