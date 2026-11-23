---
status: accepted
---

# Nada de terceiro no navegador, garantido por CSP

O navegador do usuário só fala com o próprio Passaly e com o link assinado de foto do GCS em São Paulo ([ADR 0009](0009-hospedagem-cloud-run-neon-gcs-em-sao-paulo.md)). Nada de CDN, Google Fonts, script ou imagem de terceiro: cada um desses expõe o IP do usuário a um serviço que a política de privacidade não declara ([ADR 0005](0005-aplicacao-hospedada-no-brasil.md)). Fontes e ícones vêm de pacote npm e são servidos pelo Hono. A garantia é um cabeçalho **CSP estrito** mandado pelo Hono (`default-src 'self'`, com `img-src` liberando só o host do link assinado do GCS e `connect-src 'self'`): se um `@import url("https://...")` escapar, ele não carrega. Uma regra só escrita não bastaria, porque o exemplo da própria doc de registry do shadcn traz `@import` do Google Fonts e agentes de IA copiam isso sem avisar.

## Consequences

- O CI tem um passo que falha se aparecer `url(http` ou `@import url(` em CSS ou TSX, para o problema aparecer no PR e não só no navegador.
- O app usa a pilha `system-ui` (nenhuma fonte a baixar). Uma fonte de marca, se vier, entra por `@fontsource-variable`.
- Toda nova origem no CSP é uma decisão explícita, revista contra a política de privacidade.
