# Contributing to cancel-your-saas 💸

Thank you for helping teams and creators break free from SaaS subscription fatigue!

This repository tracks high-quality open-source alternatives to expensive proprietary SaaS tools, along with calculated financial savings and—crucially—**brutally honest trade-offs**.

---

## 🧭 The Three Core Rules

Before submitting a new tool or updating an existing one, please ensure your contribution adheres to these standards:

1. **The "Honest Trade-offs" Rule**: Open source is powerful, but self-hosting or migrating is rarely a free lunch. We do not do marketing puffery. Your `what_youll_miss` description must highlight real, concrete differences (e.g. missing managed push notifications, lack of pre-configured 3rd-party SaaS connectors, ClickHouse database administration overhead, absence of enterprise SOC2 guarantees).
2. **Verified Public Pricing**: `saas_price_per_user_month` must reflect current, publicly listed month-to-month list pricing in USD. If a SaaS tool charges annually, calculate or verify their standard uncommitted monthly baseline.
3. **Actively Maintained Open Source**: We only index active, production-ready projects with OSI-approved licenses (or recognized source-available licenses like Sustainable Use or BSL). Abandoned repositories will be rejected or archived.

---

## 🛠️ The Data Schema

All catalog data lives exclusively in [`data/tools.yaml`](data/tools.yaml). Each entry must strictly adhere to this schema:

| Field | Type | Required | Description |
| :--- | :---: | :---: | :--- |
| `saas_name` | `string` | **Yes** | Name of the proprietary SaaS tool being replaced (e.g. `"Slack"`) |
| `saas_price_per_user_month` | `float` | **Yes** | Baseline list price per user/month in USD (e.g. `8.75`). Use `0.00` if free. |
| `alternative_name` | `string` | **Yes** | Name of the open-source alternative (e.g. `"Mattermost"`) |
| `alternative_url` | `string` | **Yes** | Official homepage or repository link (no affiliate/tracking links) |
| `license` | `string` | **Yes** | SPDX license identifier or recognized source license (e.g. `"AGPL-3.0"`, `"Apache-2.0"`, `"MIT"`) |
| `self_host` | `boolean` | **Yes** | `true` if it can be self-hosted without paid license barriers |
| `cloud_option_url` | `string` | *Optional* | Official managed cloud hosting pricing/signup page |
| `cloud_price` | `string` | *Optional* | Human-readable cloud pricing string (e.g. `"$10/user/month"`) |
| `difficulty` | `string` | **Yes** | Self-hosting/setup complexity: `easy`, `medium`, or `hard` |
| `what_youll_miss` | `string` | **Yes** | Objective, specific trade-offs and missing convenience features |
| `category` | `string` | **Yes** | One of the 10 standard categories listed below |

### Allowed Categories

- `Communication`
- `Project Management`
- `Developer Tools`
- `Analytics`
- `Design & Creative`
- `Security & Passwords`
- `Automation`
- `Customer Support`
- `Forms & Surveys`
- `Documentation`

---

## 🚀 Development Workflow

### 1. Clone & Set Up

```bash
git clone https://github.com/saurabh-vision/cancelyoursaas.git
cd cancelyoursaas
pip install pyyaml
```

### 2. Make Your Edit

Add or edit your entry directly in `data/tools.yaml`.

### 3. Validate & Regenerate Documentation

Always run the builder script before submitting a pull request:

```bash
python scripts/build_readme.py
```

This script:
- Validates that your entry matches the YAML schema and valid categories.
- Exports `docs/tools.json`.
- Injects updated tables, statistics, and savings calculations into `README.md` and `docs/index.html`.

### 4. Commit & Submit Pull Request

```bash
git checkout -b suggest-my-alternative
git commit -am "feat: add AlternativeName as replacement for SaaSName"
git push origin suggest-my-alternative
```

---

## 🚫 Affiliate Links Policy

We maintain a strict zero-affiliate-link policy. Any pull request containing referral parameters, shortened affiliate URLs, or sponsored placement will be closed immediately.
