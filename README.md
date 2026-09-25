# F1 Stats

Dashboard em Next.js para acompanhar estatisticas de Formula 1.

## O que ja existe

- Home com resumo da temporada, lider do campeonato e cards de indicadores.
- Explorador de pilotos com busca, filtro por equipe, ordenacao, favoritos locais e painel de detalhe.
- Paginas estaticas de detalhe em `/pilotos/[slug]`.
- Comparador interativo entre dois pilotos.
- Secoes de construtores, proximas corridas, comparativo e backlog do produto.
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
2. Criar paginas de detalhe para equipes.
3. Adicionar historico por corrida.
4. Persistir preferencias de filtros e comparacoes.
