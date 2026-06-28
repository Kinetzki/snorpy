# Snorpy

**An open-source, desktop web security testing suite — early, hackable, and built for pentesters and web devs.**

Snorpy is a cross-platform MITM proxy toolkit in active development. It runs locally as an Electron app, intercepts HTTP(S) traffic, and ships the core workflows you know from Burp Suite — proxy, Repeater, Intruder, and traffic logging — on a modern React/TypeScript stack you can actually fork and extend.

> **Status:** Early development — not a full Burp replacement yet. **Proxy, Repeater, and Intruder work today.** Spider, Decoder, Comparer, and more are planned — see [What's next](#whats-next).
>
> **Looking for testers and contributors.** Try it against a lab app (DVWA, Juice Shop, etc.), [open an issue](https://github.com/Kinetzki/snorpy/issues) with feedback, or pick something from [Good first issues](#good-first-issues) below.

[![GitHub stars](https://img.shields.io/github/stars/Kinetzki/snorpy?style=flat&logo=github)](https://github.com/Kinetzki/snorpy/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Kinetzki/snorpy?style=flat&logo=github)](https://github.com/Kinetzki/snorpy/network/members)
[![GitHub issues](https://img.shields.io/github/issues/Kinetzki/snorpy?style=flat&logo=github)](https://github.com/Kinetzki/snorpy/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/Kinetzki/snorpy?style=flat&logo=github)](https://github.com/Kinetzki/snorpy/pulls)
[![Last commit](https://img.shields.io/github/last-commit/Kinetzki/snorpy?style=flat&logo=github)](https://github.com/Kinetzki/snorpy/commits/main)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

[![Electron](https://img.shields.io/badge/Electron-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![mockttp](https://img.shields.io/badge/mockttp-MITM_proxy-FF6B35)](https://github.com/httptoolkit/mockttp)

[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)](https://www.electronjs.org/)
[![Status](https://img.shields.io/badge/status-early%20development-orange)](https://github.com/Kinetzki/snorpy)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Kinetzki/snorpy/pulls)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-blue.svg)](https://github.com/Kinetzki/snorpy/issues)

---

## Screenshots

### Proxy — target scoping

Scope traffic to specific domains and browse captured hosts from the sidebar.

<img src="docs/screenshots/proxy-target-screenshot.png" alt="Proxy target view with domain list and target scope configuration" width="900" />

### Proxy — traffic logs

Inspect intercepted requests with method, status, length, destination, and path at a glance.

<img src="docs/screenshots/proxy-logs-screenshot.png" alt="Proxy logs table showing intercepted HTTP traffic" width="900" />

### Repeater

Edit headers and body, resend requests, and compare responses side-by-side.

<img src="docs/screenshots/repeater-tool-screenshot.png" alt="Repeater tool with editable request and response viewers" width="900" />

### Intruder

Mark payload positions in requests, load wordlists, tune concurrency, and review fuzz results.

<img src="docs/screenshots/intruder-tool-screenshot.png" alt="Intruder tool with request editor, payload settings, and wordlist configuration" width="900" />

---

## Why Snorpy?

| | Burp / commercial suites | Snorpy (today) |
|---|---|---|
| **Cost** | Paid licenses | Free & open source (Apache 2.0) |
| **Stack** | Closed, JVM-based | Electron + React + TypeScript — familiar to web devs |
| **Extensibility** | Limited without extensions API | Fork it, ship a feature, open a PR |
| **UI** | Dated | Modern dark UI with Monaco editor, Tailwind, shadcn/ui |
| **Maturity** | Production-ready | Early — core tools work, roadmap is open |

Whether you pentest web apps or build full-stack software, there's room to help — fuzzing modes, a decoder tab, proxy edge cases you've hit in the wild, or just bug reports from real use.

---

## Features

### Working today

#### Proxy

- **HTTP(S) intercepting proxy** powered by [mockttp](https://github.com/httptoolkit/mockttp), default port `8080`
- **Automatic CA certificate** generation and download for trusting HTTPS traffic
- **Target scoping** — filter by domain (`example.com`, `*.example.com`, or `*`)
- **Request interception** — hold, inspect, modify, forward, or drop in-flight requests
- **Traffic history** — browse captured requests and responses with syntax-highlighted viewers

#### Repeater

- Send a captured request to Repeater and tweak headers, body, and URL
- Live response viewer with status-code styling
- Ideal for manual parameter tampering, auth bypass attempts, and quick PoCs

#### Intruder

- **Payload fuzzing** with `§placeholder§` markers in URL, headers, or body
- Import payloads from `.txt` wordlists or add them one-by-one
- **Configurable concurrency** for rate-controlled attacks
- Results table with status, length, and timing — stop/resume supported

### Coming soon

The sidebar already sketches the roadmap: **Spider**, **Decoder**, **Comparer**, **Buster**, **AI Analyzer**, reporting (site map, log export), and settings. These are the best places to start if you want to contribute.

---

## Quick start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm (comes with Node)

### Run from source

```bash
git clone https://github.com/Kinetzki/snorpy.git
cd snorpy
npm install
npm run dev
```

This starts the Vite dev server and launches the Electron app with hot reload.

### Use the proxy

1. Open the **Proxy** tab and turn the proxy **on** (toggle in the top bar).
2. Set your browser or tool to use `127.0.0.1` and the port shown (default **8080**).
3. Browse traffic under **Logs**, intercept under **Interceptor**, and send interesting requests to **Repeater** or **Intruder**.

> HTTPS traffic will fail or show certificate errors until you install Snorpy's CA certificate — follow the steps below.

### Install the SSL certificate

Snorpy generates a local CA to decrypt HTTPS. You must trust it before intercepted TLS traffic will load correctly.

1. In the **Proxy** tab, start the proxy if it is not already running.
2. Click the **SSL Certificate** download button in the top bar (next to the label **SSL Certificate**).
3. Save the file — it downloads as `snorpy.crt`.
4. Install `snorpy.crt` as a **trusted root CA** on your system or browser (steps vary by platform):

#### Windows

1. Double-click `snorpy.crt` → **Install Certificate**.
2. Choose **Local Machine** (admin) or **Current User**.
3. Select **Place all certificates in the following store** → **Browse** → **Trusted Root Certification Authorities** → OK.
4. Finish the wizard and confirm the security prompt.
5. Restart your browser.

#### macOS

1. Double-click `snorpy.crt` to open **Keychain Access** (or drag the file into the **System** or **login** keychain).
2. Find the Snorpy / mockttp CA entry, double-click it.
3. Expand **Trust** → set **When using this certificate** to **Always Trust**.
4. Close the dialog and enter your password if prompted.
5. Restart your browser.

#### Linux

**Debian / Ubuntu**

```bash
sudo cp snorpy.crt /usr/local/share/ca-certificates/snorpy.crt
sudo update-ca-certificates
```

**Fedora / RHEL**

```bash
sudo cp snorpy.crt /etc/pki/ca-trust/source/anchors/snorpy.crt
sudo update-ca-trust
```

Restart your browser after installing.

#### Firefox

Firefox uses its own certificate store by default:

1. **Settings** → **Privacy & Security** → **Certificates** → **View Certificates**.
2. **Authorities** tab → **Import** → select `snorpy.crt`.
3. Check **Trust this CA to identify websites** → OK.
4. Restart Firefox.

#### Verify

With the proxy running and the cert installed, visit an HTTPS site. You should see the request appear in **Proxy → Logs** without browser certificate warnings.

### Build a distributable

```bash
npm run build
```

---

## Tech stack

| Layer | Tools |
|---|---|
| Desktop shell | [Electron](https://www.electronjs.org/) |
| UI | [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS 4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) |
| State | [Zustand](https://zustand.docs.pmnd.rs/) |
| Editor | [Monaco Editor](https://microsoft.github.io/monaco-editor/) |
| Proxy engine | [mockttp](https://github.com/httptoolkit/mockttp) |
| HTTP client (Repeater / Intruder) | [axios](https://axios-http.com/) |
| Build | [Vite](https://vitejs.dev/) + [vite-plugin-electron](https://github.com/electron-vite/vite-plugin-electron) |

---

## Project structure

```
snorpy/
├── electron/           # Main process — proxy, certs, repeater, intruder
│   ├── main.ts
│   ├── proxy-manager.ts
│   ├── cert-manager.ts
│   ├── repeater.ts
│   └── intruder.ts
├── src/
│   ├── components/
│   │   ├── proxy/      # Target, Interceptor, Logs, controls
│   │   ├── tools/      # Repeater, Intruder
│   │   └── log/        # Request/response viewers
│   ├── stores/         # Zustand stores (App, Proxy, Repeater, Intruder)
│   └── interfaces/     # Shared TypeScript types
└── public/
```

**IPC boundary:** The renderer talks to the main process through `window.snorpy` (defined in `electron/preload.ts`). Proxy events flow in; Repeater/Intruder commands flow out.

---

## Contributing

This project is in soft launch — feedback from real use matters as much as code. Bug reports, feature PRs, docs, and UX polish all help.

1. **Try it** — run against a lab target and note what breaks or feels rough
2. **Discuss** — [open an issue](https://github.com/Kinetzki/snorpy/issues) before large changes
3. **Ship** — fork, branch, keep PRs focused, run `npm run lint`, open a PR against `main`

### Good first issues

- **Decoder tab** — base64, URL encode/decode, hex, JWT parse
- **Comparer** — diff two responses side-by-side
- **Spider** — crawl in-scope links from proxy history
- **Export logs** — HAR or JSON export from the Logs view
- **Proxy edge cases** — WebSocket support, chunked encoding, malformed headers
- **Intruder modes** — pitchfork, cluster bomb, grep/match rules on responses
- **Tests** — unit tests for `electron/parser.ts`, placeholder substitution in Intruder

### Development workflow

1. Fork the repo and create a branch: `git checkout -b feat/my-feature`
2. Make your changes — one feature or fix per PR
3. Run `npm run lint` before opening the PR
4. Open a PR against `main` with a short description of **what** changed and **why**

### Code conventions

- Match existing patterns: functional React components, Zustand for state, TypeScript interfaces in `src/interfaces/`
- Main-process logic stays in `electron/`; UI stays in `src/`
- Prefer small, readable diffs over large refactors unless discussed in an issue first

Don't see your idea on the list? [Open an issue](https://github.com/Kinetzki/snorpy/issues) to discuss it before investing a lot of time.

---

## What's next

High-level roadmap (not set in stone — community input welcome):

- [ ] Spider / site map crawler
- [ ] Decoder & Comparer utilities
- [ ] Content discovery (Buster)
- [ ] Response analysis helpers (grep, extract, match rules)
- [ ] HAR import/export
- [ ] Project & scope persistence
- [ ] Plugin or extension hook (TBD)

**Star** the repo to follow along, **watch Releases** for packaged builds, and open an issue if you try Snorpy — even a short "worked / didn't work on X" report helps.

---

## Legal & ethical use

Snorpy is intended for **authorized security testing only**. Only intercept and attack systems you own or have explicit written permission to test. The authors and contributors are not responsible for misuse.

---

## License

[Apache License 2.0](LICENSE)
