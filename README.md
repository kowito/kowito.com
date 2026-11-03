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
| `/` | Homepage — intro, the Safe wallet and other tools on the site, open source highlights, tech stack, contact |
| `/personal-training` | Machine-only Mon–Wed–Fri workout plan with coaching cues |
| `/diet` | Thai street food meal plan with 7-day schedule |
| `/books` | Bookshelf — every book on the shelf in order, with covers, grouped by topic, with store links |
| `/apple-prices` | Apple price check — pick a MacBook Pro, Mac mini or iPhone configuration and compare Apple's prices in Japan, Singapore, Hong Kong, Taiwan and China with Thailand, in baht |
| `/opensource` | Open source work overview (Chopin, kowito-json, Monoio drivers) |
| `/opensource/chopin` | Chopin async Rust framework project page |
| `/safe` | Safe multisig wallet: open a Safe, see balances, send, approve and complete transactions, manage owners |

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

## Apple prices

`/apple-prices` reads `app/apple-prices/prices.json`. Refresh it from Apple's online stores with:

```bash
pnpm prices
```

Exchange rates, tax refunds and country notes live in `app/apple-prices/data.ts` and are updated by hand.

## Safe

`/safe` is a whole Safe{Wallet}-style app on one static page. The Safe and the tab live in the query string, e.g. `/safe?safe=eth:0x…&tab=activity`.

- **Links:** the network prefixes are the ones Safe{Wallet} uses (`eth`, `base`, `arb1`, `oeth`, `matic`, `bnb`, `sep`), so links work in both apps; `pol:` and `bsc:` are accepted too. A bare `/safe?safe=0x…` looks the Safe up on every network, and the address box takes whole Safe{Wallet} links.
- **Code:** UI in `app/safe/_components`, hooks in `app/safe/_hooks`, Safe logic in `lib/safe`. Wallets and data providers load only on this page.
- **Safe Transaction Service:** production requests go through the Cloudflare Pages Function in `functions/api/safe-tx`, which adds the API key. Set `SAFE_API_KEY` (from [developer.safe.global](https://developer.safe.global)) under Pages → Settings → Variables and Secrets. Without it, Safe rate-limits requests.
- **Local development:** `pnpm dev` doesn't run Pages Functions, so it calls Safe directly without a key. To test the function, run `pnpm build` and then `npx wrangler pages dev out`.
- **RPCs:** each network lists keyless public RPCs that allow browser requests, tried in order, so a rate-limited one hands over to the next. `NEXT_PUBLIC_RPC_<chainId>` (optional, at build time) puts your own RPC first.
- **Optional build variables:** `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` (adds WalletConnect for mobile wallets) and the `NEXT_PUBLIC_RPC_<chainId>` above.
- **Networks:** Ethereum, Base, Arbitrum, Optimism, Polygon, BNB Smart Chain and Sepolia. To add one, update both `lib/safe/chains.ts` and the `SLUGS` map in the function; `pnpm test` fails if they disagree.
- **Tests:** `pnpm test` checks that transaction hashes match Safe's own SDK for Safe versions 1.0.0–1.5.0, that signatures are encoded the way the Safe accepted them on-chain, link parsing, and the Pages Function.

## Lint

```bash
pnpm lint
```

## Contact

hi@kowito.com
