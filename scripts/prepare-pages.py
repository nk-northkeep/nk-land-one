#!/usr/bin/env python3
"""Monta o diretório publicado no GitHub Pages e injeta variáveis de analytics."""

from __future__ import annotations

import html
import json
import os
import re
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
    "og-image.png",
]

PUBLISH_DIRS = ["design-system"]


CONFIG_KEYS = (
    "siteUrl",
    "gaMeasurementId",
    "gtmContainerId",
    "clarityProjectId",
    "searchConsoleVerification",
    "bingSiteVerification",
    "metaPixelId",
    "leadFormAction",
)

ENV_FOR = {
    "siteUrl": "SITE_URL",
    "gaMeasurementId": "GA_MEASUREMENT_ID",
    "gtmContainerId": "GTM_CONTAINER_ID",
    "clarityProjectId": "CLARITY_PROJECT_ID",
    "searchConsoleVerification": "SEARCH_CONSOLE_VERIFICATION",
    "bingSiteVerification": "BING_SITE_VERIFICATION",
    "metaPixelId": "META_PIXEL_ID",
    "leadFormAction": "LEAD_FORM_ACTION",
}


def env(name: str) -> str:
    return os.environ.get(name, "").strip()


def https_url(value: str) -> str:
    if value.startswith("https://") and " " not in value:
        return value
    return ""


def read_committed_config() -> dict[str, str]:
    text = (ROOT / "site-config.js").read_text(encoding="utf-8")
    config: dict[str, str] = {}
    for key in CONFIG_KEYS:
        match = re.search(rf"\b{re.escape(key)}\s*:\s*\"([^\"]*)\"", text)
        if not match:
            raise SystemExit(f"site-config.js sem {key}")
        config[key] = match.group(1)
    return config


def apply_overrides(config: dict[str, str]) -> dict[str, str]:
    """Variável de ambiente vazia mantém o valor commitado."""
    out = dict(config)
    for key, env_name in ENV_FOR.items():
        raw = env(env_name)
        if not raw:
            continue
        if key == "leadFormAction":
            safe = https_url(raw)
            if not safe:
                print("LEAD_FORM_ACTION ignorado: informe uma URL https, sem espaços.")
                continue
            out[key] = safe
            continue
        if key == "siteUrl":
            out[key] = raw.rstrip("/")
            continue
        out[key] = raw
    return out


def write_site_config(dest: Path) -> dict[str, str]:
    config = apply_overrides(read_committed_config())

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
        f"  leadFormAction: {js(config['leadFormAction'])},",
        "};",
        "",
    ]
    dest.write_text("\n".join(lines), encoding="utf-8")
    return config


def inject_form_action(html_path: Path, action: str) -> None:
    if not action:
        return
    text = html_path.read_text(encoding="utf-8")
    old = (
        'id="aderencia-form" class="aderencia-form ds-card" method="post" '
        'action="mailto:comercial@northkeep.com.br" enctype="text/plain"'
    )
    safe = html.escape(action, quote=True)
    new = (
        'id="aderencia-form" class="aderencia-form ds-card" method="post" '
        f'action="{safe}" enctype="application/x-www-form-urlencoded"'
    )
    if old not in text:
        raise SystemExit("Marcador do formulário de aderência não encontrado em index.html")
    html_path.write_text(text.replace(old, new, 1), encoding="utf-8")


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
    index = OUT / "index.html"
    if index.exists():
        inject_form_action(index, config["leadFormAction"])

    enabled = [key for key, value in config.items() if key != "siteUrl" and value]
    print(f"GitHub Pages artifact pronto em {OUT}")
    print(f"SITE_URL={config['siteUrl']}")
    print("Ferramentas ativas: " + (", ".join(enabled) if enabled else "(nenhuma — IDs vazios)"))


if __name__ == "__main__":
    main()
