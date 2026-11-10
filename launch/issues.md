# Good First Issue Ideas for Launch 🚀

These 5 issues are pre-formatted and ready to be opened in the GitHub repository right after launch. Each issue is designed to be accessible for first-time contributors with clear requirements and reproduction steps.

---

## Issue 1: Add Mailchimp → Listmonk alternative

- **Title**: `[Tool Suggestion]: Add Mailchimp → Listmonk`
- **Labels**: `good first issue`, `enhancement`, `documentation`
- **Description**:
  ### Overview
  Mailchimp's starter pricing has surged to over $20/month for modest subscriber lists. We want to add **Listmonk** as a curated self-hostable open-source alternative.

  ### Suggested Data:
  - **SaaS Name**: `Mailchimp`
  - **SaaS Monthly Price**: `20.00`
  - **Alternative Name**: `Listmonk`
  - **Alternative URL**: `https://listmonk.app`
  - **License**: `AGPL-3.0`
  - **Self-Host**: `true`
  - **Difficulty**: `medium`
  - **Category**: `Communication` (or `Marketing`)
  - **What You'll Miss**: `Managed SMTP deliverability reputation (you must bring AWS SES, Postmark, or SendGrid), drag-and-drop newsletter builder polish, and turnkey ecommerce purchase-trigger sequences.`

  ### How to Solve:
  1. Add this block to `data/tools.yaml`.
  2. Run `python scripts/build_readme.py` to regenerate `README.md` and `docs/tools.json`.
  3. Submit a PR!

---

## Issue 2: Add Passbolt as an alternative to 1Password / Dashlane

- **Title**: `[Tool Suggestion]: Add Dashlane / 1Password → Passbolt`
- **Labels**: `good first issue`, `enhancement`
- **Description**:
  ### Overview
  For team credential sharing and business password management, **Passbolt** is a battle-tested AGPL-3.0 password manager designed specifically for organizations and engineering teams.

  ### Proposed Details:
  - **SaaS Name**: `Dashlane (Business)`
  - **SaaS Monthly Price**: `8.00`
  - **Alternative Name**: `Passbolt`
  - **Alternative URL**: `https://www.passbolt.com`
  - **License**: `AGPL-3.0`
  - **Self-Host**: `true`
  - **Cloud Option**: `https://www.passbolt.com/pricing`
  - **Cloud Price**: `€3.50/user/month`
  - **Difficulty**: `medium`
  - **Category**: `Security & Passwords`
  - **What You'll Miss**: `Turnkey automatic password changer on websites, consumer-oriented family sharing vaults, and biometric browser unlock without local GPG key setups.`

  ### How to Solve:
  1. Add to `data/tools.yaml`.
  2. Run `python scripts/build_readme.py`.
  3. Verify with `--check`.

---

## Issue 3: Add a "Copy as Markdown" / Embed Badge button on tool cards

- **Title**: `[Feature]: Add "Copy Markdown Table Row" button on web directory cards`
- **Labels**: `good first issue`, `frontend`, `enhancement`
- **Description**:
  ### Overview
  In the web directory (`docs/index.html`), allow users or open-source maintainers to click a "Copy Markdown" button on any tool card so they can paste it directly into their GitHub README or blog posts.

  ### Proposed Behavior:
  - Add a small `📋 Copy Markdown` button on each card.
  - When clicked, copies:
    ```markdown
    Replace **Slack** ($8.75/mo) with [**Mattermost**](https://mattermost.com) (`AGPL-3.0`).
    ```
  - Displays a brief 2-second `Copied!` tooltip toast.

  ### Files to Touch:
  - `docs/index.html`

---

## Issue 4: Add CSV/JSON export button in the web directory

- **Title**: `[Feature]: Add "Export to CSV" button in the web directory`
- **Labels**: `good first issue`, `frontend`
- **Description**:
  ### Overview
  Allow CFOs, engineering managers, and finance teams to download the currently filtered tools and calculated savings directly as a spreadsheet CSV.

  ### Requirements:
  - A button in `docs/index.html` labeled `📥 Export to CSV`.
  - Downloads a `.csv` with columns: `SaaS Name, SaaS Monthly Price, Alternative Name, License, Difficulty, What You'll Miss, Category`.
  - Pure client-side Vanilla JavaScript (Blob/data URL), no third-party libraries needed.

---

## Issue 5: Add Screenity as a browser-first alternative to Loom

- **Title**: `[Tool Suggestion]: Add Loom → Screenity (Chrome Extension)`
- **Labels**: `good first issue`, `enhancement`
- **Description**:
  ### Overview
  While we feature Cap for desktop screen recording, **Screenity** is a beloved GPL-3.0 open-source browser extension with zero monthly fees and on-screen drawing annotations.

  ### Proposed Details:
  - **SaaS Name**: `Loom (Starter)`
  - **SaaS Price**: `12.50`
  - **Alternative Name**: `Screenity`
  - **Alternative URL**: `https://screenity.io`
  - **License**: `GPL-3.0`
  - **Self-Host**: `true`
  - **Difficulty**: `easy`
  - **Category**: `Design & Creative`
  - **What You'll Miss**: `Cloud-hosted instant link sharing, automatic cloud video transcoding, and AI video chapter summaries.`

