#!/usr/bin/env python3
"""
cancel-your-saas: Build README.md and Static Documentation
Reads data/tools.yaml, exports docs/tools.json, embeds fallback data into docs/index.html,
and generates the complete README.md with the CFO savings calculator.
"""

from pathlib import Path
import json
import re
import sys

try:
    import yaml
except ImportError:
    print("Error: PyYAML is required. Run: pip install pyyaml", file=sys.stderr)
    sys.exit(1)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = PROJECT_ROOT / "data" / "tools.yaml"
README_FILE = PROJECT_ROOT / "README.md"
DOCS_DIR = PROJECT_ROOT / "docs"
DOCS_HTML_FILE = DOCS_DIR / "index.html"
DOCS_JSON_FILE = DOCS_DIR / "tools.json"

CATEGORY_ICONS = {
    "Communication": "💬",
    "Project Management": "📋",
    "Developer Tools": "💻",
    "Analytics": "📈",
    "Design & Creative": "🎨",
    "Security & Passwords": "🔒",
    "Automation": "⚡",
    "Customer Support": "🎧",
    "Forms & Surveys": "📝",
    "Documentation": "📚",
}

DIFFICULTY_MAP = {
    "easy": "🟢 Easy",
    "medium": "🟡 Medium",
    "hard": "🔴 Hard",
}


