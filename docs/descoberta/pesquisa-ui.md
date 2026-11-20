# Pesquisa: biblioteca de componentes, base de design e acessibilidade do PWA

> **Aviso: isto não escolhe a biblioteca de UI.** É um levantamento de fontes da fase de descoberta para alimentar o grill e um futuro ADR. Versão, download e estrela mudam toda semana. A leitura de lei e de norma não é parecer jurídico.

- Data da pesquisa / acesso às fontes: 2026-11-20
- Pergunta: que biblioteca de componentes e que base de design servem ao PWA do Passaly? O app é um SPA em Vite + React 19 + TanStack Router/Query ([ADR 0008](../adr/0008-spa-com-hono-sem-ssr.md)), usado no celular por pais com bebê pequeno (pouco tempo, uma mão livre), na Ilha do Governador, em pt-BR. Restrição do AGENTS.md e do [ADR 0005](../adr/0005-aplicacao-hospedada-no-brasil.md): nenhum serviço estrangeiro além do SMS, sem CDN externo e sem analytics. Google Fonts servido do Google expõe o IP do usuário.
- Comparadas: shadcn/ui + Tailwind (variante sobre Radix e variante sobre Base UI), Mantine, Chakra UI, React Aria Components, Park UI. Entrou também o **Ark UI** (base do Park UI e do Chakra v3) e, só na tabela de números, o **HeroUI** (apareceu forte no npm).
- Também levantados: requisitos legais e normativos de acessibilidade no Brasil, UX de código por SMS no celular, cinco skills de design para agentes e a referência visual que o usuário trouxe.
- Método:
  - Versões, datas e downloads: `npm view` e `api.npmjs.org` (semana de 13 a 19/11/2026) [N1].
  - Estrelas: `gh api repos/...` [G1].
  - Docs: lidas nas versões Markdown/`llms.txt` que cada projeto publica, quando havia.
  - Tamanho de bundle: **medi** com um build mínimo do Vite 8 num diretório de rascunho (seção 4).
  - Skills: clonei cada repositório (commit anotado na seção 8) e li `SKILL.md`, referências e scripts, com `grep` por chamada de rede, CDN e telemetria. Não rodei nenhum script delas.
- Bloqueios: o planalto.gov.br recusou `curl` (conexão resetada). Li a LBI pelo WebFetch. O PDF da Portaria do eMAG veio por WebFetch. A NBR 17225 foi lida numa cópia em PDF publicada pela Câmara dos Deputados, não no site da ABNT.
- Legenda: **Alta** (li o texto primário), **Média** (primário parcial), **Baixa** (secundária), **Não confirmado**. Conclusões minhas aparecem como **(inferência)**.
- Não há nada sobre UI, OTP no navegador ou acessibilidade em [pesquisa-sms-otp.md](pesquisa-sms-otp.md) nem em [pesquisa-stack.md](pesquisa-stack.md). A seção 7 complementa as duas sem repetir preço nem contrato.

## 1. Resumo (o que mais pesa na decisão)

1. **Todas as candidatas aceitam React 19 e estão ativas**, menos o Park UI:
   - o pacote `@park-ui/panda-preset` não sai desde 22/11/2024;
   - o último push no repositório foi em 10/04/2026 [N1][G1].
   - O Mantine 9 **exige** React ≥ 19.2 (peer `^19.2.0`) [N1].
2. **Só duas opções não põem runtime de CSS-in-JS nem codegen no caminho:**
   - **shadcn/ui** (Tailwind; o código dos componentes é copiado para o repo);
   - **Mantine** (CSS Modules, folha de estilo pronta).
   - O **Chakra v3** usa Emotion em runtime ("Today, Chakra UI uses Emotion at runtime") e precisa de `style-src 'unsafe-inline'` ou nonce em CSP estrita [C1].
   - O **Park UI** depende do `panda codegen`, que gera uma pasta `styled-system/` [P2].
   - O **React Aria Components** e o **Ark UI** vêm sem estilo: o estilo fica por nossa conta (Tailwind ou CSS).
3. **O shadcn hoje tem duas bases**, e a doc padrão já é a do Base UI:
   - a página de cada componente traz `base: base` [S2];
   - na variante **Radix**, o Drawer usa o **Vaul**, que diz no README "This repo is unmaintained" [S2][S8];
   - na variante **Base UI**, o Drawer é o do próprio Base UI (com gesto de arrastar) [S2][B3].
4. **Bundle medido** (gzip, o que cada lib soma ao React 19, com Dialog/Drawer, Toast, campo e OTP; seção 4):
   - React Aria: +35 KB
   - Radix + Vaul + Sonner + input-otp: +33 KB
   - Ark: +45 KB
   - Base UI: +59 KB
   - Mantine: +35 KB de JS e +36 KB de CSS
   - Chakra: +97 KB
   - Em "Slow 4G" do Lighthouse (1,6 Mbps) [LH], a diferença entre a menor e a maior é de ~0,3 s de transferência **(inferência)**. O service worker do PWA tira esse custo das visitas seguintes **(inferência)**.
5. **Acessibilidade das primitivas:**
   - todas declaram seguir o WAI-ARIA APG [R1][B1][A1];
   - só o **React Aria** publica a lista de leitores de tela testados, incluindo **VoiceOver no iOS e TalkBack no Android**, e traz textos traduzidos para `pt-BR` [A1].
   - **Nenhuma lib garante a área de toque**: o 2.5.8 da WCAG 2.2 (24×24 px CSS) [W1] e a NBR 17225, 5.8.7 [T1], dependem do nosso CSS **(inferência)**.
6. **Lei e norma no Brasil:**
   - a **LBI, art. 63**, obriga acessibilidade nos "sítios da internet mantidos por empresas com sede ou representação comercial no País" [L1];
   - o **eMAG** é de adoção compulsória **só** para órgãos do SISP (governo federal). Para pessoa jurídica de direito privado, a adesão é **voluntária** [E1];
   - a **ABNT NBR 17225:2025** adota a WCAG 2.2 (níveis A e AA como requisito). Pela própria norma, é **voluntária**, salvo citação em regulamento técnico [T1].
7. **Código por SMS no celular:**
   - usar **um só** `<input>` com `autocomplete="one-time-code"` e `inputmode="numeric"` [H2][O4];
   - mandar a última linha do SMS como `@dominio #codigo` [O2][O4];
   - a **WebOTP API** só existe no Chrome Android (84+) e no Chrome desktop (93+). Safari e Firefox não têm [O3];
   - na **Twilio Verify**, a linha `@dominio` exige **template customizado, aprovado caso a caso** [O5];
   - **input-otp** (usado pelo shadcn) é um campo único [I1]. O PinInput do Mantine, o OTPField do Base UI e o PinInput do Ark são uma caixa por dígito [M3][B2][K1], padrão que o guia do Chrome desaconselha [O4].
