# ONE NorthKeep — Landing Page

Landing comercial do **ONE** (Inteligência Estratégica da NorthKeep). O produto já está em produção em [one.northkeep.com.br](https://one.northkeep.com.br/); esta land apresenta o que está no ar, a ingestão (SAP, outros ERPs ou carga manual), o ciclo com o [NK Action](https://action.northkeep.com.br/) e o roadmap de novas áreas. HTML, CSS e JavaScript puros para desempenho, SEO e publicação no **GitHub Pages**.

## Recursos
- Narrativa alinhada ao comercial no ar: quatro frentes de IA, território, prescritiva, Coach
- Ingestão explícita: SAP (incluindo HANA), outros ERPs e carga manual
- Ponte de responsabilização para o NK Action (`action.northkeep.com.br`)
- Roadmap de extensão do conceito ONE para operações, supply e produção
- Avaliação de Aderência (formulário) com fallback para WhatsApp e e-mail
- Modal de diagnóstico rápido com WhatsApp NorthKeep
- Metadados SEO, Open Graph (incluindo imagem) e JSON-LD
- Analytics opcional (GA4, GTM, Clarity, Search Console, Meta Pixel) — só carrega com ID preenchido

## Estrutura
- `index.html` — página principal
- `privacidade.html` — aviso de privacidade
- `style.css` — estilos responsivos e animações
- `script.js` — interações, modal, WhatsApp e eventos de conversão
- `site-config.js` — único bloco de IDs e do endpoint do formulário (vazios no repo)
- `analytics.js` — carrega só as ferramentas cujo ID foi informado
- `og-image.png` — prévia 1200×630 para Open Graph e Twitter
- `design-system/` — tokens e componentes ONE/NorthKeep
- `.github/workflows/pages.yml` — publicação no GitHub Pages

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
| NK Action | `https://action.northkeep.com.br` |
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

Os IDs publicados ficam em `site-config.js`. Uma **Repository variable** só substitui o campo correspondente quando está preenchida. Variável ausente ou vazia mantém o valor commitado. ID vazio no arquivo = a ferramenta não carrega.

O GA4 (`gaMeasurementId`) é enviado pelo gtag da própria página, também quando o GTM está ativo. Há um único `page_view`. O GTM sobe numa fila separada e não mede o GA4. No GTM, não crie tag do Google nem tag de evento GA4 para `G-Y7WDLTQDEJ` — isso duplicaria o hit. Para contar conversão, marque no GA4 (Admin → Eventos) `lead_form_submit`, `agendar_demonstracao` e `whatsapp_click` como eventos principais.

| Variável | Sobrescreve | Uso |
|----------|-------------|-----|
| `SITE_URL` | `siteUrl` | URL canônica |
| `GA_MEASUREMENT_ID` | `gaMeasurementId` | Google Analytics 4, via gtag |
| `GTM_CONTAINER_ID` | `gtmContainerId` | Google Tag Manager |
| `CLARITY_PROJECT_ID` | `clarityProjectId` | Microsoft Clarity |
| `SEARCH_CONSOLE_VERIFICATION` | `searchConsoleVerification` | Google Search Console |
| `BING_SITE_VERIFICATION` | `bingSiteVerification` | Bing Webmaster |
| `META_PIXEL_ID` | `metaPixelId` | Meta Pixel |
| `LEAD_FORM_ACTION` | `leadFormAction` | POST https da Avaliação de Aderência. Vazio no arquivo = WhatsApp + mailto |

O formulário envia `nome`, `empresa`, `cargo`, `email`, `whatsapp`, `funcionarios`, `segmento`, `consentimento` e `_subject`.

Eventos (o gtag envia ao GA4; o dataLayer fica disponível para o GTM; o Meta só recebe se `metaPixelId` estiver preenchido):

- `lead_form_submit` — envio da Avaliação de Aderência (Meta: `Lead`)
- `agendar_demonstracao` — CTA Agendar demonstração (Meta: `Schedule`; não soma `whatsapp_click`)
- `whatsapp_click` — demais links `wa.me` (`source`: `float`, `diagnostico`; Meta: `Contact`)
- `section_view` — primeira visão de cada seção
- `diagnostico_started` / `diagnostico_completed`

## Publicação alternativa (Nginx + Cloudflare na nk-apps-01)

Se a land voltar para a VM, rode `python scripts/prepare-pages.py` com as mesmas variáveis de ambiente e publique o conteúdo de `_site/` em `/var/www/nk-land-one`.

## Ajustes Recomendados
- Incluir logo NorthKeep local quando o asset oficial estiver no repo
- Incluir logos/depoimentos de clientes para prova social

## Licença
Defina a licença conforme a estratégia do projeto (MIT/Proprietária).
