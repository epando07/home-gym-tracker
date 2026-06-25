# Home Gym Tracker

A fullstack web app for tracking home gym workouts across multiple members. Built as a teaching project — 2-3 sessions/week, ~1 hour each.

**Stack:** React + Vite (client) · Node.js + Express (server) · PostgreSQL · Playwright

---

## Teaching Plan

### Phase 1 — How the Existing Code Works (Sessions 1–4)

| # | Topic | Task |
|---|-------|------|
| 1 | How client and server are separated; what a port is; how HTTP request/response works | Run both servers locally, open the browser Network tab, explain what's happening |
| 2 | Read through `server/index.js` — what is Express, what are routes, what does `req`/`res` mean | Hit each working endpoint in Postman, read the responses |
| 3 | Read through `client/src/App.jsx` — what is a component, what is JSX, what does `useState` do | Change the boilerplate text, add a second counter, see the re-render |
| 4 | Git workflow: branches, commits, PRs | Create a branch, make a small change, open a PR, merge it |

### Phase 2 — First Real React UI: Member Cards (Sessions 5–8)

| # | Topic | Task |
|---|-------|------|
| 5 | What is a component? Break UI into pieces | Sketch the dashboard on paper, identify components (App, MemberCard, Dashboard) |
| 6 | Props — passing data into a component | Build a static `MemberCard` component that takes `name` as a prop |
| 7 | Mapping over an array to render a list | Render 4 hardcoded member cards from a JS array using `.map()` |
| 8 | Basic CSS — flexbox/grid for card layout | Style the dashboard so cards sit in a row |

### Phase 3 — Connecting Frontend to Backend (Sessions 9–11)

| # | Topic | Task |
|---|-------|------|
| 9 | What is `fetch()`? Why do we need it? | In the browser console, fetch `/api/members` manually and log the result |
| 10 | `useEffect` — when does it run, why do we use it for data fetching | Add a `useEffect` + `fetch` to `App.jsx`, store members in state, render them |
| 11 | Loading states and error handling | Add a loading spinner and a "something went wrong" message |

### Phase 4 — PostgreSQL: The Real Database (Sessions 12–16)

| # | Topic | Task |
|---|-------|------|
| 12 | Why can't we use arrays forever? (server restarts, data loss, relationships) | Restart the server, show data is gone. Motivate the database. |
| 13 | What is a relational database? Tables, rows, columns, primary keys | Draw the `members` table on paper. Run `psql` locally, create a test table by hand. |
| 14 | Write the schema — `members`, `equipment`, `exercises` tables as `.sql` files | Write `001_create_members.sql` together, run it, inspect in psql |
| 15 | Write remaining schema — `workouts`, `workout_exercises`, `sets` tables | Write `002_create_workouts.sql`, discuss foreign keys and why they exist |
| 16 | Seed data — insert the 4 members, equipment list, 30+ exercises | Write `seed.sql`, run it, verify with `SELECT *` queries |

### Phase 5 — Connecting Server to Database (Sessions 17–20)

| # | Topic | Task |
|---|-------|------|
| 17 | Install `pg`, set up a connection pool in `server/index.js` | Connect to local Postgres, test with a health check query |
| 18 | Rewrite `GET /api/members` and `POST /api/members` to use real SQL | Test both in Postman, verify data persists after server restart |
| 19 | Parameterized queries — why `$1` instead of string concatenation | Rewrite `GET /api/members/:id` with parameterized query |
| 20 | Rewrite remaining read endpoints (`/equipment`, `/exercises`) | Test each in Postman, add to Postman collection |

### Phase 6 — Workout Builder UI (Sessions 21–25)

| # | Topic | Task |
|---|-------|------|
| 21 | Client-side routing — how do we show different screens? | Install React Router, set up `/dashboard` and `/workout` routes |
| 22 | Build a workout screen with a static exercise card | Hardcode one exercise, show set rows with weight + reps inputs |
| 23 | Equipment selector per set | Add a `<select>` dropdown populated from `/api/equipment` |
| 24 | Add/remove sets dynamically | "Add set" button appends a row; trash icon removes one |
| 25 | Add/remove exercises; fetch exercise library from backend | Render full exercise list from `/api/exercises`, filter by muscle group |

### Phase 7 — Session Logging (Sessions 26–28)

| # | Topic | Task |
|---|-------|------|
| 26 | Design the log session API body — what data needs to go up? | Sketch the POST body on paper, then implement `POST /api/workouts/:id/log` with real SQL inserts |
| 27 | Wire up the frontend Log Session button | On click, build the request body from state, call fetch, handle success/error |
| 28 | Fetch and display previous weights (Prev column) | Implement `GET /api/members/:id/prev-sets/:exerciseId`, display next to each set row |

### Phase 8 — History View & Member Profile (Sessions 29–30)

| # | Topic | Task |
|---|-------|------|
| 29 | Session history view | Implement `GET /api/members/:id/history` with real SQL, render sessions in reverse chronological order expandable to set detail |
| 30 | Member profile screen — editable injury notes | Implement `PUT /api/members/:id`, wire up an editable text area in the UI |

### Phase 9 — Dashboard Intelligence (Sessions 31–34)

| # | Topic | Task |
|---|-------|------|
| 31 | Introduce the weighted set count SQL query | Walk through the query line by line in psql before touching the server |
| 32 | Implement `GET /api/members/:id/dashboard` with real heatmap data | Return weighted set counts per muscle group |
| 33 | Render the muscle heatmap in React using color interpolation (white → red) | Build the 8-muscle grid with inline styles based on the score |
| 34 | Alert banner: 4+ days without a muscle group | Add logic to the dashboard endpoint, render banner in UI |

### Phase 10 — Workout Generator (Sessions 35–36)

| # | Topic | Task |
|---|-------|------|
| 35 | Introduce the equipment-filter SQL query | Walk through `ANY($1::int[])` pattern in psql |
| 36 | Implement the generator endpoint + UI | Wire the "Generate Workout" button to `POST /api/workouts/generate` |

### Phase 11 — Testing with Playwright (Sessions 37–40)

| # | Topic | Task |
|---|-------|------|
| 37 | What is Playwright? Install it, run the example test | `npx playwright test`, watch it open a browser |
| 38 | Write the "Add member" test | Fill form, save, verify member card appears |
| 39 | Write "Log session" and "Previous weights" tests | Covers the most important data flow end to end |
| 40 | Write remaining tests | Swap exercise, member profile, heatmap update |

### Phase 12 — Deployment (Sessions 41–45)

| # | Topic | Task |
|---|-------|------|
| 41 | Provision a Linux VM (Ubuntu 22.04) | SSH in, walk around the OS |
| 42 | Install Node.js, PostgreSQL, nginx, pm2 on the VM | Run migrations and seed on the remote DB |
| 43 | Deploy backend: clone repo, install deps, start with pm2 | Verify API is reachable at the server's public IP |
| 44 | Deploy frontend: `npm run build`, serve with nginx, proxy `/api/*` to Express | Verify app loads in a browser via public IP |
| 45 | Write GitHub Actions workflow: run Playwright on every PR, deploy on merge to main | Store SSH key + server IP as GitHub secrets |

---

## Timeline

| Cadence | Estimate |
|---------|----------|
| 2 sessions/week | ~22 weeks (~5.5 months) |
| 3 sessions/week | ~15 weeks (~3.5 months) |
