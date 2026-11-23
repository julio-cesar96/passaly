# PROTÓTIPO DESCARTÁVEL: paletas de cor

Não é base do app. Serve para responder uma pergunta: **qual paleta o Passaly usa?** Três opções (A, B, C) e uma variante da escolhida (D), cada uma em claro e escuro, aplicadas às mesmas 3 telas a 360 px (código por SMS, lista de Posts, landing).

```sh
open prototypes/paletas/index.html
```

Nada externo (ADR 0013): HTML, CSS e JS locais, fonte `system-ui`, ícones e "foto" do pacote em SVG desenhado à mão. Dados fictícios.

- `paletas.js`: os tokens no formato do shadcn (hex), os pares que a interface usa e a conta do contraste WCAG 2 (luminância relativa, sem lib). É o que vira o teste do Vitest.
- `app.js`: colunas (paleta × tema), as 3 telas, a tabela de contraste e o editor de tokens.
- `estilo.css`: `.chrome` são os controles do protótipo (cinza neutro); `.tela` só usa os tokens.

## Como usar

- Cada coluna escolhe paleta e tema (claro, escuro ou o do sistema). "Comparar" monta todas no claro, todas no escuro ou uma paleta em claro × escuro.
- ← → (teclado ou barra de baixo) trocam a paleta de todas as colunas.
- "Campo do código" mostra o campo normal, com o anel de foco ou com erro.
- "Tokens" deixa mudar a cor de um token: a tela e a tabela recalculam, e o que falhar fica em vermelho. O ajuste vive só na memória; o CSS dos dois temas sai pronto no fim do painel.
- O estado fica na URL (`#tela=lista&estado=erro&col=A.claro,A.escuro`).

## As opções

| | Ideia | Claro (primary) | Escuro (primary) | A pesar |
|---|---|---|---|---|
| **A. Sálvia** | verde de folha, neutros de papel | `#2D6A4E` | `#7CC3A0` | calmo; verde lembra "eco", comum em app de reaproveitamento |
| **B. Barro** | terracota com creme | `#A33E23` | `#EF8E6D` | quente; o primary fica perto do vermelho de erro (`destructive` virou vinho, mas ainda se parecem) |
| **C. Ameixa** | berinjela com damasco | `#6A2E6D` | `#CDA6DE` | mais marcante e o de maior contraste no primary (8,9:1); roxo-claro no escuro pode ler como lilás |

As 4 passam nos 25 pares, nos dois temas. As bordas (`border`) ficam em 3,1 a 3,7:1, perto do mínimo de 3:1 pedido (o 1.4.11 não cobre borda decorativa); isso deixa o contorno do card visível, mais forte que o padrão do shadcn.

## Resultado (2026-11-23)

Escolhida a **D. Barro neutro** pelo fundador (primeiro a B, depois a variante D). Tokens em [docs/guia-de-ui.md](../../docs/guia-de-ui.md), seção "Cor e tema".

Corrigido depois da escolha, sem mexer em cor: "Trocar número" (18 px) e o logo (32 px) estavam abaixo de 44 px; bairro e validade estavam em 14 px; o card afirmava "pacote fechado" e a validade como fato, sem "o Anunciante declarou" (história 32 da #2).

### Variante D. Barro neutro

A B junta creme e terracota, combinação que a pesquisa de UI lista como padrão de página gerada. A D troca `background`, `muted`, `border`, `input` e os textos neutros por cinza (no escuro, também `card` e `popover`) e mantém `primary`, `secondary`, `accent` e `destructive` da B.

`#tela=todas&estado=normal&col=B.claro,D.claro,B.escuro,D.escuro` compara as duas.
