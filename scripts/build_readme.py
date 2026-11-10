#!/usr/bin/env python3
"""
cancel-your-saas: Build README and Documentation
Reads data/tools.yaml and generates the curated markdown tables.
"""

from pathlib import Path
import sys

try:
    import yaml
except ImportError:
    print("Error: PyYAML is required to build the README. Run: pip install pyyaml", file=sys.stderr)
    sys.exit(1)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = PROJECT_ROOT / "data" / "tools.yaml"
README_FILE = PROJECT_ROOT / "README.md"

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
    return data.get("tools", [])


def format_currency(amount: float) -> str:
    if amount == 0:
        return "Free"
    return f"${amount:,.2f}"


def generate_markdown_table(tools):
    # Group tools by category
    categories = {}
    for tool in tools:
        cat = tool.get("category", "General")
        categories.setdefault(cat, []).append(tool)

    lines = []

    for cat, items in sorted(categories.items()):
        lines.append(f"### {cat}\n")
        lines.append(
            "| SaaS Tool | SaaS Price | Open-Source Alternative | License | Self-Host | Difficulty | What You'll Miss |"
        )
        lines.append(
            "| :--- | :--- | :--- | :--- | :---: | :---: | :--- |"
        )

        for item in items:
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


def main():
    tools = load_tools(DATA_FILE)
    print(f"Loaded {len(tools)} tools from {DATA_FILE.name}")
    generated_content = generate_markdown_table(tools)
    print("\n--- Preview of Generated Markdown Tables ---\n")
    print(generated_content)


if __name__ == "__main__":
    main()
