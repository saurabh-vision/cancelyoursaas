# Contributing to cancel-your-saas

Thank you for helping people break free from runaway SaaS subscriptions!

## How to Suggest an Alternative

All tool definitions live in a single source of truth: [`data/tools.yaml`](data/tools.yaml).

### Schema Guidelines

When adding a tool, please respect the schema:

| Field | Type | Description |
| :--- | :--- | :--- |
| `saas_name` | string | Name of the proprietary tool being replaced |
| `saas_price_per_user_month` | float | Typical baseline monthly price per seat (USD) |
| `alternative_name` | string | Name of the open-source alternative |
| `alternative_url` | string | Main website or repository |
| `license` | string | OSI-approved license or source-available license |
| `self_host` | boolean | `true` if free self-hosting is supported |
| `cloud_option_url` | string | (Optional) Managed hosted service link |
| `cloud_price` | string | (Optional) Price of the managed cloud tier |
| `difficulty` | string | `easy`, `medium`, or `hard` |
| `what_youll_miss` | string | Honest, pragmatic summary of trade-offs |
| `category` | string | Logical classification for the tool |

### The "Honest Trade-offs" Rule

We love open source, but self-hosting or switching tools isn't free of quirks. Always provide an honest summary in `what_youll_miss` (e.g., missing integrations, maintenance overhead, UI polish differences).

