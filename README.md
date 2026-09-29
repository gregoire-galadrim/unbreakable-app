# Unstoppable Product

A fictional reliability product, built with Express, plain HTML, CSS, and JavaScript. All fonts and artwork are served locally. There is no build step, account system, payment flow, or database.

## Run

Use Node.js 22 or newer.

```sh
pnpm install --frozen-lockfile
pnpm start
```

Open http://localhost:3000. Set `PORT` to use another port (for example, `PORT=3001 node server.js`). An occupied port produces an error and exit code 1. For automatic server reloads, use `npm run dev`. Dependencies are locked with pnpm; the npm run commands below also work with pnpm.

## Run with PM2

```sh
npm run pm2:start
npm run pm2:logs
npm run pm2:restart
npm run pm2:stop
```

PM2 is a local dependency; a global installation is not required. The process is named `unstoppable`. It restarts after a failure and at 256 MB of memory. The configuration uses the project directory, so the server can also be launched from another working directory.

To set a different port on first launch:

```sh
PORT=4000 npm run pm2:start
```

For an existing process, use `PORT=4000 npm run pm2:restart`. To remove this process from PM2, run `npx pm2 delete unstoppable`. Host startup registration is not enabled by this project.

## Check

```sh
npm test
```

The test starts a server on a temporary port and checks the page, assets, health response, and unavailable paths. `GET /api/health` returns the real process status and uptime. The footer uses this endpoint; the fault simulator and product SLA are fiction.

Browser checks: switch all three SLA values; run and reset each fault simulation; open a plan dialog and close it with Escape; check the server status; open the FAQ; view the page at mobile and desktop widths. Reduced motion and keyboard navigation are supported.

## Edit

- `public/index.html`: content and page structure.
- `public/style.css`: responsive design.
- `public/app.js`: SLA comparison, fault simulation, and dialogs.
- `public/mascot.svg`: original server illustration.
- `server.js`: Express server and health route.
- `ecosystem.config.js`: PM2 configuration.

Company names are used for parody, with no affiliation or endorsement. There is no actual SLA. The art direction takes cues from [Database Detective](https://store.steampowered.com/app/3950130/Database_Detective_Minor_Crimes_Division/) and early PostHog. Bricolage Grotesque and DM Sans are distributed under the SIL Open Font License; license files are in `public/fonts`.

Setup references: [Express static files](https://expressjs.com/en/starter/static-files/) and [PM2 ecosystem configuration](https://pm2.keymetrics.io/docs/usage/application-declaration/).
