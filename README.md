# F1 Stats

Dashboard em Next.js para acompanhar estatisticas de Formula 1.

## O que ja existe

- Home com resumo da temporada, lider do campeonato e cards de indicadores.
- Explorador de pilotos com busca, filtro por equipe, ordenacao, favoritos locais e painel de detalhe.
- Paginas estaticas de detalhe em `/pilotos/[slug]`.
- Paginas estaticas de detalhe em `/equipes/[slug]`.
- Paginas estaticas de detalhe em `/corridas/[slug]`.
- Comparador interativo entre dois pilotos.
- Comparador com selecoes persistidas no navegador.
- Seletor de temporada com preferencia local.
- Grafico SVG de evolucao de pontos por corrida.
- Historico de corridas com filtro por equipe e tipo de sessao.
- Camada de API com Jolpica F1 e fallback para dados demo locais.
- Endpoints internos em `/api/f1/dashboard`, `/api/f1/standings` e `/api/f1/schedule`.
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

## API

O projeto tenta buscar dados reais da Jolpica F1 API. Se a API estiver fora do ar
ou o ambiente estiver sem rede, a aplicacao usa os mocks locais automaticamente.

Rotas internas:

- `/api/f1/dashboard?season=current`
- `/api/f1/standings?season=current`
- `/api/f1/schedule?season=current`

## Proximos passos

1. Expandir normalizacao da API para resultados e qualificacao.
2. Criar filtros por etapa, circuito e pais.
3. Adicionar tela de calendario completo.
4. Adicionar testes para a camada de API.
