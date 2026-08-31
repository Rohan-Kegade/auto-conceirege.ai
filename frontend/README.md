# AutoConcierge.ai — frontend

Vite + React + TypeScript + Tailwind CSS v4.

Implements the `Brochure Research.dc.html` design (Claude Design project
_Car Research AI Chatbot_) as three screens:

| Route                  | Screen  | Status      |
| ---------------------- | ------- | ----------- |
| `/`                    | Landing | scaffolded  |
| `/login`, `/register`  | Auth    | scaffolded  |
| `/app`                 | Chat    | scaffolded  |
| `/app/profile`         | Profile | scaffolded  |
| `/app/settings`        | Settings | scaffolded  |

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production bundle
```

## Design tokens

The design's fixed palette and type ramp live in `src/index.css` under
`@theme` (Tailwind v4). Use the semantic names (`bg-canvas`, `text-ink`,
`border-line`, `text-accent`, …) rather than raw hex/oklch values.