8. **Fontes sem CDN:**
   - o CLI do shadcn, fora do Next, instala a fonte escolhida por `@fontsource-variable/<fonte>`, ou seja, arquivo servido pelo nosso app [S7];
   - itens de registry de terceiros podem trazer `@import url("https://fonts.googleapis.com/...")`, e a própria doc de registry mostra esse exemplo [S7];
   - o Mantine ensina a carregar fonte local no Vite [M4];
   - ícones: `lucide-react` é pacote npm, sem CDN [N1].
9. **Skills de design:**
   - **nenhuma deve ser instalada inteira agora** **(inferência)**;
   - três trazem Google Fonts ou CDN embutido: **ui-ux-pro-max** (74 pares de fontes, todos com `@import` do Google Fonts), **design.how** (o sistema "Lime" importa Google Fonts; o "Sodium" carrega fonte de `design.how`) e **impeccable** (`font-fetch` baixa do Google, e há telemetria ligada por padrão);
   - as de **jakubkrehel/skills** são só Markdown, sem script de rede no núcleo, e são as mais alinhadas a WCAG 2.2 (seção 8).
10. **Referência visual (landing):** o que vale é o **layout**, não o degradê nem a fonte de display (decisão do usuário). Shadcn/Tailwind entrega os blocos com menos custo **(inferência)** (seção 9).

## 2. Tabela comparativa

Versões e downloads [N1] (semana 13–19/11/2026); estrelas [G1] em 20/11/2026.

| Critério | shadcn/ui (Radix) | shadcn/ui (Base UI) | Mantine | Chakra UI v3 | React Aria Components | Park UI (Ark + Panda) |
|---|---|---|---|---|---|---|
| Última versão (data) | CLI `shadcn` 4.23.0 (27/10/2026); `radix-ui` 1.8.1 (12/10/2026) | CLI 4.23.0; `@base-ui/react` 1.9.0 (09/10/2026) | `@mantine/core` 9.8.2 (20/11/2026) | `@chakra-ui/react` 3.38.0 (03/11/2026) | `react-aria-components` 1.22.1 (09/10/2026) | `@park-ui/panda-preset` 0.43.1 (22/11/2024); `@park-ui/cli` 1.0.1 (20/11/2025); `@ark-ui/react` 5.40.0 (29/10/2026) |
| Ritmo de releases | `radix-ui`: 13 em out/2026, 0 em ago–set | `@base-ui/react`: ~1 por mês em 2026 | 3 a 5 por mês | 1 por mês ou menos | 10 a 25 por mês | preset parado; Ark 1 a 5 por mês |
| React 19 (peer) | sim | sim (`^17 \|\| ^18 \|\| ^19`) | **exige** `^19.2.0` | `>=18` | sim | Ark `>=18` |
| Estilo / mágica | Tailwind; código copiado para o repo | igual | CSS Modules + `styles.css` pronto; PostCSS preset [M2] | **Emotion em runtime** [C1] | sem estilo (Tailwind/CSS por nossa conta) | **Panda CSS: codegen** de `styled-system/` [P2] |
| Código que entra no repo | um arquivo `.tsx` por componente | igual | nenhum (dependência) | nenhum, ou snippets via CLI | o que escrevermos | receitas Panda + componentes copiados |
| Sheet / Drawer | Sheet (Dialog); Drawer = **Vaul, sem manutenção** [S2][S8] | Sheet e Drawer do Base UI, com swipe [S2][B3] | `Drawer` [M1] | `Drawer` | `Sheet` com gestos, desde 1.22 [A3] | Drawer do Ark [K1] |
| Toast | Sonner [S1] | Toast do Base UI [S2] | `@mantine/notifications` (pacote à parte) | `Toaster` | `UNSTABLE_Toast` (instável) [A3] | Toast do Ark |
| OTP | `input-otp`, **campo único** [I1][S3] | `input-otp` [S3] (o Base UI tem `OTPField` com caixas) | `PinInput`, uma caixa por dígito, `oneTimeCode` opcional [M3] | `PinInput` (Ark), `otp` opcional | **não tem**: usar `TextField` | `PinInput` do Ark [K1] |
| Leitores de tela documentados | "wide selection" de ATs, sem lista [R1] | APG; sem lista [B1] | não achei lista | não achei lista | **VoiceOver macOS/iOS, TalkBack, JAWS, NVDA** [A1] | não achei lista |
| `pt-BR` embutido | não se aplica (sem strings) | idem | não verificado | não verificado | **sim** [A1] | não verificado |
| Bundle medido (gzip, acima do React) | +33 KB | +59 KB | +35 KB JS + 36 KB CSS | +97 KB | +35 KB | Ark +45 KB (sem Panda) |
| Temas e tokens | variáveis CSS (`--primary` em OKLCH) [S5] | igual | `createTheme` (cores, `fontFamily`, `defaultRadius`) [M4] | `createSystem` / tokens | por nossa conta | tokens Panda |
| `llms.txt` | sim (ui.shadcn.com) | sim (shadcn e base-ui.com) | sim [M1] | sim (+ `llms-full.txt`) [C1] | sim [A3] | **não** (404) |
| MCP / skill oficial | MCP e skill (`npx skills add shadcn/ui`) [S6] | idem | **não achei** | MCP [C1] | MCP `@react-aria/mcp` e skill [A2] | Ark tem MCP [K1] |
| Downloads/semana | `shadcn` 19,3 mi; `radix-ui` 30,1 mi | `@base-ui/react` 32,4 mi | 3,8 mi | 2,4 mi | 10,1 mi | preset 32 mil; Ark 1,5 mi |
| Estrelas | shadcn-ui/ui 128,6 mil; radix 19,5 mil | mui/base-ui 11,5 mil | 32,0 mil | 40,7 mil | adobe/react-spectrum 16,1 mil | park-ui 2,4 mil; ark 5,5 mil |
| Fonte por padrão | `@fontsource-variable` fora do Next [S7] | igual | pilha de sistema; doc de fonte local [M4] | não verificado | nenhuma | não verificado |

Extra (só números): **HeroUI** 3.2.7 (28/10/2026) é feito sobre React Aria + Tailwind, exige React ≥ 19 e tem `InputOTP`, MCP e `llms.txt` [H1][N1]. Tem 1,1 mi de downloads/semana e 31,3 mil estrelas. Não aprofundei.

