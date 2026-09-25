# F1 Stats

Dashboard em Next.js para acompanhar estatisticas de Formula 1.

## O que ja existe

- Home com resumo da temporada, lider do campeonato e cards de indicadores.
- Explorador de pilotos com busca, filtro por equipe, ordenacao, favoritos locais e painel de detalhe.
- Paginas estaticas de detalhe em `/pilotos/[slug]`.
- Paginas estaticas de detalhe em `/equipes/[slug]`.
- Comparador interativo entre dois pilotos.
- Comparador com selecoes persistidas no navegador.
- Seletor de temporada com preferencia local.
- Grafico SVG de evolucao de pontos por corrida.
- Secoes de construtores, proximas corridas, ultimos resultados, comparativo e backlog do produto.
- Dados de exemplo separados em `app/data/f1-data.ts`, prontos para virar uma camada de API.

## Como rodar

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Validacao

```bash
npx eslint app --max-warnings=0
npm run build
```

## Proximos passos

1. Conectar uma API de dados reais de F1.
2. Criar filtros por etapa e tipo de sessao.
3. Adicionar pagina de detalhe por corrida.
4. Trocar os mocks por uma camada de fetch/cache.
