# Guia de UI

Convenções de tela que não chegam a ser ADR. Decididas no grill de UI de 2026-11-20, a partir de [pesquisa-ui.md](descoberta/pesquisa-ui.md). Base: [ADR 0012](adr/0012-shadcn-base-ui-com-tailwind.md) (shadcn/Base UI + Tailwind) e [ADR 0013](adr/0013-nada-de-terceiro-no-navegador.md) (nada de terceiro no navegador).

## Acessibilidade

- Alvo: WCAG 2.2 AA, sem declarar conformidade nem exibir selo até o advogado responder (pergunta 14 de [pesquisa-lgpd.md](descoberta/pesquisa-lgpd.md)).
- Área de toque: token `--alvo-toque: 44px` em botão, ícone clicável, item de lista e campo. 24 px só nas exceções do 2.5.8 (ex.: link dentro de texto).
- Revisão de tela: skill `better-accessibility` (jakubkrehel/skills, commit `672ae44`). Ela trata 44 px como recomendação; aqui é regra do projeto.
- Contraste: texto ≥ 4,5:1 (≥ 3:1 se grande); componente e estado ≥ 3:1. Conferido nos dois temas.
- **Roteiro TalkBack** (critério de aceite de todo ticket de tela, feito pelo fundador num Android): entrar com o código; publicar um Post com foto; fazer um Pedido; combinar e confirmar a Entrega; excluir a conta. Rodar só os passos que a tela do ticket toca. VoiceOver quando houver iPhone à mão.

## Tipografia

- Pilha `system-ui`, nenhuma fonte baixada.
- Corpo com 16 px no mínimo, em `rem` (respeita a fonte do sistema). Testar com fonte grande no Android.
- Quatro tamanhos (pequeno, corpo, subtítulo, título), pesos 400 e 600. Só o título da landing é fluido (`clamp`).

## Cor e tema

- Paleta escolhida pelo fundador entre 3 opções de um protótipo descartável, sem o clichê rosa/azul de bebê. Vira os tokens CSS do shadcn.
- Claro e escuro seguindo o sistema (`prefers-color-scheme`), sem botão de alternar no protótipo.

## Código por SMS

- Um só campo: `type="text"`, `inputmode="numeric"`, `autocomplete="one-time-code"`, instrução acima do campo. Componente `input-otp`.
- Sem WebOTP e sem template `@dominio #codigo` no protótipo ([ADR 0010](adr/0010-sms-pela-twilio-verify.md)).

## Landing

- Rota pública `/` do SPA, sem SEO; prévia do link por Open Graph estático no `index.html`.
- Só para quem não tem sessão. Com sessão, `/` vai direto para a lista de Posts; o `start_url` do manifest aponta para a lista, e sem sessão a lista redireciona para `/`.
- Botões: principal "Entrar com o celular" e secundário "Como funciona" (rola para a seção). Empilhados, largura total, ≥ 44 px, principal em cima. Topo só com logo e "Entrar", sem menu.
- Ordem: título curto + linha de apoio → os 2 botões → tela real em HTML (Post de exemplo com dados fictícios) → faixa de compromissos → "Como funciona" em 3 passos (publica com foto do pacote → alguém pede → vocês combinam num ponto público da Ilha) → rodapé com termos, privacidade e contato do titular. Sem eyebrow em caixa alta e sem grade decorativa.
- Da referência ([ref-landingpage.jpeg](descoberta/referencias-design/ref-landingpage.jpeg)) vale o layout, não o degradê nem a fonte de display.
- Sem prova social no lançamento. No lugar dos logos, uma faixa de compromissos: dados guardados no Brasil; foto só do pacote, nunca de pessoas; sem revenda; só precisa do celular.
- Imagens: nenhuma pessoa, nenhum bebê, nada gerado por IA. Hero com a tela real do Passaly em HTML (fundo opaco); demais imagens são fotos do fundador de pacotes reais, em AVIF/WebP com `srcset` e `loading="lazy"` abaixo da dobra. Ícones `lucide-react`.
- Um número agregado de Entregas, se vier, entra com piso mínimo e nome próprio no glossário.

## Rotas públicas

`/`, `/entrar`, `/termos`, `/privacidade` e a página do art. 17, § 2º, da Res. 19/2024. Todo o resto exige sessão: o visitante não vê Posts (módulo Busca da spec #2). As páginas legais ficam no mesmo SPA, com o mesmo CSP, e o rodapé da landing e a tela de cadastro apontam para elas.

## Texto de interface

- Frase direta, na segunda pessoa ("você"), no vocabulário do [GLOSSARY.md](../GLOSSARY.md): Post, Pedido, Entrega, Ponto de encontro.
- Botão diz a ação que acontece: "Publicar", "Pedir", "Confirmar entrega". Nada de "Continuar" genérico quando há uma ação concreta.
- Erro diz o que houve e o que fazer: "Código errado. Confira o SMS ou peça outro."
- Evitar os vícios de texto gerado:
  - contraste forçado ("Não é só X. É Y.");
  - promessa vaga ("a forma mais fácil", "revolucionar", "experiência única");
  - travessão em toda frase;
  - trincas de adjetivos ("simples, seguro e rápido");
  - título que explica o que a tela já mostra.
- Não prometer o que o Passaly não garante: estado e validade do pacote são declaração do Anunciante (termos de uso da spec #2).
