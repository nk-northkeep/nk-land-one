# ONE NorthKeep — Landing Page

Landing comercial do **ONE** (Inteligência Estratégica da NorthKeep). O produto já está em produção em [one.northkeep.com.br](https://one.northkeep.com.br/); esta land apresenta o que está no ar, a ingestão (SAP, outros ERPs ou carga manual), o ciclo com o [KPI System](https://kpi.northkeep.com.br/) e o roadmap de novas áreas. HTML, CSS e JavaScript puros para desempenho, SEO e publicação no **GitHub Pages**.

## Recursos
- Narrativa alinhada ao comercial no ar: quatro frentes de IA, território, prescritiva, Coach
- Ingestão explícita: SAP (incluindo HANA), outros ERPs e carga manual
- Ponte de responsabilização para o KPI System (`kpi.northkeep.com.br`)
- Roadmap de extensão do conceito ONE para operações, supply e produção
- Modal de diagnóstico rápido com WhatsApp NorthKeep
- Metadados SEO, Open Graph e JSON-LD (organização NorthKeep)
- Analytics opcional (GA4, GTM, Clarity, Search Console, Meta Pixel) via variáveis do GitHub

## Estrutura
- `index.html` — página principal
- `privacidade.html` — aviso de privacidade
- `style.css` — estilos responsivos e animações
- `script.js` — interações, modal, WhatsApp e eventos de conversão
- `site-config.js` — IDs de analytics (vazios no repo; preenchidos no deploy)
- `analytics.js` — carrega só as ferramentas cujo ID foi informado
- `design-system/` — tokens e componentes ONE/NorthKeep
- `.github/workflows/pages.yml` — publicação no GitHub Pages
- `docs/` — PRD e arquitetura técnica

## Preview Local
```bash
python -m http.server 8000
# abra em http://localhost:8000/
```

No preview local o analytics **não dispara**, porque `site-config.js` vai sem IDs. Para simular o pacote publicado:

```bash
python scripts/prepare-pages.py
python -m http.server 8000 --directory _site
```

## Identidade e DNS

| Uso | Valor |
|------|--------|
| Land | `https://conheca.one.northkeep.com.br` |
| App | `https://one.northkeep.com.br` |
| KPI | `https://kpi.northkeep.com.br` |
| Institucional | `https://www.northkeep.com.br` |
| GitHub Pages | `nk-northkeep.github.io` (CNAME no repo) |
| WhatsApp | `47 3150-0001` (`wa.me/554731500001`) |

O certificado `*.northkeep.com.br` **não cobre** `conheca.one.northkeep.com.br` (dois níveis). No GitHub Pages o HTTPS do host customizado é emitido automaticamente após o CNAME propagar.

## Publicação no GitHub Pages

1. No repositório: **Settings → Pages → Source = GitHub Actions**
2. Preencha as [variáveis](#variáveis-de-analytics) em **Settings → Secrets and variables → Actions → Variables**
3. No Cloudflare (zona `northkeep.com.br`), crie `conheca.one` como **CNAME** para `nk-northkeep.github.io`
4. Deixe o registro em **DNS only** (nuvem cinza) para o GitHub emitir o certificado do domínio
5. Faça push em `main` (ou rode o workflow **Deploy GitHub Pages** manualmente)

```bash
git add .
git commit -m "feat: landing ONE NorthKeep"
git push origin main
```

O arquivo `CNAME` já aponta para `conheca.one.northkeep.com.br`. Depois do primeiro deploy, em **Settings → Pages** confirme o custom domain e o cadeado HTTPS.

### Variáveis de analytics

São **Repository variables** (não secrets): os IDs acabam no HTML publicado. Campo vazio = a ferramenta não é carregada. Se `GTM_CONTAINER_ID` estiver preenchido, o GA4 deve ser configurado **dentro do GTM** (`GA_MEASUREMENT_ID` é ignorado).

| Variável | Exemplo | Uso |
|----------|---------|-----|
| `SITE_URL` | `https://conheca.one.northkeep.com.br` | URL canônica (opcional; já tem padrão) |
| `GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Google Analytics 4 |
| `GTM_CONTAINER_ID` | `GTM-XXXXXXX` | Google Tag Manager |
| `CLARITY_PROJECT_ID` | `abcdefghij` | Microsoft Clarity |
| `SEARCH_CONSOLE_VERIFICATION` | token da meta tag | Google Search Console |
| `BING_SITE_VERIFICATION` | token da meta tag | Bing Webmaster |
| `META_PIXEL_ID` | `1234567890` | Meta Pixel |

Eventos enviados quando alguma ferramenta está ativa:

- `section_view` — primeira visão de cada seção
- `whatsapp_click` — clique em qualquer `wa.me` (`source`: `nav`, `hero`, `float`, `diagnostico`)
- `diagnostico_started` / `diagnostico_completed`

## Publicação alternativa (Nginx + Cloudflare na nk-apps-01)

Se a land voltar para a VM, rode `python scripts/prepare-pages.py` com as mesmas variáveis de ambiente e publique o conteúdo de `_site/` em `/var/www/nk-land-one`. Exemplo de conf Nginx em `docs/technical-architecture-landing-page.md`.

## Ajustes Recomendados
- Incluir logo NorthKeep local quando o asset oficial estiver no repo
- Incluir logos/depoimentos de clientes para prova social

## Licença
Defina a licença conforme a estratégia do projeto (MIT/Proprietária).
