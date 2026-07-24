# House Countdown

A single-page countdown to the day I move in with her. One number, held in the
middle of a dusk sky, stepping down through days, hours, minutes and seconds.

- `J-42` while more than a day is left
- `H-13` inside the last day
- `M-47` inside the last hour
- `S-30` inside the last minute
- `JOUR J` once we live together

The trip has two dates, so the counter has two legs. It counts to the landing
first. The moment that passes, it retargets itself at the move-in date and the
wording changes with it; after that it settles into the arrival state. The step
markers at the bottom show both dates and which leg is running.

Above the counter, a line runs from where I am to where I am going. It fills
with the share of the wait already served, and a light rides the filled part.

Built with Vite, React and TypeScript. No backend, no data leaves the browser.

## Configure it

Every string and date lives in [`src/config.ts`](src/config.ts). Edit that file,
or set the matching `VITE_*` environment variables to change the countdown
without touching code — see [`.env.example`](.env.example).

| Variable | What it sets |
| --- | --- |
| `VITE_ARRIVES_AT` | Landing moment, ISO 8601 with an explicit offset |
| `VITE_MOVES_IN_AT` | Move-in moment, same format |
| `VITE_WAIT_STARTED_AT` | Where the journey line starts |
| `VITE_FROM_CITY` / `VITE_TO_CITY` | The two ends of the line on leg one |
| `VITE_HOME_LABEL` | Where leg two leads, e.g. `our place` |
| `VITE_EYEBROW` / `VITE_MESSAGE` | Wording on leg one, before landing |
| `VITE_SETTLING_EYEBROW` / `VITE_SETTLING_MESSAGE` | Wording on leg two, landed but not moved in |
| `VITE_ARRIVED_MESSAGE` | Line shown once you live together |
| `VITE_ARRIVAL_STEP` / `VITE_MOVE_IN_STEP` | Names on the two step markers |
| `VITE_LOCALE` | Locale for the dates, e.g. `fr-FR` |
| `VITE_TIME_ZONE` | Time zone the dates are shown in |

Values are read at build time, so changing one means a rebuild or redeploy.
The countdown itself runs against the visitor's clock, so it reads correctly
from either city.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # writes dist/
npm run preview  # serves dist/ on http://localhost:4173
```

## Deploy on Vercel

Import the repository and accept the detected settings — [`vercel.json`](vercel.json)
already pins the Vite framework, the `dist` output and the SPA rewrite. Add the
`VITE_*` variables under Settings → Environment Variables, then redeploy.

```bash
npx vercel --prod
```

## Deploy on your VPS with Docker

The image builds the site and serves the static files with nginx on port 80.

```bash
docker compose up -d --build   # http://your-vps:8080
```

Or without compose:

```bash
docker build -t house-countdown \
  --build-arg VITE_ARRIVES_AT="2026-09-12T18:00:00+02:00" \
  --build-arg VITE_TO_CITY="Nantes" .

docker run -d --name house-countdown -p 8080:80 --restart unless-stopped house-countdown
```

Put it behind your existing reverse proxy for TLS and a real hostname. Because
the config is baked in at build time, changing a date means rebuilding the
image — `docker compose up -d --build` does both in one step.
