const assert = require("node:assert/strict");
const { test } = require("node:test");
const { once } = require("node:events");
const { execFile } = require("node:child_process");
const path = require("node:path");
const app = require("../server");

test("serves the landing page, its assets, and an uncached health check", async () => {
  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    const page = await fetch(origin);
    assert.equal(page.status, 200);
    assert.match(page.headers.get("content-type"), /text\/html/);
    assert.equal(page.headers.get("x-powered-by"), null);
    const html = await page.text();
    assert.match(html, /99\.999999%/);
    for (const asset of [
      "/style.css",
      "/app.js",
      "/mascot.svg",
      "/favicon.svg",
      "/fonts/bricolage-800.ttf",
      "/fonts/dm-sans-400.ttf",
    ]) {
      const response = await fetch(origin + asset);
      assert.equal(response.status, 200, asset);
      assert.ok((await response.arrayBuffer()).byteLength > 0, asset);
    }
    const health = await fetch(origin + "/api/health");
    assert.equal(health.headers.get("cache-control"), "no-store");
    const body = await health.json();
    assert.equal(body.status, "ok");
    assert.ok(Number.isInteger(body.uptime) && body.uptime >= 0);
    for (const unavailable of [
      "/not-a-page",
      "/server.js",
      "/package.json",
      "/.env",
    ]) {
      assert.equal(
        (await fetch(origin + unavailable)).status,
        404,
        unavailable,
      );
    }
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});

test("reports the listen error when the port is already in use", async () => {
  const occupied = app.listen(0);
  await once(occupied, "listening");
  try {
    const result = await new Promise((resolve) => {
      execFile(
        process.execPath,
        [path.join(__dirname, "../server.js")],
        {
          env: { ...process.env, PORT: String(occupied.address().port) },
          timeout: 5000,
        },
        (error, stdout, stderr) => resolve({ error, stdout, stderr }),
      );
    });
    assert.equal(result.error.code, 1);
    assert.match(result.stderr, /EADDRINUSE/);
    assert.doesNotMatch(result.stderr, /TypeError/);
    assert.equal(result.stdout, "");
  } finally {
    await new Promise((resolve) => occupied.close(resolve));
  }
});
