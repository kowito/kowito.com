# kowito.com

Personal portfolio site for Kowit C. — Digital Craftsman.

## Stack

- **Framework**: Next.js 15 (App Router, static export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: shadcn/ui
- **Icons**: lucide-react
- **Package Manager**: pnpm

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — intro, open source highlights, tech stack, contact |
| `/personal-training` | Machine-only Mon–Wed–Fri workout plan with coaching cues |
| `/diet` | Thai street food meal plan with 7-day schedule |
| `/opensource` | Open source work overview (Chopin, kowito-json, Monoio drivers) |
| `/opensource/chopin` | Chopin async Rust framework project page |

## Local Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
pnpm build
```

Outputs a fully static site to `out/`.

## Lint

```bash
pnpm lint
```

## Contact

hi@kowito.com
