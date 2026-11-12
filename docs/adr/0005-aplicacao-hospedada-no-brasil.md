---
status: accepted
---

# Aplicação e banco hospedados no Brasil (região de São Paulo)

A aplicação roda na mesma região brasileira do banco, e isso é restrição para a escolha da stack. Hospedar a aplicação nos EUA, mesmo com o banco em São Paulo, é transferência internacional (LGPD art. 33; Res. CD/ANPD 19/2024), e os EUA não têm adequação. Os mecanismos que sobram são frágeis para um controlador pessoa física: cláusulas-padrão só se o provedor já as oferece, consentimento destacado que o usuário pode negar, e "necessidade" do art. 33, IX, fraca quando existe região no Brasil. Ver [pesquisa-lgpd.md](../descoberta/pesquisa-lgpd.md), seção 8.

## Considered Options

- Aplicação nos EUA com banco em São Paulo: rejeitada pela transferência internacional sem mecanismo seguro.

## Consequences

- Os serviços acessórios estrangeiros ficam no mínimo. No protótipo, só o SMS de verificação, e apenas de fornecedor que ofereça as cláusulas-padrão da ANPD (ou fornecedor brasileiro). E-mail, analytics e monitoramento de terceiro, e IA ficam fora.
- Cada serviço estrangeiro que entrar depois exige checar as cláusulas-padrão e publicar a página do art. 17, §2º, da Res. 19/2024.
- Não confirmado: se acesso remoto do suporte de um provedor americano a dados em São Paulo é transferência (pergunta 7 da seção 13 da pesquisa).
