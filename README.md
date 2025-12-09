# Axe Land IA Comercial — Landing Page

Landing page profissional para IA Comercial Estratégica, focada em identificar gaps comerciais, prever vendas e orientar ações prescritivas. Construída com HTML/CSS/JS puro para desempenho, SEO e rápida publicação em Nginx com Cloudflare.

## Recursos
- Narrativa baseada em dores reais do comercial e 4 frentes de IA
- Arquitetura tríade: Geoespacial, ML Preditivo e IA Generativa
- Modal de Diagnóstico Rápido com integração direta ao WhatsApp
- Animações suaves de entrada e acessibilidade aprimorada
- Metadados SEO, Open Graph e JSON-LD

## Estrutura
- `index.html` — página principal
- `style.css` — estilos responsivos e animações
- `script.js` — interações, modal e integração WhatsApp
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
git commit -m "feat: landing page IA Comercial"
git branch -M main
git remote add origin https://github.com/<usuario>/<repositorio>.git
git push -u origin main
```

## Ajustes Recomendados
- Substituir `seu-background-comercial.jpg` por imagem WebP otimizada
- Incluir logos/depoimentos de clientes para prova social
- Adicionar camada leve de analytics (apenas eventos de click/visão de seção)

## Licença
Defina a licença conforme a estratégia do projeto (MIT/Proprietária).

