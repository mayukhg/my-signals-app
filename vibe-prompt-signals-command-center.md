# Vibe Coding Prompt — Agentic Strategic Command Center (Signals App)

Paste this whole prompt into Lovable (or any AI builder) to scaffold the UI **and** wire it to a real backend.

---

## 🎯 Product One-Liner

Build an **Agentic Strategic Command Center** that runs an OODA loop (Observe → Orient → Decide → Act) across four AI agents — **Scout, Analyst, Architect, Sentinel** — to turn external signals into a re-ranked product roadmap, vetted prototypes, and an immutable audit trail. Domains: **Health-Tech, Cybersecurity, Custom JSON**.

---

## 🧠 Mental Model (must be visible in the UI)

| Stage | Agent | Page | Job |
|---|---|---|---|
| Observe | **Scout** | `/signals` | Ingest + triage external signals |
| Orient | **Analyst** | `/roadmap` | Re-rank roadmap from signal weights |
| Decide | **Architect** | `/prototypes` | Draft prototypes for promoted items |
| Act | **Sentinel** | `/audits` | Gate artifacts on security / faithfulness / protocol; emit audit events |

The **OODA rail** is always pinned in the top bar with the active stage highlighted based on the current route.

---

## 🎨 Design System (non-negotiable)

- **Dark-first**, calm "ops dashboard" aesthetic. Avoid generic purple-on-white SaaS.
- Semantic tokens in `src/styles.css` using `oklch()`. **No raw color classes in components.**
- Reserve **one accent color** (`--action`, amber) exclusively for Decide/Act buttons. Everything else is neutral + status colors.
- Stage colors: `--observe` (cyan), `--orient` (violet), `--decide` (amber), `--act` (emerald).
- Status taxonomy used everywhere: `critical / high / medium / low` and `pass / warn / fail`.
- Typography: distinctive display font for labels/numerics (e.g. JetBrains Mono or Space Grotesk), Inter for body. No Poppins.
- Density: information-dense like Linear / Datadog, not marketing-spacious.

---

## 🧱 Information Architecture

- **Left sidebar**: Signals · Roadmap · Prototypes · Audits · Config
- **Top bar**: SidebarTrigger · Domain pill (Health-Tech / Cybersecurity / Custom JSON) · OODA rail · Search (`⌘K`) · **Work / Demo** mode toggle
- **Right contextual rail** on each page (signal weights, roadmap reasoning, sentinel scorecard)
- **Onboarding `/`**: "Choose your domain" with 3 cards + sample data preview

---

## 📄 Pages — exact behavior

### 1. `/` Onboarding
Three domain cards (Health-Tech, Cybersecurity, Custom JSON). Selecting one sets global `domain` state and routes to `/signals`. Custom JSON opens an upload + paste panel.

### 2. `/signals` — Scout (Observe)
- **Inbox-style triage list**: severity dot · agent · title · source · freshness · weight bar.
- One-key actions: `E` escalate, `S` snooze, `A` acknowledge, `→` open trace.
- Right rail = **Trace view**: signal → contributing weights (source authority, recency, corroboration, blast radius) → linked roadmap deltas → artifacts (PDFs, diffs).
- Filters: severity, source, agent, freshness window.

### 3. `/roadmap` — Analyst (Orient)
- **Re-ranking diff view**: each item shows `prevRank → newRank` with delta badge (+/-N), reason chip linking back to the signal id, and a pin/lock toggle.
- Undo timeline at the top: scrub through previous re-rankings.
- Right rail: weight breakdown for the selected item.

### 4. `/prototypes` — Architect (Decide)
- **Sentinel scorecard ring** (pass/warn/fail percentages) per prototype.
- Three categorized check groups: **Security**, **Clinical Faithfulness** (or Domain Faithfulness for non-health), **Doc Protocol**.
- Each check: name, status pill, detail, link to evidence.
- Primary action button uses `--action` color: "Promote" / "Block".

### 5. `/audits` — Sentinel (Act)
- Immutable event stream: timestamp · actor (agent or human) · action · target · diff link.
- Filter by actor and action type. Export to JSON.

### 6. `/config`
- Toggle each agent on/off, set thresholds (auto-promote weight, Sentinel block rules, digest time), manage data sources per domain.

---

## 🔁 Modes

- **Work Mode** (default): static, dense, keyboard-driven. No animations beyond hover.
- **Demo Mode**: cinematic time-sequenced playthrough — Scout pulses a new signal → Analyst re-ranks roadmap with animated delta → Architect drafts a prototype card → Sentinel runs checks with the ring filling. Single global toggle in top bar.

---

## 🗄️ Backend (Lovable Cloud)

