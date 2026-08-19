#!/usr/bin/env python3
"""Monta o diretório publicado no GitHub Pages e injeta variáveis de analytics."""

from __future__ import annotations

import html
import json
import os
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "_site"

PUBLISH_FILES = [
    "index.html",
    "privacidade.html",
    "404.html",
    "style.css",
    "site-support.css",
    "script.js",
    "analytics.js",
    "site-config.js",
    "favicon.ico",
    "robots.txt",
    "sitemap.xml",
    "CNAME",
    ".nojekyll",
    "whatsapp-icon.png",
    "whatsapp-icon-white.png",
]

PUBLISH_DIRS = ["design-system"]


def env(name: str, default: str = "") -> str:
    value = os.environ.get(name, "").strip()
    return value or default


def write_site_config(dest: Path) -> dict[str, str]:
    config = {
        "siteUrl": env("SITE_URL", "https://conheca.one.northkeep.com.br").rstrip("/"),
        "gaMeasurementId": env("GA_MEASUREMENT_ID"),
        "gtmContainerId": env("GTM_CONTAINER_ID"),
        "clarityProjectId": env("CLARITY_PROJECT_ID"),
        "searchConsoleVerification": env("SEARCH_CONSOLE_VERIFICATION"),
        "bingSiteVerification": env("BING_SITE_VERIFICATION"),
        "metaPixelId": env("META_PIXEL_ID"),
    }

    js = json.dumps
    lines = [
        "window.NK_SITE_CONFIG = {",
        f"  siteUrl: {js(config['siteUrl'])},",
        f"  gaMeasurementId: {js(config['gaMeasurementId'])},",
        f"  gtmContainerId: {js(config['gtmContainerId'])},",
        f"  clarityProjectId: {js(config['clarityProjectId'])},",
        f"  searchConsoleVerification: {js(config['searchConsoleVerification'])},",
        f"  bingSiteVerification: {js(config['bingSiteVerification'])},",
        f"  metaPixelId: {js(config['metaPixelId'])},",
        "};",
        "",
    ]
    dest.write_text("\n".join(lines), encoding="utf-8")
    return config


def inject_verification_meta(html_path: Path, config: dict[str, str]) -> None:
    tags = []
    if config["searchConsoleVerification"]:
        token = html.escape(config["searchConsoleVerification"], quote=True)
        tags.append(f'    <meta name="google-site-verification" content="{token}">')
    if config["bingSiteVerification"]:
        token = html.escape(config["bingSiteVerification"], quote=True)
        tags.append(f'    <meta name="msvalidate.01" content="{token}">')
    if not tags:
        return

    html = html_path.read_text(encoding="utf-8")
    needle = '    <meta name="viewport"'
    if needle not in html:
        return
    html_path.write_text(html.replace(needle, "\n".join(tags) + "\n" + needle, 1), encoding="utf-8")


def copy_tree() -> None:
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)

    for name in PUBLISH_FILES:
        src = ROOT / name
        if src.exists():
            shutil.copy2(src, OUT / name)

    for dirname in PUBLISH_DIRS:
        src = ROOT / dirname
        dest = OUT / dirname
        shutil.copytree(
            src,
            dest,
            ignore=shutil.ignore_patterns("*.md", "components"),
        )


def main() -> None:
    copy_tree()
    config = write_site_config(OUT / "site-config.js")
    for page in ("index.html", "privacidade.html", "404.html"):
        path = OUT / page
        if path.exists():
            inject_verification_meta(path, config)

    enabled = [key for key, value in config.items() if key != "siteUrl" and value]
    print(f"GitHub Pages artifact pronto em {OUT}")
    print(f"SITE_URL={config['siteUrl']}")
    print("Ferramentas ativas: " + (", ".join(enabled) if enabled else "(nenhuma — IDs vazios)"))


if __name__ == "__main__":
    main()
