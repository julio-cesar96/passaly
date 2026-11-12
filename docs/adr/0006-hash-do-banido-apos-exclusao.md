---
status: accepted
---

# Hash do telefone do banido é mantido por 1 ano depois da exclusão

Quando um usuário banido pede exclusão da conta, tudo é eliminado, menos um hash do telefone com chave secreta, o motivo e a data do Banimento, por 1 ano a partir da exclusão. Sem isso, o banido apaga a conta e se recadastra no mesmo número, e o Banimento (única sanção do protótipo, já que a verificação é só por telefone) deixa de valer. A base é o legítimo interesse; o prazo é o menor da faixa sugerida pela pesquisa (1 a 2 anos), porque este é o ponto mais incerto dela: a LGPD (art. 16) não lista essa conservação e o Marco Civil (art. 7º, X) garante "exclusão definitiva", ressalvada só a guarda obrigatória. Ver [pesquisa-lgpd.md](../descoberta/pesquisa-lgpd.md), seções 5.2 e 5.3.

## Considered Options

- Eliminar tudo, inclusive o registro do Banimento: rejeitada porque torna o Banimento contornável com uma exclusão.
- Manter o telefone em claro: rejeitada por excesso (art. 6º, III).

## Consequences

- O hash continua sendo dado pessoal (art. 13, §4º). Como telefone tem poucas combinações, hash sem chave secreta seria reversível.
- A retenção precisa constar na política de privacidade e nos termos.
- Ainda não validado com advogado (pergunta 4 da seção 13 da pesquisa). Se a resposta for não, o hash sai e aceita-se que o banido possa voltar.
- Não se aplica à conta de menor de 18 anos, que é excluída sem hash.