def load_tools(data_path: Path):
    if not data_path.exists():
        raise FileNotFoundError(f"Data file not found at {data_path}")
    with open(data_path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    tools = data.get("tools", [])
    validate_tools(tools)
    return tools


def validate_tools(tools):
    required_fields = [
        "saas_name",
        "saas_price_per_user_month",
        "alternative_name",
        "alternative_url",
        "license",
        "self_host",
        "difficulty",
        "what_youll_miss",
        "category",
    ]

    for idx, item in enumerate(tools):
        name = item.get("saas_name", f"Index #{idx}")
        for field in required_fields:
            if field not in item:
                raise ValueError(f"Tool '{name}' is missing required field: '{field}'")

        diff = str(item.get("difficulty", "")).lower()
        if diff not in DIFFICULTY_MAP:
            raise ValueError(
                f"Tool '{name}' has invalid difficulty '{item.get('difficulty')}'. Expected: {list(DIFFICULTY_MAP.keys())}"
            )


def format_currency(val: float) -> str:
    if val == 0:
        return "Free"
    return f"${val:,.2f}"


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    return text.strip("-")


def export_json(tools):
    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    json_str = json.dumps(tools, indent=2, ensure_ascii=False)

    # Write docs/tools.json
    with open(DOCS_JSON_FILE, "w", encoding="utf-8") as f:
        f.write(json_str)
    print(f"Exported {len(tools)} tools to {DOCS_JSON_FILE.name}")


def build_readme_content(tools):
    total_tools = len(tools)

    # Calculate Savings for a 10-person team
    monthly_seat_sum = sum(t["saas_price_per_user_month"] for t in tools)
    team_size = 10
    monthly_team_cost = monthly_seat_sum * team_size
    yearly_team_savings = monthly_team_cost * 12

    # Group tools by category
    categories = {}
    for tool in tools:
        cat = tool.get("category", "General")
        categories.setdefault(cat, []).append(tool)

    content = []

    # 1. Header
    content.append("# Cancel Your SaaS 💸")
    content.append("> **Your CFO will thank you.**")
    content.append("")
    content.append("A fun, curated, and brutally honest list of open-source alternatives to expensive SaaS subscriptions.")
    content.append("")
    content.append("[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)")
    content.append(f"[![Tools Tracked](https://img.shields.io/badge/Tools_Tracked-{total_tools}-orange.svg)](data/tools.yaml)")
    content.append(f"[![Categories](https://img.shields.io/badge/Categories-{len(categories)}-purple.svg)](#-categories)")
    content.append("[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)")
    content.append("")
    content.append("---")
    content.append("")

    # 2. The CFO Savings Calculator
    content.append("## 💰 The CFO Savings Calculator")
    content.append("")
    content.append(f"Imagine a **{team_size}-person company** using every SaaS staple listed below:")
    content.append("")
    content.append(f"- 💳 **Combined SaaS cost per user:** **${monthly_seat_sum:,.2f}** / month")
    content.append(f"- 🏢 **Total bill for a {team_size}-person team:** **${monthly_team_cost:,.2f}** / month")
    content.append(f"- 🚀 **Total yearly cash savings if you switched everything:**")
    content.append("")
    content.append(f"$$\\Large \\mathbf{{\\${yearly_team_savings:,.2f} \\text{{ / year}}}}$$")
    content.append("")
    content.append("> *Even replacing just 3 or 4 tools (like your chat, ticketing, or project management) routinely saves growing startups **$20,000 to $50,000+** annually.*")
    content.append("")
    content.append("---")
    content.append("")

    # 3. Table of Contents
    content.append("## 🧭 Categories")
    content.append("")
    toc_links = []
    for cat in sorted(categories.keys()):
        icon = CATEGORY_ICONS.get(cat, "📦")
        slug = slugify(f"{icon} {cat}")
        count = len(categories[cat])
        toc_links.append(f"- [{icon} **{cat}** ({count})](#{slug})")
    content.append("\n".join(toc_links))
    content.append("")
    content.append("---")
    content.append("")

    # 4. Per-category & Per-entry Sections
    for cat in sorted(categories.keys()):
        icon = CATEGORY_ICONS.get(cat, "📦")
        items = sorted(categories[cat], key=lambda x: x["saas_name"].lower())
        content.append(f"## {icon} {cat}")
        content.append("")

        for item in items:
            saas = item["saas_name"]
            alt = item["alternative_name"]
            alt_url = item["alternative_url"]
            saas_price = format_currency(item["saas_price_per_user_month"])
            diff = DIFFICULTY_MAP.get(str(item.get("difficulty")).lower(), item.get("difficulty"))
            license_name = item.get("license")
            miss = item.get("what_youll_miss", "")

            # Formulate cloud / self-host text
            could_pay_parts = ["$0 (Self-hosted)"]
            if item.get("cloud_price"):
                could_pay_parts.append(f"{item['cloud_price']} (Managed Cloud)")
            could_pay_str = " or ".join(could_pay_parts)

            # Formulate links
            links = [f"[{alt}]({alt_url})"]
            if item.get("cloud_option_url"):
                links.append(f"[Cloud Option]({item['cloud_option_url']})")
            links_str = " • ".join(links)

            content.append(f"### 🪦 {saas} → ✅ {alt}")
            content.append(f"- 💸 **You pay:** {saas_price}/user/mo")
            content.append(f"- 🆓 **You could pay:** {could_pay_str}")
            content.append(f"- 😎 **Switch difficulty:** {diff}")
            content.append(f"- 📜 **License:** `{license_name}`")
            content.append(f"- ⚠️ **What you'll miss:** {miss}")
            content.append(f"- 🔗 **Links:** {links_str}")
            content.append("")

        content.append("---")
        content.append("")

    # 5. How to contribute
    content.append("## 🤝 How to Contribute")
    content.append("")
    content.append("We welcome submissions for new tools, updated pricing, and corrections!")
    content.append("")
    content.append("1. **Check the rules**: Read [`CONTRIBUTING.md`](CONTRIBUTING.md). We require verified public pricing, verified open-source licenses, and genuinely honest trade-offs in `what_youll_miss`.")
    content.append("2. **Edit `data/tools.yaml`**: Add your entry respecting the YAML schema.")
    content.append("3. **Rebuild the README**:")
    content.append("   ```bash")
    content.append("   python scripts/build_readme.py")
    content.append("   ```")
    content.append("4. **Open a Pull Request**: Submit your PR with a brief explanation.")
    content.append("")
    content.append("---")
    content.append("")

    # 6. Affiliate Note
    content.append("## 🚫 Affiliate Links Policy")
    content.append("")
    content.append("> **Zero affiliate links. Ever.**")
    content.append("")
    content.append("Every link in this repository points directly to official project repositories or homepages. There are no referral codes, tracking redirects, or sponsored placements—just pure, unfiltered open-source advocacy.")
    content.append("")
    content.append("---")
    content.append("")

    # 7. License
    content.append("## 📄 License")
    content.append("")
    content.append("Distributed under the [MIT License](LICENSE).")
    content.append("")

    return "\n".join(content)


def main():
    tools = load_tools(DATA_FILE)
    print(f"Loaded and validated {len(tools)} tools from {DATA_FILE.name}")

    # Export JSON
    export_json(tools)

    # Build README content
    new_readme = build_readme_content(tools)

    # Write README.md
    README_FILE.write_text(new_readme, encoding="utf-8")
    print(f"Successfully generated {README_FILE.name}")


if __name__ == "__main__":
    main()
