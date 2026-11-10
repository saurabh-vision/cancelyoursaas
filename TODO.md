# Project Roadmap & Verification Notes

## Verification Status

All 46 current entries in [`data/tools.yaml`](data/tools.yaml) have had their baseline SaaS public pricing and open-source licenses verified via current official documentation and GitHub repositories.

### Verified Licensing & Pricing Highlights

| SaaS Tool | Verified Baseline Price | Alternative | Verified License | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Slack** | $8.75/user/mo (monthly) | Mattermost | `AGPL-3.0` | Mattermost Team Edition is AGPL-3.0; enterprise features require commercial license. |
| **Zoom** | $16.99/user/mo (monthly) | Jitsi Meet | `Apache-2.0` | Jitsi codebase is Apache 2.0; managed cloud via 8x8 JaaS. |
| **Calendly** | $12.00/user/mo (monthly) | Cal.com | `AGPL-3.0` | Cal.com core is AGPL-3.0; free tier available on Cal.com cloud. |
| **Discord** | $9.99/mo (Nitro) | Revolt | `AGPL-3.0` | Revolt backend is AGPL-3.0; completely community-run. |
| **Jira** | $8.50/user/mo | Plane | `AGPL-3.0` | Community edition is AGPL-3.0; commercial Pro/Business tiers are separate forks. |
| **Trello** | $6.00/user/mo (Standard) | WeKan | `MIT` | Fully permissive MIT license. |
| **Asana** | $13.49/user/mo (Starter) | Vikunja | `AGPL-3.0` | Core is AGPL-3.0; Vikunja Pro provides add-on admin panel. |
| **Monday.com** | $14.00/user/mo (Standard) | Taiga | `MPL-2.0` | Core Taiga backend & frontend use Mozilla Public License 2.0. |
| **Linear** | $10.00/user/mo (Standard) | Leantime | `AGPL-3.0` | Core is AGPL-3.0; plugins may carry distinct commercial terms. |
| **GitHub** | $4.00/user/mo (Team) | Gitea | `MIT` | Gitea core is MIT. |
| **Postman** | $19.00/user/mo (Basic) | Bruno | `MIT` | Core API client is MIT; Golden Edition carries commercial license. |
| **Vercel** | $20.00/user/mo (Pro) | Coolify | `Apache-2.0` | Self-hosted engine is Apache-2.0. |
| **Datadog** | $15.00/host/mo (Infra Pro) | SigNoz | `Apache-2.0` | Open-source core is Apache-2.0. |
| **Sentry** | $29.00/mo (Team) | GlitchTip | `MIT` | GlitchTip backend and frontend are MIT. |
| **Firebase** | $25.00/mo (Blaze baseline) | Supabase | `Apache-2.0` | Open-source core tools are Apache-2.0. |
| **Docker Desktop** | $5.00/user/mo (Pro) | Podman Desktop | `Apache-2.0` | Permissive Apache-2.0 sponsored by Red Hat. |
| **Google Analytics** | Free ($0.00) | Plausible Analytics | `AGPL-3.0` | Lightweight privacy-focused AGPL-3.0 analytics. |
| **Mixpanel** | $24.00/mo (Growth) | PostHog | `MIT` | Core platform is MIT (enterprise features under `ee/` directory). |
| **Hotjar** | $49.00/mo (Growth) | Matomo | `GPL-3.0-or-later` | Matomo On-Premise is GPL-3.0. |
| **Segment** | $120.00/mo (Team) | Jitsu | `MIT` | Core event collection engine is MIT. |
| **Figma** | $15.00/user/mo (Pro) | Penpot | `MPL-2.0` | Weak copyleft MPL-2.0. |
| **Loom** | $15.00/creator/mo | Cap | `AGPL-3.0` | AGPL-3.0 with MIT camera/screen capture crates. |
| **Miro** | $10.00/user/mo (Starter) | Excalidraw | `MIT` | Fully permissive MIT license. |
| **Adobe Illustrator**| $22.99/mo | Inkscape | `GPL-3.0-or-later`| GPL-3.0 vector graphics suite. |
| **Adobe Premiere Pro**| $22.99/mo | Kdenlive | `GPL-3.0-or-later`| KDE non-linear video editor. |
| **1Password** | $7.99/user/mo (Business) | Vaultwarden | `GPL-3.0` | Rust server compatible with Bitwarden clients. |
| **Auth0** | $35.00/mo (B2C Essentials) | authentik | `MIT` | Core platform is MIT. |
| **Cloudflare Access**| $7.00/user/mo | NetBird | `AGPL-3.0` | Control plane/dashboard is AGPL-3.0; clients are BSD-3. |
| **HashiCorp Vault** | $45.00/mo (Dev Cluster) | OpenBao | `MPL-2.0` | Linux Foundation community fork of Vault under MPL-2.0. |
| **Zapier** | $29.99/mo (Starter) | n8n | `Sustainable Use` | Fair-code Sustainable Use License. |
| **Make** | $10.59/mo (Core) | Activepieces | `MIT` | Permissive MIT license for Community Edition. |
| **Retool** | $12.00/user/mo (Team) | Appsmith | `Apache-2.0` | Community Edition is Apache-2.0. |
| **Airtable** | $24.00/user/mo (Team) | NocoDB | `AGPL-3.0` | Connects directly to PostgreSQL/MySQL. |
| **Intercom** | $39.00/user/mo | Chatwoot | `AGPL-3.0` | Community Edition is AGPL-3.0. |
| **Zendesk** | $69.00/agent/mo (Suite Team) | FreeScout | `AGPL-3.0` | Core is AGPL-3.0 with optional paid one-time module add-ons. |
| **Help Scout** | $25.00/user/mo (Standard) | Papercups | `MIT` | Permissive MIT customer chat suite. |
| **Crisp** | $25.00/mo (Pro) | Chaskiq | `GPL-3.0` | Full conversational marketing platform. |
| **Typeform** | $29.00/mo (Basic) | Formbricks | `AGPL-3.0` | Core is AGPL-3.0; client packages are MIT. |
| **SurveyMonkey** | $25.00/user/mo (Advantage) | LimeSurvey | `GPL-2.0-or-later`| Robust GPL-2.0 academic & enterprise survey suite. |
| **Jotform** | $39.00/mo (Bronze) | HeyForm | `AGPL-3.0` | Node.js drag-and-drop form builder under AGPL-3.0. |
| **Google Forms** | $6.00/user/mo (Workspace) | OhMyForm | `AGPL-3.0` | Free open-source alternative to Google Forms. |
| **Notion** | $10.00/user/mo (Plus) | AppFlowy | `AGPL-3.0` | Flutter & Rust local-first workspace under AGPL-3.0. |
| **Confluence** | $6.05/user/mo (Standard) | BookStack | `MIT` | Opinionated book/chapter/page hierarchy under MIT. |
| **GitBook** | $8.00/user/mo (Plus) | Docusaurus | `MIT` | React-based static documentation generator by Meta. |
| **Slite** | $10.00/user/mo (Standard) | Wiki.js | `AGPL-3.0` | Markdown and WYSIWYG wiki under AGPL-3.0. |
| **DocuSign** | $15.00/mo (Personal) | Documenso | `AGPL-3.0` | The open-source DocuSign alternative. |

## Candidate Backlog for Future Expansion

The following tools are candidates for future batch additions once community reviews verify self-host ergonomics:
- [ ] **Mailchimp** -> Listmonk (AGPL-3.0)
- [ ] **Bitwarden Business** -> Passbolt (AGPL-3.0)
- [ ] **Canva** -> Polotno / Penpot
- [ ] **Loom** -> Screenity (GPL-3.0)
- [ ] **Datadog APM** -> OpenTelemetry Collector / Jaeger
- [ ] **Coda** -> AFFiNE (MIT/EE)