## 3. Por biblioteca

### 3.1 shadcn/ui + Tailwind

- **Modelo:** o CLI copia o código de cada componente para o repo, e o estilo é Tailwind. A instalação no Vite é `tailwindcss` + `@tailwindcss/vite`, ou `shadcn init` com escolha de `--base` (radix ou base) [S4]. **Alta.**
- **Duas bases:** cada componente tem doc `radix` e `base`; a doc padrão mostra `base: base` [S2]. **Alta.**
  - **Radix:** o Drawer aponta para `vaul.emilkowal.ski` [S2]. O Vaul (1.1.2, 14/12/2024) diz "This repo is unmaintained" [S8][N1].
  - **Base UI:** Drawer, Sheet e Toast apontam para a doc do Base UI (Drawer "with swipe-to-dismiss gestures") [S2][B3].
- **OTP:** o componente Input OTP é feito sobre `input-otp` [S3], que é **um único campo**. O README justifica: "SMS autofill — `autocomplete="one-time-code"` only means something on a single field" e "Screen readers — one control, one name, one value" [I1]. O `inputMode` padrão é `'numeric'` [I1]. **Alta.**
- **Temas:** variáveis CSS (`tailwind.cssVariables: true` por padrão; exemplo `--primary: oklch(0.205 0 0)`) [S5]. Cor, raio e tipografia ficam num CSS que dá para revisar. **Alta.**
- **Agentes:** `llms.txt`, MCP Server ("browse, search, and install components from registries") e skill oficial [S6]. **Alta.**
- **Revisão:** o código copiado é nosso. Revisar cada componente é ler um `.tsx` com classes Tailwind, sem runtime de estilo **(inferência)**.
- **Radix tem OTP próprio** ("One-Time Password Field", em Preview) no menu da doc [R1]. Não li a página.

### 3.2 Base UI (sozinho)

- `@base-ui/react` 1.9.0, renomeado de `@base-ui-components/react` (a doc pede para usar o nome novo) [B1][N1].
- Acessibilidade: segue o APG e gerencia foco e teclado [B1]. **Alta.**
- `OTPField`: uma caixa por caractere, com `aria-label="Character N of 6"` nas caixas seguintes [B2]. O `autoComplete` tem padrão `'one-time-code'`, aplicado "to the first slot and hidden validation input" (tipos do pacote 1.9.0) [B2]. **Alta.**
- Tem `peerDependencies` opcionais de `date-fns` e `@date-fns/tz` [N1].

### 3.3 Mantine

- "All Mantine components use CSS modules for styling" [M2]. Usa `postcss-preset-mantine` [M1]. **Alta.**
- `PinInput`: a doc diz "Inputs do not have associated labels. Set `aria-label`". O `oneTimeCode` liga `autocomplete="one-time-code"` [M3]. No código 9.8.2, o padrão sem a prop é `autoComplete: "off"` [M3]. **Alta.**
- Fonte: a doc mostra `@font-face` com `.woff2` local e `createTheme({ fontFamily })` [M4]. **Alta.**
- Agentes: `llms.txt` com 47 KB [M1]. **Não achei MCP oficial.**
- Exige React ≥ 19.2 [N1]. O projeto usa 19.3.1, então cabe.

### 3.4 Chakra UI v3

- "Today, Chakra UI uses Emotion at runtime" [C1]. O roteiro aponta para um modelo sem runtime inspirado no Panda, sem data [C1]. **Alta.**
- Emotion injeta `<style>`; com CSP estrita é preciso `'unsafe-inline'` ou nonce [C1]. **Alta.**
- MCP oficial [C1]. Foi o maior bundle medido (+97 KB gzip).

### 3.5 React Aria Components

- Acessibilidade, i18n e interação como princípios. "Tested across a variety of devices, browsers, and screen readers": VoiceOver (macOS e iOS), JAWS, NVDA e TalkBack [A1]. **Alta.**
- Textos traduzidos para 30+ idiomas, inclusive **Portuguese (Brazil) (`pt-BR`)** [A1]. **Alta.**
- `Sheet` (desde 1.22): "swipeable overlay [...] built on native browser scroll gestures", com "software keyboard awareness" [A3]. **Alta.**
- Toast ainda é `UNSTABLE_` [A3]. **Não tem componente de OTP** na lista do `llms.txt` [A3].
- Sem estilo: precisamos de Tailwind ou CSS próprio. Há starter kits com Tailwind citados na doc [A3].
- Agentes: skill (`npx skills add https://react-aria.adobe.com`) e MCP (`npx @react-aria/mcp@latest`) [A2]. **Alta.**

### 3.6 Park UI e Ark UI

- Park UI: "Beautifully designed components built with Ark UI and Panda CSS" [P1].
  - O site anuncia "Park UI × Chakra — It's official!" [P1].
  - O preset npm não sai desde 22/11/2024, e o último push foi em 10/04/2026 [N1][G1].
  - O Panda "generates plain atomic CSS at build time". O `codegen` escreve o pacote `styled-system/` que o código importa [P2]. **Alta.**
- Ark UI: o PinInput tem `otp` ("signals to its fields that they should use `autocomplete="one-time-code"`") e é um input por dígito [K1]. Tem MCP [K1]. **Alta.**
- Risco: Park UI parado, com codegen e `llms.txt` ausente (404) **(inferência)**.

## 4. Tamanho do bundle (medido)

**Método:** Vite 8.3.8 + `@vitejs/plugin-react` 6.3.0, React 19.3.1, `vite build` padrão (minificado). Mediu-se `gzip -9` da soma dos `.js` e `.css`. Para cada lib, uma página que importa Dialog/Drawer, Toast, um campo com rótulo e o OTP (quando existe), e renderiza parte deles. O "baseline" é só React + ReactDOM renderizando um `<button>`. 1 KB = 1.000 bytes.

