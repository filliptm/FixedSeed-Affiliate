import { readFileSync, existsSync } from "fs";
import { join, extname } from "path";

const DIST = join(import.meta.dir, "dist");
const PORT = parseInt(process.env.PORT || "3000");

const mimeTypes: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

Bun.serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    let pathname = url.pathname;

    let filePath = join(DIST, pathname);

    if (!existsSync(filePath) || pathname === "/") {
      filePath = join(DIST, "index.html");
    }

    try {
      const content = readFileSync(filePath);
      const ext = extname(filePath);
      const contentType = mimeTypes[ext] || "application/octet-stream";

      return new Response(content, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
        },
      });
    } catch {
      const html = readFileSync(join(DIST, "index.html"));
      return new Response(html, {
        headers: { "Content-Type": "text/html" },
      });
    }
  },
});

console.log(`Fixed Seed Affiliate portal running on port ${PORT}`);
