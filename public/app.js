const scenarios = {
  power: [
    "Primary region unplugged.",
    "Backup region online. The coffee survived.",
  ],
  deploy: [
    "Friday deploy pushed. At 4:59 p.m.",
    "Bad release rolled back. Weekend protected.",
  ],
  dns: [
    "DNS accused of everything, again.",
    "Healthy route selected. DNS would like an apology.",
  ],
};
const nines = {
  3: ["99.9%", "8.76 hours", "Enough time for a very uncomfortable all-hands."],
  5: [
    "99.999%",
    "5.26 minutes",
    "A coffee break. With significantly more shouting.",
  ],
  8: [
    "99.999999%",
    "0.315 seconds",
    "Less than a blink. More than we’re comfortable with.",
  ],
};

for (const button of document.querySelectorAll("[data-nines]")) {
  button.addEventListener("click", () => {
    const [percentage, downtime, caption] = nines[button.dataset.nines];
    document.querySelector("#sla-percentage").textContent = percentage;
    document.querySelector("#sla-downtime").textContent = downtime;
    document.querySelector("#sla-caption").textContent = caption;
    for (const option of document.querySelectorAll("[data-nines]")) {
      option.setAttribute("aria-pressed", String(option === button));
    }
    document.querySelectorAll(".sla-scale span").forEach((segment, index) => {
      segment.classList.toggle(
        "inactive",
        index >= Number(button.dataset.nines),
      );
    });
  });
}

const log = document.querySelector("#incident-log");
const initialLog = log.innerHTML;
let incidents = 0;
let recoveryTimer;
const chaosButtons = document.querySelectorAll("[data-chaos]");

function appendLog(label, message, className) {
  const line = document.createElement("p");
  const tag = document.createElement("span");
  tag.textContent = label;
  line.className = className;
  line.append(tag, message);
  log.append(line);
  while (log.children.length > 16) log.firstElementChild.remove();
  log.scrollTop = log.scrollHeight;
}

for (const button of chaosButtons) {
  button.addEventListener("click", () => {
    const [incident, recovery] = scenarios[button.dataset.chaos];
    for (const control of chaosButtons) control.disabled = true;
    appendLog("chaos", incident, "event-warning");
    recoveryTimer = setTimeout(() => {
      appendLog("resolved", recovery, "event-success");
      document.querySelector("#incident-count").textContent = String(
        ++incidents,
      );
      for (const control of chaosButtons) control.disabled = false;
    }, 650);
  });
}

document.querySelector("#reset-demo").addEventListener("click", () => {
  clearTimeout(recoveryTimer);
  incidents = 0;
  log.innerHTML = initialLog;
  document.querySelector("#incident-count").textContent = "0";
  for (const control of chaosButtons) control.disabled = false;
});

const signupDialog = document.querySelector("#signup-dialog");
for (const button of document.querySelectorAll("[data-signup]")) {
  button.addEventListener("click", () => {
    document.querySelector("#signup-message").textContent =
      `The ${button.dataset.signup} plan is, regrettably, imaginary. Your new sense of calm is yours to keep.`;
    signupDialog.showModal();
  });
}
for (const button of document.querySelectorAll("[data-close]")) {
  button.addEventListener("click", () => button.closest("dialog").close());
}
document
  .querySelector("#dialog-demo")
  .addEventListener("click", () => signupDialog.close());

document.querySelector("#open-status").addEventListener("click", async () => {
  const result = document.querySelector("#health-result");
  result.textContent = "Checking this server…";
  document.querySelector("#status-dialog").showModal();
  try {
    const response = await fetch("/api/health", {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error("Health check failed");
    const health = await response.json();
    if (health.status !== "ok" || !Number.isFinite(health.uptime))
      throw new Error("Invalid health response");
    result.textContent = `Server is online. Current process uptime: ${health.uptime.toLocaleString()} seconds. No imaginary metrics here.`;
  } catch {
    result.textContent =
      "The server did not answer. Apparently even fictional confidence has its limits. Close this window and try again.";
  }
});