| Entrada | JS min | JS gzip | CSS gzip | Acima do React (gzip) | Transferência extra em Slow 4G (1.638,4 kbps) [LH] |
|---|---|---|---|---|---|
| React 19 só (baseline) | 219 KB | 67,7 KB | 0 | n/a | n/a (o baseline leva ~0,33 s) |
| Radix (`Dialog`, `Label`) + Vaul + Sonner + input-otp | 332 KB | 100,5 KB | 0 | +32,9 KB | ~0,16 s |
| Base UI (`Dialog`, `Drawer`, `Toast`, `OTPField`, `Field`) | 397 KB | 126,9 KB | 0 | +59,2 KB | ~0,29 s |
| Mantine (`Button`, `Drawer`, `PinInput`, `TextInput` + `styles.css` inteiro) | 339 KB | 102,9 KB | 36,2 KB (253 KB sem compressão) | +71,4 KB | ~0,35 s |
| Chakra (`Button`, `Drawer`, `PinInput`, `Field`, `Toaster`, `defaultSystem`) | 588 KB | 164,5 KB | 0 (CSS via Emotion no JS) | +96,9 KB | ~0,47 s |
| React Aria (`Button`, `Modal`, `Dialog`, `Sheet`, `TextField`, Toast) | 334 KB | 102,6 KB | 0 | +34,9 KB | ~0,17 s |
| Ark (`Dialog`, `Drawer`, `Field`, `PinInput`, `Toast`) | 371 KB | 112,2 KB | 0 | +44,6 KB | ~0,22 s |

Limites da medição:

- shadcn, React Aria e Ark aparecem **sem o CSS do Tailwind**, que depende das classes usadas e não foi medido.
- No Base UI, importei os namespaces inteiros (todas as subpartes de Dialog, Drawer, Toast e OTPField). Isso pode explicar parte da diferença para o Radix. **(inferência)**
- O Mantine permite importar CSS por componente em vez do `styles.css` inteiro. Não medi essa opção.
- A coluna de tempo é só bytes ÷ banda. Ignora RTT, parse e CPU, e o Lighthouse ainda aplica 4x de lentidão de CPU no celular [LH]. **(inferência)**

## 5. Fontes e ícones servidos pelo próprio app

- **shadcn:** no código do registry, "Other frameworks will use fontsource for now". A dependência vira `@fontsource-variable/${fontName}`, com `@import` no CSS. O caminho do Google (`next/font/google`) só vale para Next [S7]. **Alta.**
- **Risco no shadcn:** a doc de registry tem exemplo de item com `"@import url(\"https://fonts.googleapis.com/css2?family=Inter...\")"` [S7]. Um item de registry de terceiro (inclusive os do design.how, seção 8) pode trazer CDN junto **(inferência)**. Precisa entrar no checklist de revisão.
- **Fontsource:** `@fontsource-variable/inter` 5.3.0 (19/07/2026), 13,1 mi de downloads/semana [N1]. Os arquivos vêm do npm e são servidos pelo nosso Hono **(inferência)**.
- **Mantine:** a doc de fonte no Vite usa arquivos locais [M4]. Por padrão, usa a pilha de fontes do sistema (`DEFAULT_THEME.fontFamily`) [M4].
- **Ícones:** `lucide-react` 1.77.0 (20/11/2026), 143 mi de downloads/semana, componentes React no bundle, sem CDN [N1].
- **Pilha de sistema:** `system-ui` evita baixar fonte (citado em jakubkrehel/better-typography) [JK]. É a opção mais leve para 4G **(inferência)**.

## 6. Acessibilidade: o que se aplica a um app brasileiro privado

### 6.1 WCAG 2.2 (W3C Recommendation, 12/12/2024) [W1]

- **2.5.8 Target Size (Minimum), AA:** "The size of the target for pointer inputs is at least 24 by 24 CSS pixels". As exceções são Spacing, Equivalent, Inline, User Agent Control e Essential. **Alta.**
- **1.4.3 Contrast (Minimum), AA:** 4,5:1, ou 3:1 para texto grande. **1.4.11 Non-text Contrast, AA:** 3:1 para componente e estado. **Alta.**
- 44×44 é AAA (2.5.5) e convenção de plataforma (Apple 44 pt, Material 48 dp), não AA. Isso está resumido em jakubkrehel/better-accessibility [JK]. **Média** para os números de plataforma, que não li na fonte.

### 6.2 Lei Brasileira de Inclusão (Lei 13.146/2015), art. 63 [L1]

- Texto: "É obrigatória a acessibilidade nos sítios da internet mantidos por empresas com sede ou representação comercial no País ou por órgãos de governo, para uso da pessoa com deficiência, garantindo-lhe acesso às informações disponíveis, conforme as melhores práticas e diretrizes de acessibilidade adotadas internacionalmente." O § 1º diz: "Os sítios devem conter símbolo de acessibilidade em destaque." **Alta.**
- O art. 3º, I, define acessibilidade incluindo "informação e comunicação, inclusive seus sistemas e tecnologias" [L1]. **Alta.**
- **PWA é "sítio da internet"?** O PWA é servido por URL (`*.run.app`), então parece cair em "sítio" mais facilmente que um app de loja **(inferência)**.
- **"Empresa"?** Hoje o controlador é pessoa física ([ADR 0005](../adr/0005-aplicacao-hospedada-no-brasil.md)). Se uma pessoa física "mantém" o sítio, a literalidade de "empresas" pode não alcançá-la. Isso muda se o Passaly virar empresa ou MEI. **(inferência; pergunta para advogado)**
- "Melhores práticas [...] adotadas internacionalmente" aponta, na prática, para a WCAG **(inferência)**.

### 6.3 eMAG [E1]

- Portaria SLTI/MP nº 3, de 07/05/2007, art. 1º, § 1º: eMAG "de adoção compulsória pelos órgãos e entidades integrantes do [...] SISP". **Alta.**
- § 2º: disseminação "por meio da adesão voluntária" de estados, municípios, DF "e às pessoas jurídicas de direito privado que mantenham relacionamento por meio eletrônico com a Administração Pública Federal". **Alta.**
- Conclusão: **para o Passaly, o eMAG é referência, não obrigação** **(inferência)**. Um relatório da SGD citado no buscador fala em trocar o eMAG pela WCAG, sem confirmação de norma [índice de busca]. **Baixa.**

### 6.4 ABNT NBR 17225:2025 [T1]

- Título: "Acessibilidade em conteúdo e aplicações web — Requisitos". Primeira edição em 11/03/2025. **Alta** (li a cópia em PDF hospedada pela Câmara).
- Escopo: "requisitos de acessibilidade para websites". Nota: as diretrizes adotadas "são as [...] WCAG 2.2". Os requisitos correspondem aos níveis A e AA; o AAA entra como recomendação (seção 4). **Alta.**
- **5.8.7 Área de acionamento (mínima), Requisito:** "pelo menos 24 pixels CSS de altura e largura", com as mesmas exceções do 2.5.8. **Alta.**
- Status jurídico, nas palavras do prefácio: "Os Documentos Técnicos ABNT [...] são voluntários e não incluem requisitos contratuais, legais ou estatutários", mas "podem ser objeto de citação em Regulamentos Técnicos". **Alta.**
- Ela cita como referência normativa a **ABNT NBR 17060, "Acessibilidade em aplicativos de dispositivos móveis"**. **Não li a NBR 17060.**

