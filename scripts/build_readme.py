#!/usr/bin/env python3
"""
cancel-your-saas: Build and Sync README & Documentation
Reads data/tools.yaml, validates schema integrity, and injects comparison tables into README.md.
"""

from pathlib import Path
import sys
import argparse

try:
    import yaml
except ImportError:
    print("Error: PyYAML is required. Run: pip install pyyaml", file=sys.stderr)
    sys.exit(1)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = PROJECT_ROOT / "data" / "tools.yaml"
README_FILE = PROJECT_ROOT / "README.md"

MARKER_START = "<!-- TOOLS_TABLE_START -->"
MARKER_END = "<!-- TOOLS_TABLE_END -->"

VALID_DIFFICULTIES = {"easy", "medium", "hard"}
DIFFICULTY_BADGES = {
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
        if diff not in VALID_DIFFICULTIES:
            raise ValueError(
                f"Tool '{name}' has invalid difficulty '{item.get('difficulty')}'. Expected one of: {VALID_DIFFICULTIES}"
            )

        if not isinstance(item.get("self_host"), bool):
            raise ValueError(f"Tool '{name}' 'self_host' must be a boolean.")

        price = item.get("saas_price_per_user_month")
        if not isinstance(price, (int, float)) or price < 0:
            raise ValueError(f"Tool '{name}' price must be a non-negative number.")


def format_currency(amount: float) -> str:
    if amount == 0:
        return "Free"
    return f"${amount:,.2f}"


def generate_markdown_table(tools):
    categories = {}
    for tool in tools:
        cat = tool.get("category", "General")
        categories.setdefault(cat, []).append(tool)

    lines = []

    # Summary Stats
    total_tools = len(tools)
    categories_count = len(categories)
    lines.append(f"> **Catalog**: Tracking **{total_tools}** open-source alternatives across **{categories_count}** SaaS categories.\n")

    # Table of Contents
    lines.append("### Categories\n")
    toc_items = []
    for cat in sorted(categories.keys()):
        anchor = cat.lower().replace(" ", "-").replace("&", "").replace("--", "-")
        toc_items.append(f"[{cat}](#{anchor})")
    lines.append(" • ".join(toc_items) + "\n")

    for cat, items in sorted(categories.items()):
        lines.append(f"### {cat}\n")
        lines.append(
            "| SaaS Tool | SaaS Price | Open-Source Alternative | License | Self-Host | Difficulty | What You'll Miss |"
        )
        lines.append(
            "| :--- | :--- | :--- | :--- | :---: | :---: | :--- |"
        )

        for item in sorted(items, key=lambda x: x["saas_name"]):
            saas = f"**{item['saas_name']}**"
            saas_price = f"{format_currency(item['saas_price_per_user_month'])}/user/mo"
            alt = f"[{item['alternative_name']}]({item['alternative_url']})"
            license_badge = f"`{item['license']}`"
            self_host = "✅ Yes" if item.get("self_host") else "❌ No"
            difficulty = DIFFICULTY_BADGES.get(item.get("difficulty", "").lower(), item.get("difficulty", ""))
            what_youll_miss = item.get("what_youll_miss", "").replace("|", "\\|")

            lines.append(
                f"| {saas} | {saas_price} | {alt} | {license_badge} | {self_host} | {difficulty} | {what_youll_miss} |"
            )
        lines.append("")

    return "\n".join(lines)


def update_readme(markdown_content: str):
    if not README_FILE.exists():
        raise FileNotFoundError(f"README file not found at {README_FILE}")

    content = README_FILE.read_text(encoding="utf-8")

    if MARKER_START not in content or MARKER_END not in content:
        raise ValueError(f"README markers '{MARKER_START}' or '{MARKER_END}' missing from {README_FILE}")

    pre = content.split(MARKER_START)[0]
    post = content.split(MARKER_END)[1]

    new_content = f"{pre}{MARKER_START}\n\n{markdown_content}\n{MARKER_END}{post}"
    README_FILE.write_text(new_content, encoding="utf-8")
    print(f"Successfully updated {README_FILE.name} with latest tool tables!")


def main():
    parser = argparse.ArgumentParser(description="Build and update cancel-your-saas documentation.")
    parser.add_argument("--write", action="store_true", help="Write generated tables directly into README.md")
    parser.add_argument("--check", action="store_true", help="Validate YAML schema only")
    args = parser.parse_args()

    tools = load_tools(DATA_FILE)
    print(f"Validated {len(tools)} tools from {DATA_FILE.name}")

    if args.check:
        print("Schema validation passed.")
        return

    table_md = generate_markdown_table(tools)

    if args.write:
        update_readme(table_md)
    else:
        print("\n--- Generated Markdown Preview ---\n")
        print(table_md)
        print("Tip: Run with --write to sync README.md")


if __name__ == "__main__":
    main()
