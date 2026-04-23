# Axe Land IA Estratégica — Landing Page

Landing page profissional para IA Estratégica, focada em identificar gargalos, antecipar riscos e orientar ações prescritivas em múltiplas áreas do negócio. Construída com HTML, CSS e JavaScript puros para desempenho, SEO e rápida publicação em Nginx com Cloudflare.

## Recursos
- Narrativa baseada em dores reais da operação e quatro frentes de IA
- Arquitetura integrada: dados de negócio, ML preditivo e IA generativa
- Modal de Diagnóstico Rápido com integração direta ao WhatsApp
- Animações suaves de entrada e acessibilidade aprimorada
- Metadados SEO, Open Graph e JSON-LD

## Estrutura
- `index.html` — página principal
- `style.css` — estilos responsivos e animações
- `script.js` — interações, modal e integração com WhatsApp
- `whatsapp-icon.png`, `whatsapp-icon-white.png`, `favicon.ico`
- `.trae/documents/*.md` — PRD e Arquitetura técnica

## Preview Local
```bash
python -m http.server 8000
# abra em http://localhost:8000/
```

## Publicação (Nginx + Cloudflare)
1. Suba os arquivos para o root do site (`/var/www/axe-land-ia-comercial`)
2. Configure redirecionamento para HTTPS e cabeçalhos de segurança
3. Habilite cache para estáticos (`css, js, png, svg, ico`)
4. Valide `nginx -t` e recarregue `systemctl reload nginx`

Detalhes e exemplo de configuração em `./.trae/documents/technical-architecture-landing-page.md`.

## Publicar no GitHub
```bash
git init
git add .
git commit -m "feat: landing page IA Estratégica"
git branch -M main
git remote add origin https://github.com/<usuario>/<repositorio>.git
git push -u origin main
```

## Ajustes Recomendados
- Substituir a imagem de fundo por um asset WebP otimizado
- Incluir logos/depoimentos de clientes para prova social
- Adicionar camada leve de analytics (apenas eventos de click/visão de seção)

## Licença
Defina a licença conforme a estratégia do projeto (MIT/Proprietária).