## 7. UX do código por SMS no celular

Complementa [pesquisa-sms-otp.md](pesquisa-sms-otp.md) (fornecedor, preço, DPA) e o [ADR 0010](../adr/0010-sms-pela-twilio-verify.md).

- **Marcação:**
  - `autocomplete="one-time-code"`, na spec HTML: "One-time code used for verifying user identity", tipo "Password" [H2]. **Alta.**
  - `inputmode="numeric"`: "virtual keyboard capable of numeric input. This keyword is useful for PIN entry" [H2]. **Alta.**
- **O guia do Chrome para OTP por SMS** [O4] (escrito para agentes de IA) recomenda:
  - `type="text"` + `inputmode="numeric"`, e nunca `type="number"` (perde zero à esquerda);
  - **um só `<input>`**: "Multi-box OTP patterns [...] break native `autocomplete="one-time-code"` autofill in many browsers, hinder copy-pasting, and complicate screen reader navigation";
  - instrução **acima** do campo, para o teclado não cobrir;
  - fonte ≥ 16 px, para o navegador do celular não dar zoom.
  - **Alta.**
- **Formato do SMS** [O2][O4]:
  - a última linha leva `@host #codigo`, por exemplo `@passaly-xxxx.run.app #123456`;
  - o texto legível vem antes;
  - sem esquema, porta ou caminho no host;
  - nada depois da última linha.
  - O mesmo formato serve à WebOTP (Chrome Android) e ao autofill do Safari, que só sugere o código se o domínio bater [O4]. **Alta.**
- **WebOTP API** [O1][O3]:
  - spec WICG "Draft Community Group Report", 13/04/2021;
  - suporte (BCD): Chrome Android 84, Chrome desktop 93; Firefox e Safari "false"; WebView Android "false"; marcada como `experimental` [O3].
  - Uso: `navigator.credentials.get({ otp: { transport: ['sms'] }, signal })`, com `AbortController` e `form.requestSubmit()` [O4]. A spec manda validar o código no servidor [O1].
  - **Alta.**
- **Twilio Verify** [O5]:
  - "Custom templates can be used to support SMS domain-bound codes with the WebOTP API" (exemplo `@example.com #123456`);
  - custom templates "are available on a case-by-case basis";
  - os templates pré-aprovados só têm `{{friendly_name}}`, `{{code}}` e `{{ttl}}`, sem domínio.
  - **Alta.**
  - Sem o template, o autofill do teclado iOS e Android ainda pode sugerir o código por heurística, mas sem amarrar ao domínio **(inferência; não testei)**.
- **Domínio:** o código fica amarrado ao host. Trocar `*.run.app` por domínio próprio ([ADR 0009](../adr/0009-hospedagem-cloud-run-neon-gcs-em-sao-paulo.md)) exige trocar o template **(inferência)**.
- **Como cada lib lida com OTP:**
  - campo único: shadcn/input-otp [I1];
  - caixas por dígito: Base UI `OTPField` (padrão `one-time-code`) [B2], Mantine `PinInput` (`oneTimeCode` opcional; padrão `off`) [M3], Ark/Chakra `PinInput` (`otp` opcional) [K1];
  - nenhum componente: React Aria (usar `TextField` + atributos) [A3].

## 8. Skills de design para agentes

Repositórios clonados em 20/11/2026: design.how `1ce5304`, impeccable `b49177d`, jakubkrehel/skills `672ae44`, ui-ux-pro-max `2de1134`, anthropics/skills `e4bb5d9`.

### 8.1 Tabela-resumo

| Skill | Scripts / rede | Fontes / CDN | Conflito com AGENTS.md / ADRs | Recomendação **(inferência)** |
|---|---|---|---|---|
| **design.how** (arla6ka) [DH] | Node + Playwright/Chromium para capturas; `make-font` busca na API do Fontsource, no GitHub `google/fonts` e no **jsDelivr**; `make-logo` busca no Are.na e no Openverse | sistema "Lime": `@import url("https://fonts.googleapis.com/...Hanken+Grotesk...")`; "Sodium": `@font-face` com `src: url("https://design.how/fonts/...")` | Google Fonts/CDN de terceiro; "A repo with no UI yet is out of scope" (design-system-boss); fluxo próprio de branch e commits | **Descartar agora**; aproveitar critérios. Reavaliar `ui-review` quando houver telas |
| **impeccable** (pbakaus) [IM] | binário próprio baixado para `~/.impeccable/bin/`; hook que roda o detector a cada edição de UI; **telemetria ligada por padrão** (desliga com `DO_NOT_TRACK=1`); busca "visual directions" em `impeccable.style` mesmo com telemetria desligada; modo `live` pode chamar `claude` com `--permission-mode bypassPermissions` | `font-fetch` baixa WOFF2 do Google Fonts para o projeto (self-host; a máquina do dev fala com o Google, o usuário não) | rede e telemetria para terceiro durante o desenvolvimento; hook automático; bypass de permissões | **Descartar instalação**; aproveitar critérios ("Operate" mode, craft floor) |
| **jakubkrehel/skills** [JK] | as skills de design são Markdown, sem script; `explain-interface` usa `curl` em URL dada pelo usuário; `afk`/`upskill` são acionadas pelo usuário (não li a fundo) | nenhuma; `better-typography` sugere `system-ui` e `.woff2` | nenhum direto; texto em inglês | **Melhor candidata** a instalar só um subconjunto (`better-accessibility`, `interface-review`) depois do grill; senão, aproveitar critérios |
| **anthropics frontend-design** [AN] | nenhum script, nenhuma rede | não manda fonte específica; pede "typefaces deliberately, not the default families" | foco em landing e "aesthetic risk", não em app de tarefa; pede screenshots | **Só aproveitar critérios** (quality floor, escrita de interface); vale para a landing |
| **ui-ux-pro-max** (nextlevelbuilder) [UX] | Python local (`search.py`, `design_system.py`); `validate_data.py` usa `urllib`; `preview.py` gera HTML com `<link>` para `fonts.googleapis.com`/`fonts.gstatic.com` | `typography.csv`: **74 de 74** pares com `@import url('https://fonts.googleapis.com/...')` | Google Fonts como padrão dos dados; instala por CLI global (`npm i -g ui-ux-pro-max-cli`) | **Descartar**; aproveitar a lista de prioridades (a11y > toque > performance) |

### 8.2 Por skill

**design.how** [DH]