Enable **Lovable Cloud**. Create these tables with RLS enabled. Use a separate `user_roles` table — never store roles on profiles.

```sql
-- Enums
create type app_role as enum ('admin', 'operator', 'viewer');
create type severity as enum ('critical','high','medium','low');
create type stage as enum ('observe','orient','decide','act');
create type check_status as enum ('pass','warn','fail');

-- Roles (separate table, security-definer has_role function)
create table user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique(user_id, role)
);

create table workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text not null check (domain in ('health-tech','cybersecurity','custom')),
  created_at timestamptz default now()
);

create table signals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  external_id text,
  title text not null,
  source text not null,
  agent text not null default 'Scout',
  severity severity not null,
  weight numeric(3,2) not null,
  summary text,
  artifacts jsonb default '[]'::jsonb,
  status text default 'open',           -- open | acknowledged | snoozed | escalated
  created_at timestamptz default now()
);

create table roadmap_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  title text not null,
  prev_rank int not null,
  new_rank int not null,
  reason text,
  reason_signal_id uuid references signals(id),
  pinned boolean default false,
  updated_at timestamptz default now()
);

create table prototypes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  roadmap_item_id uuid references roadmap_items(id),
  title text not null,
  status text default 'draft',          -- draft | promoted | blocked
  created_at timestamptz default now()
);

create table sentinel_checks (
  id uuid primary key default gen_random_uuid(),
  prototype_id uuid references prototypes(id) on delete cascade,
  category text not null,               -- Security | Clinical Faithfulness | Doc Protocol
  name text not null,
  status check_status not null,
  detail text
);

create table audit_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  actor text not null,                  -- agent name or user email
  action text not null,
  target text,
  payload jsonb,
  created_at timestamptz default now()
);
```

**RLS pattern**: every table — `using (workspace_id in (select workspace_id from workspace_members where user_id = auth.uid()))`. Mutations require `has_role(auth.uid(),'operator')` or `'admin'`.

### Server functions (TanStack Start `createServerFn`)

Place in `src/lib/*.functions.ts`:

- `listSignals({ workspaceId, filters })`
- `triageSignal({ id, action: 'ack'|'snooze'|'escalate' })`
- `rerankRoadmap({ workspaceId })` — recomputes ranks from open signals using weighted sum, writes deltas
- `pinRoadmapItem({ id, pinned })`
- `runSentinel({ prototypeId })` — populates `sentinel_checks`, emits an audit event
- `listAuditEvents({ workspaceId, filters })`
- `setAgentConfig({ agent, enabled, thresholds })`

Every mutation **must** insert an `audit_events` row inside the same transaction.

### Realtime
Subscribe the Signals page and Audits page to Supabase realtime on `signals` and `audit_events` so Demo Mode and live ops both stream updates.

### Auth
Supabase email/password + Google OAuth. Onboarding creates a workspace and assigns the user the `admin` role.

---

## ⌨️ Adoption accelerators (build these, don't skip)

- Empty states with a "Load sample data" button per domain.
- Global `⌘K` palette (cmdk) for navigation + actions.
- Keyboard shortcuts on `/signals` (`E S A J K →`).
- Shareable permalink for any signal/roadmap item/prototype (`?focus=ID`).
- 30-second guided tour overlay on first visit.

---

## ✅ Acceptance Criteria

1. Active OODA stage in the top bar matches the current route.
2. Triaging a signal updates `signals.status` **and** writes an `audit_events` row visible in `/audits` within 1s (realtime).
3. `rerankRoadmap` produces visible `prevRank → newRank` diffs with reason chips that deep-link back to the source signal.
4. Sentinel scorecard ring color reflects worst-status check; Promote button is disabled if any `fail` exists.
5. Switching domain swaps sample data and source list without a page reload.
6. Work Mode has zero non-hover animations; Demo Mode runs the full Scout→Sentinel sequence end-to-end.
7. RLS verified: a second user in another workspace sees zero rows.
8. Lighthouse a11y ≥ 95; all interactive elements keyboard reachable.

---

## 🚀 Build Order

1. Enable Lovable Cloud, run migrations, seed sample data per domain.
2. Auth + onboarding + workspace creation.
3. Shell: sidebar, top bar with OODA rail, domain pill, mode toggle.
4. `/signals` inbox + trace rail + realtime.
5. `/roadmap` diff view + rerank server fn.
6. `/prototypes` + Sentinel scorecard + `runSentinel`.
7. `/audits` stream + filters + export.
8. `/config` agent toggles + thresholds.
9. Demo Mode cinematic, ⌘K palette, keyboard shortcuts, guided tour.

Ship it.
