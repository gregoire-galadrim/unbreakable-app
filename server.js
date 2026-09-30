const express = require("express");
const path = require("node:path");

const app = express();
app.disable("x-powered-by");
app.get("/api/health", (_request, response) => {
  response
    .set("Cache-Control", "no-store")
    .json({ status: "ok", uptime: Math.floor(process.uptime()) });
});
app.use(express.static(path.join(__dirname, "public")));

if (require.main === module) {
  const server = app.listen(process.env.PORT || 3000, "0.0.0.0", (error) => {
    if (error) {
      console.error(`Unstoppable could not start: ${error.message}`);
      process.exitCode = 1;
      return;
    }
    console.log(
      `Unstoppable is up at http://localhost:${server.address().port}`,
    );
  });
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.once(signal, () => server.close(() => process.exit(0)));
  }
}

module.exports = app;