- **Regras:**
  - "Invent no colour, font, shadow [...] value it does not already have";
  - tokens por papel;
  - "taste.md" com proibições opcionais: caixa alta, separador de ponto, travessão, exclamação, emoji, degradê;
  - tudo vira regra de checagem vista falhando antes de valer;
  - "Wrong: `{saving ? "Saving..." : "Save"}`. Right: the idle label stays, a spinner sits inside the same box, `aria-busy` is set."
- **Conflitos:**
  - os sistemas se instalam por `npx shadcn add https://design.how/r/...` e trazem fonte de CDN (Lime/Sodium);
  - a skill corta branch própria e grava em `.design-system/`, o que diverge do nosso fluxo `/implement` **(inferência)**;
  - pressupõe app com UI existente.
- **Entra no guia:** tokens por papel, estado de carregamento sem trocar o rótulo, proibições de copy como opção.
- **Fica fora:** os sistemas visuais deles, o `make-font` e o `make-logo`.

**impeccable** [IM]

- **Regras:**
  - modos (Persuade, Operate, Read, Experience): em "Operate", "Scanability, consistency, native expectations [...] outrank expression";
  - craft floor: contraste ≥ 4,5:1 e "Source and self-host a face".
- **Rede:**
  - o README declara que, ao começar um design novo, "the skill fetches a set of visual directions from the impeccable.style catalog";
  - desligar a telemetria "doesn't stop that request";
  - o modo live pode rodar `claude` com "approvals, permission checks, and sandboxing off".
- **Conflitos:** chamada de rede e telemetria a terceiro no desenvolvimento. O hook automático vai contra "skills de comando acionadas só pelo usuário" **(inferência)**. Pede binário fora do repo.
- **Entra no guia:** o modo Operate para as telas internas, contraste e auto-hospedagem de fonte.

**jakubkrehel/skills** [JK]

- **Regras:**
  - cada achado cita critério WCAG 2.2 A/AA;
  - 44/40 px são "heuristics", não AA;
  - `:focus-visible`;
  - nada de `outline: none` sem substituto;
  - foco não pode ficar escondido atrás de cabeçalho fixo (2.4.11);
  - "2FA code | `one-time-code`";
  - "OTP / PIN [...] `type="text" inputmode="numeric"`".
- **Conflitos:** nenhum encontrado.
- **Entra no guia:** quase tudo de acessibilidade, área de toque e formulário.
- **Fica fora:** `afk` (trabalho autônomo), que não combina com revisão por uma pessoa **(inferência)**.

**anthropics/skills frontend-design** [AN]

- **Regras:**
  - evitar os padrões típicos de página gerada (fundo creme com acento terracota, kit de cards SaaS, eyebrow em caixa alta);
  - "Build to a quality floor [...] responsive down to mobile, visible keyboard focus, reduced motion respected";
  - escrita: voz ativa, CTA que diz o que acontece, erro que explica como corrigir.
- **Conflitos:** nenhum técnico. A ênfase em "aesthetic risk" e em hero não serve às telas de tarefa **(inferência)**.
- **Entra no guia:** a parte de escrita e o piso de qualidade.

**ui-ux-pro-max** [UX]

- **Regras:** tabela de prioridades (Accessibility e Touch "CRITICAL", "Min size 44×44px, 8px+ spacing"), "Base 16px", "Bottom nav ≤5", "SVG icons (no emoji)".
- **Conflitos:** os dados de tipografia empurram Google Fonts por `@import` e o `preview.py` linka o Google. Instala por CLI global.
- **Entra no guia:** a checklist de toque e formulário.
- **Fica fora:** pares de fontes e paletas.

## 9. Referência visual

Arquivo: [`referencias-design/ref-landingpage.jpeg`](referencias-design/ref-landingpage.jpeg) (3033×4096). O usuário disse que é referência **só para a landing page**, não para as telas internas, e que o que importa é o **layout**.

**Descartados por escolha do usuário:** degradê no texto, borda em degradê e fonte de display com cortes stencil/ink-trap.

### 9.1 Blocos do layout e como ficam no celular **(inferência)**

| Bloco (desktop) | No celular |
|---|---|
| Navegação enxuta: logo, 4 links, "Sign in" e CTA primário | logo + um CTA ("Entrar"); links num menu (Sheet/Drawer) ou fora da landing |
| Eyebrow (selo acima do título) | igual, numa linha curta; texto ≥ 4,5:1 |
| Título centralizado curto (3 linhas) | 2 a 4 linhas; tamanho fluido (`clamp`) |
| Dois CTAs lado a lado (primário cheio, secundário com borda) | empilhados em largura total, primário em cima, ao alcance do polegar; altura ≥ 44 px (≥ 24 px é o mínimo AA) [W1] |
| Imagem hero grande com UI do produto sobreposta (painel de vidro fosco) | imagem recortada em retrato; o painel vira um print real da tela do Passaly abaixo ou sobre a imagem, com fundo opaco |
| Faixa de prova social (logos) | não se aplica; substituir (ver lacunas) |
| Recursos: eyebrow + título + grade de 3 cards (imagem + trecho de UI) | 1 coluna (ou carrossel com scroll-snap); cada card = imagem + frase + mini-UI |
| Linhas de grade sutis no fundo | podem ficar como SVG/CSS leve, ou sair; são decorativas |

### 9.2 Com que custo **(inferência)**

- Todos os blocos são layout de página, não componente interativo. **Tailwind puro** (grid, `aspect-ratio`, `backdrop-blur` [TW], `rounded-none` [TW]) entrega a landing sem lib de componentes.
- Se a landing for uma rota do mesmo SPA, os botões e o Sheet do menu podem ser os mesmos componentes shadcn das telas internas, sem custo extra.
- No Mantine ou no Chakra, o layout é possível, mas mistura o sistema de estilo da lib com CSS da landing.
- A "UI sobreposta" deve ser screenshot (AVIF/WebP) ou HTML real. HTML real é mais leve e acessível, mas dá mais trabalho.

### 9.3 Risco mantido: contraste de texto sobre imagem ou vidro fosco

- WCAG 1.4.3 exige 4,5:1 para texto normal [W1]. Sobre imagem colorida, o contraste muda ponto a ponto.
- Amostrei pixels do JPEG (aproximado; compressão e antisserrilhado distorcem) nos painéis da referência: "Order Status", "Preset Settings", "Model", "Tone". O texto branco sobre o vidro escurecido deu entre ~5,5:1 e ~11:1. **Passa nesses pontos porque o painel é escuro e quase opaco.**
- Se o Passaly aproveitar UI sobre imagem: painel com fundo opaco o bastante e `backdrop-blur` só como enfeite. Conferir o contraste no pior ponto da imagem, e no celular, onde o recorte muda **(inferência)**.

### 9.4 O que aproveitar e o que descartar para pais da Ilha **(inferência)**

- **Aproveitar:** a estrutura (eyebrow → título curto → 2 CTAs → imagem com a tela do produto → 3 recursos), a hierarquia clara e muito espaço em branco.
- **Descartar:**
  - a fileira de logos de clientes;
  - "Backed by Y Combinator";
  - a ilustração 3D saturada (pesa em 4G e não conversa com o tema);
  - o eyebrow em caixa alta espaçada (a skill da Anthropic lista isso como padrão de página gerada [AN]).
- **Peso em 4G:** o hero e os 3 cards são as maiores imagens. Usar AVIF/WebP com `srcset`/`sizes` e `loading="lazy"` abaixo da dobra. Sem animação automática ou, se houver, respeitar `prefers-reduced-motion`.

## 10. Recomendação **(inferência / opinião)**

**shadcn/ui na variante Base UI + Tailwind v4.** Junto: `input-otp` para o código, fonte por `@fontsource-variable` (ou `system-ui`), ícones `lucide-react`, e React Aria como plano B para componentes onde a acessibilidade no celular pesar mais.

- **Por quê:**
  - sem runtime de estilo nem codegen;
  - código revisável no repo;
  - Drawer mantido (o Vaul do Radix não é);
  - OTP em campo único, como pede o Chrome;
  - tokens em variáveis CSS;
  - melhor suporte para agentes (MCP, skill, `llms.txt`);
  - o mesmo Tailwind serve à landing.
- **Trade-off principal:**
  - o código copiado vira **nosso** para manter (correção de acessibilidade upstream não chega sozinha);
  - o Base UI pesou mais que o Radix na medição (+59 contra +33 KB);
  - só o React Aria **documenta** teste com VoiceOver iOS e TalkBack e traz `pt-BR` pronto, mas exige estilizar tudo e não tem OTP nem Toast estável.
- **Se preferir não copiar código:** o Mantine é a alternativa sem mágica. O custo é o `PinInput` em caixas e o CSS global de 36 KB gzip.
- **Descartados:**
  - Chakra (Emotion em runtime + CSP + maior bundle);
  - Park UI (parado, codegen).

## 11. Lacunas e perguntas abertas para o grill

1. **ADR "lib de UI escolhida":**
   - shadcn (Base UI) × shadcn (Radix) × Mantine × React Aria;
   - aceitamos manter código copiado?
2. **ADR "fontes self-hosted, sem CDN":**
   - `system-ui` (zero download) ou fonte própria via Fontsource?
   - Regra de revisão: nenhum `@import url(https://...)` no CSS e nenhum item de registry com CDN.
   - Vale checagem automática no Biome/CI?
3. **Tipografia e paleta da marca:** quais substituem as da referência (sem degradê e sem stencil)? Quem decide?
4. **Prova social:** o que entra no lugar dos logos? Depoimentos de pais do bairro, número de itens doados, Entregas concluídas? Como fica isso com a LGPD (consentimento para depoimento)?
5. **A landing:** é página separada ou rota pública do mesmo SPA? Ela precisa de SEO? O [ADR 0008](../adr/0008-spa-com-hono-sem-ssr.md) assume app atrás de login e sem SEO.
6. **Ilustrações:**
   - Quem faz? Foto real, ilustração encomendada ou banco livre?
   - Gerar imagem com IA **durante o design** conflita com "nada de IA" do AGENTS.md? A regra parece mirar serviço em produção. Confirmar.
7. **Área de toque:** adotar 44 px (convenção de plataforma) ou só os 24 px do AA? E isso vira token?
8. **OTP:**
   - pedir à Twilio o template customizado com `@dominio #codigo`?
   - Vale o esforço com o domínio `*.run.app` provisório?
   - Ligar a WebOTP (só Chrome Android)?
9. **Selo de acessibilidade:** o § 1º do art. 63 da LBI pede "símbolo de acessibilidade em destaque". Vale para o Passaly como pessoa física? Pergunta para advogado.
10. **NBR 17060** (apps móveis): ler antes de declarar conformidade. Não li.
11. **Teste com leitor de tela:** quem testa com TalkBack (Android é o mais provável no público) antes do protótipo?
12. **Skills:** instalar só `better-accessibility` e `interface-review` de jakubkrehel/skills, ou só copiar critérios para um `docs/guia-de-design.md`?
13. **Não confirmado:** se o `defaultSystem` do Chakra e o Park UI puxam fonte remota; se o Mantine tem MCP oficial; peso do CSS do Tailwind nas telas reais.

## 12. Fontes (acesso em 2026-11-20)

Registro e repositórios:
- [N1] npm registry: `npm view <pacote> version peerDependencies time --json` e https://api.npmjs.org/downloads/point/last-week/<pacote> (semana 2026-11-13 a 2026-11-19). Pacotes: shadcn, radix-ui, @radix-ui/react-dialog, @base-ui/react, @base-ui-components/react, @mantine/core, @chakra-ui/react, @emotion/react, react-aria-components, @ark-ui/react, @park-ui/panda-preset, @park-ui/cli, @pandacss/dev, tailwindcss, input-otp, vaul, sonner, lucide-react, @fontsource-variable/inter, @heroui/react.
- [G1] GitHub API, `gh api repos/<owner>/<repo>` (stargazers, pushed_at): shadcn-ui/ui, radix-ui/primitives, mui/base-ui, mantinedev/mantine, chakra-ui/chakra-ui, adobe/react-spectrum, chakra-ui/ark, chakra-ui/park-ui, guilhermerodz/input-otp, emilkowalski/vaul, emilkowalski/sonner, lucide-icons/lucide, fontsource/fontsource, heroui-inc/heroui.

shadcn / Radix / Vaul / input-otp:
- [S1] shadcn/ui, llms.txt. https://ui.shadcn.com/llms.txt
- [S2] shadcn/ui, Drawer (bases `base` e `radix`) e Sheet/Sonner. https://ui.shadcn.com/docs/components/base/drawer.md ; https://ui.shadcn.com/docs/components/radix/drawer.md ; https://ui.shadcn.com/docs/components/sheet.md ; https://ui.shadcn.com/docs/components/sonner.md
- [S3] shadcn/ui, Input OTP. https://ui.shadcn.com/docs/components/input-otp.md
- [S4] shadcn/ui, Installation: Vite. https://ui.shadcn.com/docs/installation/vite.md
- [S5] shadcn/ui, Theming. https://ui.shadcn.com/docs/theming.md
- [S6] shadcn/ui, MCP Server e Skills. https://ui.shadcn.com/docs/mcp ; https://ui.shadcn.com/docs/skills
- [S7] shadcn-ui/ui, código: `packages/registry/src/updaters/update-fonts.ts` e `apps/v4/content/docs/registry/examples.mdx`. https://github.com/shadcn-ui/ui/blob/main/packages/registry/src/updaters/update-fonts.ts ; https://github.com/shadcn-ui/ui/blob/main/apps/v4/content/docs/registry/examples.mdx
- [S8] emilkowalski/vaul, README. https://github.com/emilkowalski/vaul
- [R1] Radix Primitives, Accessibility. https://www.radix-ui.com/primitives/docs/overview/accessibility
- [I1] guilhermerodz/input-otp, README. https://github.com/guilhermerodz/input-otp

Base UI, Mantine, Chakra, React Aria, Ark/Park, Panda, HeroUI:
- [B1] Base UI, Accessibility. https://base-ui.com/react/overview/accessibility.md
- [B2] Base UI, OTP Field (doc e tipos `otp-field/root/OTPFieldRoot.d.ts` do pacote 1.9.0). https://base-ui.com/react/components/otp-field.md
- [B3] Base UI, llms.txt. https://base-ui.com/llms.txt
- [M1] Mantine, llms.txt. https://mantine.dev/llms.txt
- [M2] Mantine, CSS modules. https://mantine.dev/llms/styles-css-modules.md
- [M3] Mantine, PinInput (doc e `esm/components/PinInput/PinInput.mjs` do pacote 9.8.2). https://mantine.dev/llms/core-pin-input.md
- [M4] Mantine, How can I load fonts in Vite? e Theme object (`defaultRadius`). https://mantine.dev/llms/q-vite-load-fonts.md ; https://mantine.dev/llms/theming-theme-object.md
- [C1] Chakra UI, llms-full.txt (Styling roadmap, CSP, MCP Server). https://chakra-ui.com/llms-full.txt
- [A1] React Aria, Quality (leitores de tela, locales). https://react-aria.adobe.com/quality.md
- [A2] React Aria, Working with AI. https://react-aria.adobe.com/ai.md
- [A3] React Aria, llms.txt (Sheet, Toast, releases). https://react-aria.adobe.com/llms.txt
- [K1] Ark UI, Pin Input e llms.txt (MCP). https://ark-ui.com/react/docs/components/pin-input ; https://ark-ui.com/llms.txt
- [P1] Park UI, site e repositório. https://park-ui.com/ ; https://github.com/chakra-ui/park-ui
- [P2] Panda CSS, Getting started. https://panda-css.com/docs/overview/getting-started
- [H1] HeroUI, llms.txt. https://heroui.com/llms.txt

Acessibilidade, lei e norma:
- [W1] W3C, WCAG 2.2, Recommendation de 12/12/2024 (SC 1.4.3, 1.4.11, 2.3.3, 2.5.8). https://www.w3.org/TR/WCAG22/
- [L1] Lei nº 13.146/2015 (LBI), arts. 3º e 63. https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13146.htm
- [E1] Portaria SLTI/MP nº 3, de 07/05/2007 (eMAG). https://www.gov.br/governodigital/pt-br/legislacao/portaria3_eMAG1.pdf
- [T1] ABNT NBR 17225:2025, Acessibilidade em conteúdo e aplicações web — Requisitos (cópia em PDF publicada pela Câmara dos Deputados; seções 1, 2, 4, 5.8.7 e prefácio). https://www2.camara.leg.br/a-camara/estruturaadm/gestao-na-camara-dos-deputados/responsabilidade-social-e-ambiental/acessibilidade/pdfs/ABNTNBR17225AcessibilidadeDigitalparaWeb.pdf

OTP no navegador:
- [H2] WHATWG HTML, Autofill (`one-time-code`) e `inputmode`. https://html.spec.whatwg.org/multipage/form-control-infrastructure.html ; https://html.spec.whatwg.org/multipage/interaction.html
- [O1] WICG, WebOTP API (Draft CG Report, 13/04/2021). https://wicg.github.io/web-otp/
- [O2] WICG, Origin-bound one-time codes delivered via SMS (Draft CG Report, 24/03/2021). https://wicg.github.io/sms-one-time-codes/
- [O3] MDN browser-compat-data, `api/OTPCredential.json`; MDN OTPCredential. https://github.com/mdn/browser-compat-data/blob/main/api/OTPCredential.json ; https://developer.mozilla.org/docs/Web/API/OTPCredential
- [O4] Chrome for Developers, SMS OTP form verification. https://developer.chrome.com/docs/modern-web-guidance/guides/forms/sms-otp-form
- [O5] Twilio Docs, Verification templates. https://www.twilio.com/docs/verify/verification-templates

Desempenho e CSS:
- [LH] Lighthouse, Network throttling (Slow 4G: 150 ms RTT, 1.638,4 kbps). https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md
- [TW] Tailwind CSS, background-clip, backdrop-filter-blur, border-radius. https://tailwindcss.com/docs/background-clip ; https://tailwindcss.com/docs/backdrop-filter-blur ; https://tailwindcss.com/docs/border-radius

Skills (lidas no clone, commit indicado):
- [DH] arla6ka/design.how @ `1ce5304` (README, `skills/build-design-system/SKILL.md`, `references/taste.md`, `skills/design-system-boss/SKILL.md`, `systems/*/tokens.css`, `skills/make-font/scripts/find_foundation.py`, `skills/make-logo/scripts/fetch_*.mjs`). https://github.com/arla6ka/design.how
- [IM] pbakaus/impeccable @ `b49177d` (README, `.agents/skills/impeccable/SKILL.md`, `reference/craft-floor.md`, `crates/context/src/telemetry.rs`, `crates/context/src/font_fetch.rs`). https://github.com/pbakaus/impeccable ; https://impeccable.style/docs/
- [JK] jakubkrehel/skills @ `672ae44` (README, `better-accessibility/SKILL.md`, `hit-areas.md`, `forms.md`, `better-typography/choosing-fonts.md`). https://github.com/jakubkrehel/skills
- [AN] anthropics/skills @ `e4bb5d9`, `skills/frontend-design/SKILL.md`. https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md
- [UX] nextlevelbuilder/ui-ux-pro-max-skill @ `2de1134` (README, `.claude/skills/ui-ux-pro-max/SKILL.md`, `data/typography.csv`, `scripts/preview.py`, `scripts/validate_data.py`). https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
