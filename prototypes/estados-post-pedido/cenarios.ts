// PROTÓTIPO DESCARTÁVEL. Roda os cenários e imprime o estado depois de cada passo.
//   node --experimental-strip-types --no-warnings prototypes/estados-post-pedido/cenarios.ts        (todos)
//   node --experimental-strip-types --no-warnings prototypes/estados-post-pedido/cenarios.ts 6      (só o 6)
//   node --experimental-strip-types --no-warnings prototypes/estados-post-pedido/cenarios.ts tabela (só as tabelas)

import { aplicar, estadoInicial, TRANSICOES_PEDIDO, TRANSICOES_POST } from './modelo.ts';
import type { Acao, DecisaoRevisao, Estado, Post } from './modelo.ts';

type Passo = { faz: string; acao: Acao; esperaRecusa?: boolean };
type Cenario = { titulo: string; explica: string; passos: Passo[] };

// ---------- Atalhos em linguagem do domínio ----------
const cadastrar = (...nomes: string[]): Passo[] =>
  nomes.map((n) => ({ faz: `${n} se cadastra`, acao: { tipo: 'cadastrar', usuario: n } }));
const publica = (quem: string, post: string, validadeEm = 500, modalidade: Post['modalidade'] = 'doacao'): Passo => ({
  faz: `${quem} publica o ${post} (${modalidade}, validade em ${validadeEm} h)`,
  acao: { tipo: 'publicarPost', post, por: quem, modalidade, validadeEm },
});
const quer = (quem: string, post: string, pedido: string, contrapartida?: string): Passo => ({
  faz: `${quem} toca em "quero" no ${post} (Pedido ${pedido})${contrapartida ? ` oferecendo o ${contrapartida} como Contrapartida` : ''}`,
  acao: { tipo: 'fazerPedido', pedido, post, por: quem, contrapartida },
});
const aceita = (quem: string, pedido: string): Passo => ({
  faz: `${quem} aceita o Pedido ${pedido}`, acao: { tipo: 'aceitarPedido', pedido, por: quem },
});
const propoe = (quem: string, pedido: string, ponto = 'Ponto 1', horario = 24): Passo => ({
  faz: `${quem} propõe ${ponto}, às ${horario} h`, acao: { tipo: 'proporPontoEHorario', pedido, por: quem, ponto, horario },
});
const fechaPonto = (quem: string, pedido: string): Passo => ({
  faz: `${quem} aceita o ponto e horário`, acao: { tipo: 'aceitarPontoEHorario', pedido, por: quem },
});
const confirma = (quem: string, pedido: string): Passo => ({
  faz: `${quem} confirma a entrega`, acao: { tipo: 'confirmarEntrega', pedido, por: quem },
});
const desiste = (quem: string, pedido: string): Passo => ({
  faz: `${quem} desiste do Pedido ${pedido}`, acao: { tipo: 'desistir', pedido, por: quem },
});
const naoCompareceu = (quem: string, pedido: string, denuncia: string): Passo => ({
  faz: `${quem} declara que o outro lado NÃO COMPARECEU`,
  acao: { tipo: 'declararNaoCompareceu', pedido, por: quem, denuncia },
});
const denuncia = (quem: string, post: string, id: string, motivo: 'pacote-aberto-ou-vencido' | 'suspeita-de-revenda'): Passo => ({
  faz: `${quem} denuncia o ${post}: ${motivo}`, acao: { tipo: 'denunciar', denuncia: id, post, por: quem, motivo },
});
const revisa = (id: string, decisao: DecisaoRevisao): Passo => ({
  faz: `Fundador revisa ${id}:${decisao.post ? ` Post → ${decisao.post}` : ''}${decisao.pedido ? ` Pedido → ${decisao.pedido}` : ''}${decisao.banir ? ` bane ${decisao.banir}` : ''}`,
  acao: { tipo: 'revisarDenuncia', denuncia: id, decisao },
});
const passam = (horas: number): Passo => ({ faz: `passam ${horas} h`, acao: { tipo: 'passarTempo', horas } });
const ilegal = (p: Passo): Passo => ({ ...p, faz: `(tentativa) ${p.faz}`, esperaRecusa: true });

/** Ana publica P1; Bia pede; aceito; combinado no Ponto 1 às 24 h. */
const ateCombinado: Passo[] = [
  ...cadastrar('Ana', 'Bia', 'Caio'),
  publica('Ana', 'P1'),
  quer('Bia', 'P1', 'R1'),
  aceita('Ana', 'R1'),
  propoe('Ana', 'R1'),
  fechaPonto('Bia', 'R1'),
];

// ---------- Cenários ----------
const CENARIOS: Cenario[] = [
  {
    titulo: 'Caminho feliz, com chegada antes do horário',
    explica: 'Combinado para as 24 h; as duas chegam às 20 h e confirmam. Confirmar antes do horário é permitido [D13]. Só a segunda confirmação conclui.',
    passos: [...ateCombinado, passam(20), confirma('Ana', 'R1'), confirma('Bia', 'R1')],
  },
  {
    titulo: 'Vários Pedidos no mesmo Post: fila',
    explica: 'Aceitar um não mexe nos outros [D2]. Se o aceito desiste, o Anunciante escolhe o próximo. Ao concluir, quem sobrou na fila é avisado.',
    passos: [
      ...cadastrar('Ana', 'Bia', 'Caio', 'Duda'),
      publica('Ana', 'P1'),
      quer('Bia', 'P1', 'R1'), quer('Caio', 'P1', 'R2'), quer('Duda', 'P1', 'R3'),
      ilegal(quer('Bia', 'P1', 'R9')),
      aceita('Ana', 'R2'),
      ilegal(aceita('Ana', 'R3')),
      desiste('Caio', 'R2'),
      aceita('Ana', 'R3'), propoe('Ana', 'R3', 'Ponto 2', 48), fechaPonto('Duda', 'R3'),
      confirma('Ana', 'R3'), confirma('Duda', 'R3'),
    ],
  },
  {
    titulo: 'Proposta e contraproposta de ponto e horário',
    explica: 'O Anunciante propõe primeiro; depois as contrapropostas alternam até alguém aceitar [D13].',
    passos: [
      ...cadastrar('Ana', 'Bia'),
      publica('Ana', 'P1'), quer('Bia', 'P1', 'R1'), aceita('Ana', 'R1'),
      ilegal(propoe('Bia', 'R1', 'Ponto 2', 30)),
      propoe('Ana', 'R1', 'Ponto 1', 24),
      ilegal(propoe('Ana', 'R1', 'Ponto 3', 24)),
      propoe('Bia', 'R1', 'Ponto 2', 30),
      propoe('Ana', 'R1', 'Ponto 2', 48),
      ilegal(fechaPonto('Ana', 'R1')),
      fechaPonto('Bia', 'R1'),
    ],
  },
  {
    titulo: 'Anunciante desiste depois de combinar',
    explica: 'Fica registrada uma desistência para Ana, sem outra consequência [D3]. Bia recebe aviso.',
    passos: [...ateCombinado, desiste('Ana', 'R1'), ilegal(confirma('Bia', 'R1'))],
  },
  {
    titulo: 'Interessado desiste depois do aceite',
    explica: 'Do outro lado. Depois de um lado confirmar a entrega, não dá mais para desistir.',
    passos: [
      ...cadastrar('Ana', 'Bia', 'Caio'),
      publica('Ana', 'P1'), quer('Bia', 'P1', 'R1'), aceita('Ana', 'R1'),
      desiste('Bia', 'R1'),
      quer('Caio', 'P1', 'R2'), aceita('Ana', 'R2'), propoe('Ana', 'R2'), fechaPonto('Caio', 'R2'),
      confirma('Ana', 'R2'),
      ilegal(desiste('Caio', 'R2')),
    ],
  },
  {
    titulo: 'Só um lado confirma',
    explica: 'Ana confirma; Bia some. 24 h depois do horário, Bia recebe um aviso para confirmar. O Pedido não conclui sozinho [D4].',
    passos: [...ateCombinado, passam(24), confirma('Ana', 'R1'), passam(20), passam(10), confirma('Bia', 'R1')],
  },
  {
    titulo: '"Entreguei" contra "não compareceu"',
    explica: 'Ana confirma; Bia diz que Ana não veio. A Denúncia é contra Ana e oculta o P1 [D1]. O fundador decide; cancelar não soma no contador [D5].',
    passos: [
      ...ateCombinado,
      confirma('Ana', 'R1'),
      ilegal(naoCompareceu('Bia', 'R1', 'D0')),
      passam(25),
      naoCompareceu('Bia', 'R1', 'D1'),
      ilegal(revisa('D1', { post: 'restaurar' })),
      revisa('D1', { post: 'restaurar', pedido: 'cancelar' }),
    ],
  },
  {
    titulo: 'Anunciante diz que o interessado não compareceu',
    explica: 'A Denúncia é contra Bia; o P1 de Ana não some. O Pedido é cancelado, o P1 volta a ativo e Caio, que estava na fila, pode ser aceito [D1].',
    passos: [
      ...ateCombinado,
      quer('Caio', 'P1', 'R2'),
      passam(25),
      naoCompareceu('Ana', 'R1', 'D1'),
      aceita('Ana', 'R2'),
      revisa('D1', {}),
    ],
  },
  {
    titulo: 'Post denunciado com Pedido combinado: restaurado',
    explica: 'Caio denuncia o P1. O Pedido congela e as duas recebem aviso [D6]. O fundador restaura e o Pedido segue.',
    passos: [
      ...ateCombinado,
      denuncia('Caio', 'P1', 'D1', 'pacote-aberto-ou-vencido'),
      ilegal(confirma('Ana', 'R1')),
      passam(10),
      revisa('D1', { post: 'restaurar' }),
      confirma('Ana', 'R1'), confirma('Bia', 'R1'),
    ],
  },
  {
    titulo: 'Post denunciado com Pedido combinado: removido',
    explica: 'O fundador remove o P1: o Pedido é encerrado e as duas recebem aviso.',
    passos: [...ateCombinado, denuncia('Caio', 'P1', 'D1', 'suspeita-de-revenda'), revisa('D1', { post: 'remover' })],
  },
  {
    titulo: 'Denúncia sem revisão em 24 h',
    explica: 'Passadas 24 h, o P1 volta a aparecer e o Pedido descongela [D7]. A Denúncia continua aberta e o fundador ainda pode remover depois.',
    passos: [
      ...ateCombinado,
      denuncia('Caio', 'P1', 'D1', 'suspeita-de-revenda'),
      passam(30),
      revisa('D1', { post: 'remover' }),
    ],
  },
  {
    titulo: 'Duas Denúncias no mesmo Post',
    explica: 'Restaurar numa não basta: o Post continua oculto enquanto a outra estiver aberta [D8].',
    passos: [
      ...cadastrar('Ana', 'Bia', 'Caio'),
      publica('Ana', 'P1'),
      denuncia('Bia', 'P1', 'D1', 'suspeita-de-revenda'),
      denuncia('Caio', 'P1', 'D2', 'pacote-aberto-ou-vencido'),
      revisa('D1', { post: 'restaurar' }),
      revisa('D2', { post: 'restaurar' }),
    ],
  },
  {
    titulo: 'Validade vence com Pedidos',
    explica: 'O P1 vence em 40 h, com um Pedido combinado (horário 48 h) e um pendente. Os dois são encerrados com aviso [D9].',
    passos: [
      ...cadastrar('Ana', 'Bia', 'Caio'),
      publica('Ana', 'P1', 40),
      quer('Bia', 'P1', 'R1'), quer('Caio', 'P1', 'R2'),
      aceita('Ana', 'R1'), propoe('Ana', 'R1', 'Ponto 1', 48), fechaPonto('Bia', 'R1'),
      passam(41),
      ilegal(confirma('Ana', 'R1')),
    ],
  },
  {
    titulo: 'Validade no passado',
    explica: 'O formulário não aceita data de validade que já passou [D10]. Não é a IA julgando, então não contraria o ADR 0002.',
    passos: [...cadastrar('Ana'), passam(10), ilegal(publica('Ana', 'P1', 5)), publica('Ana', 'P1', 11)],
  },
  {
    titulo: 'Alerta da IA não bloqueia',
    explica: 'A IA sinaliza; o Post continua ativo e visível e o Pedido segue (ADR 0002).',
    passos: [
      ...cadastrar('Ana', 'Bia'),
      publica('Ana', 'P1'),
      { faz: 'IA sinaliza o P1: "foto parece pacote aberto"', acao: { tipo: 'alertaIA', post: 'P1', texto: 'foto parece pacote aberto' } },
      quer('Bia', 'P1', 'R1'), aceita('Ana', 'R1'),
    ],
  },
  {
    titulo: 'Usuária banida com Posts e Pedidos em andamento',
    explica: 'Bia é interessada no P1 (Ana já confirmou a entrega, chegou cedo) e Anunciante do P2 (combinado com Duda) e do P3 (com Caio na fila). O fundador remove o P2 por revenda e bane Bia. Todos com Pedido com Bia recebem aviso [D11].',
    passos: [
      ...cadastrar('Ana', 'Bia', 'Caio', 'Duda'),
      publica('Ana', 'P1'), publica('Bia', 'P2'), publica('Bia', 'P3'),
      quer('Bia', 'P1', 'R1'), aceita('Ana', 'R1'), propoe('Ana', 'R1'), fechaPonto('Bia', 'R1'),
      confirma('Ana', 'R1'),
      quer('Duda', 'P2', 'R2'), aceita('Bia', 'R2'), propoe('Bia', 'R2', 'Ponto 2', 30), fechaPonto('Duda', 'R2'),
      quer('Caio', 'P3', 'R3'),
      denuncia('Caio', 'P2', 'D1', 'suspeita-de-revenda'),
      revisa('D1', { post: 'remover', banir: 'Bia' }),
      ilegal(publica('Bia', 'P4')),
    ],
  },
  {
    titulo: 'Denúncia depois da entrega',
    explica: 'Bia recebe, abre e o pacote está aberto. Se o fundador dá razão, o contador volta só para Ana, a dona do Post [D12].',
    passos: [
      ...ateCombinado,
      confirma('Ana', 'R1'), confirma('Bia', 'R1'),
      denuncia('Bia', 'P1', 'D1', 'pacote-aberto-ou-vencido'),
      revisa('D1', { post: 'remover' }),
    ],
  },
  {
    titulo: 'Troca com Contrapartida',
    explica: 'O P1 de Ana é de Troca. Bia oferece o próprio P2 como Contrapartida [D15]. Aceitar reserva os dois; concluir entrega os dois e conta uma Entrega para cada.',
    passos: [
      ...cadastrar('Ana', 'Bia'),
      publica('Ana', 'P1', 500, 'troca'), publica('Bia', 'P2', 500, 'doacao-ou-troca'),
      ilegal(quer('Bia', 'P1', 'R0')),
      quer('Bia', 'P1', 'R1', 'P2'),
      aceita('Ana', 'R1'), propoe('Ana', 'R1'), fechaPonto('Bia', 'R1'),
      confirma('Ana', 'R1'), confirma('Bia', 'R1'),
    ],
  },
  {
    titulo: 'Troca: a Contrapartida vence antes da entrega',
    explica: 'O P2 de Bia vence às 30 h e a troca estava combinada para as 48 h. O Pedido é encerrado e o P1 de Ana volta a ativo.',
    passos: [
      ...cadastrar('Ana', 'Bia'),
      publica('Ana', 'P1', 500, 'troca'), publica('Bia', 'P2', 30, 'doacao'),
      quer('Bia', 'P1', 'R1', 'P2'),
      aceita('Ana', 'R1'), propoe('Ana', 'R1', 'Ponto 1', 48), fechaPonto('Bia', 'R1'),
      passam(31),
    ],
  },
  {
    titulo: 'Troca: a Contrapartida é denunciada',
    explica: 'Caio denuncia o P2 (a Contrapartida). O Pedido do P1 congela também, mesmo o P1 estando limpo.',
    passos: [
      ...cadastrar('Ana', 'Bia', 'Caio'),
      publica('Ana', 'P1', 500, 'troca'), publica('Bia', 'P2'),
      quer('Bia', 'P1', 'R1', 'P2'),
      aceita('Ana', 'R1'), propoe('Ana', 'R1'), fechaPonto('Bia', 'R1'),
      denuncia('Caio', 'P2', 'D1', 'pacote-aberto-ou-vencido'),
      ilegal(confirma('Ana', 'R1')),
      revisa('D1', { post: 'remover' }),
    ],
  },
  {
    titulo: 'Ações que o modelo deve recusar',
    explica: 'Cada passo aqui deve ser recusado, com o motivo.',
    passos: [
      ...cadastrar('Ana', 'Bia', 'Caio'),
      publica('Ana', 'P1'), publica('Caio', 'P9'),
      ilegal(quer('Ana', 'P1', 'R0')),
      ilegal(quer('Bia', 'P1', 'R0', 'P9')),
      quer('Bia', 'P1', 'R1'),
      ilegal(confirma('Bia', 'R1')),
      ilegal(aceita('Bia', 'R1')),
      aceita('Ana', 'R1'),
      ilegal(propoe('Ana', 'R1', 'Casa da Ana')),
      ilegal(propoe('Ana', 'R1', 'Ponto 1', 25)),
      ilegal(fechaPonto('Bia', 'R1')),
      ilegal({ faz: 'Ana retira o P1', acao: { tipo: 'retirarPost', post: 'P1', por: 'Ana' } }),
      ilegal(denuncia('Ana', 'P1', 'D1', 'suspeita-de-revenda')),
    ],
  },
];

// ---------- Renderização ----------
function linhas(e: Estado): Map<string, string> {
  const m = new Map<string, string>();
  m.set('relogio', `Relógio: ${e.agora} h`);
  for (const u of Object.values(e.usuarios)) {
    m.set(`u:${u.id}`, `  ${u.id.padEnd(5)} entregas concluídas ${u.entregasConcluidas} · desistências ${u.desistenciasAposAceite}${u.banido ? ' · BANIDA(O)' : ''}`);
    u.avisos.forEach((a, i) => m.set(`u:${u.id}:${i}`, `        ✉ ${a}`));
  }
  for (const p of Object.values(e.posts)) {
    const extra = [
      p.ciclo !== 'ativo' && p.ciclo !== 'reservado' ? 'fora da busca' : p.oculto ? 'OCULTO' : 'visível',
      p.reservadoPara ? `para ${p.reservadoPara}` : '',
      ...p.alertas.map((a) => `⚠ ${a}`),
    ].filter(Boolean).join(' · ');
    m.set(`p:${p.id}`, `  ${p.id} de ${p.anunciante} (${p.modalidade}, validade ${p.validadeEm} h): ${p.ciclo.toUpperCase()} · ${extra}`);
  }
  for (const d of Object.values(e.pedidos)) {
    const partes = [
      d.contrapartida ? `Contrapartida ${d.contrapartida}` : '',
      d.combinacao
        ? `${d.combinacao.ponto}, às ${d.combinacao.horario} h`
        : d.proposta ? `proposta de ${d.proposta.por}: ${d.proposta.ponto}, às ${d.proposta.horario} h` : '',
      d.congelado ? 'CONGELADO' : '',
      d.confirmouEntrega.length ? `confirmou: ${d.confirmouEntrega.join(' e ')}` : '',
      d.disseNaoCompareceu.length ? `"não compareceu" dito por: ${d.disseNaoCompareceu.join(' e ')}` : '',
      d.motivoFim ? `(${d.motivoFim})` : '',
      ...d.alertas.map((a) => `⚠ ${a}`),
    ].filter(Boolean);
    m.set(`r:${d.id}`, `  ${d.id} ${d.interessado} → ${d.postId}: ${d.estado.toUpperCase()}${partes.length ? ' · ' + partes.join(' · ') : ''}`);
  }
  for (const x of Object.values(e.denuncias)) {
    const dec = x.decisao;
    const st = dec
      ? `decidida:${dec.post ? ` Post ${dec.post}` : ''}${dec.pedido ? ` Pedido ${dec.pedido}` : ''}${dec.banir ? ` baniu ${dec.banir}` : ''}${!dec.post && !dec.pedido && !dec.banir ? ' arquivada' : ''}`
      : `ABERTA há ${e.agora - x.criadaEm} h${x.atrasada ? ' · ATRASADA' : ''}`;
    m.set(`d:${x.id}`, `  ${x.id} contra ${x.contra}, por ${x.por}, no ${x.postId}${x.pedidoId ? ` (Pedido ${x.pedidoId})` : ''}: ${x.motivo}${x.ocultouPost ? ' · ocultou o Post' : ''} · ${st}`);
  }
  return m;
}

const SECOES: [string, string][] = [['u:', 'Usuários'], ['p:', 'Posts'], ['r:', 'Pedidos'], ['d:', 'Denúncias']];

function imprimir(antes: Map<string, string>, depois: Map<string, string>) {
  const marca = (k: string) => (antes.get(k) !== depois.get(k) ? '» ' : '  ');
  console.log(`${marca('relogio')}${depois.get('relogio')}`);
  for (const [prefixo, nome] of SECOES) {
    const chaves = [...depois.keys()].filter((k) => k.startsWith(prefixo));
    if (!chaves.length) continue;
    console.log(`  ${nome}`);
    for (const k of chaves) console.log(`${marca(k)}${depois.get(k)}`);
  }
}

function rodar(c: Cenario, n: number) {
  console.log(`\n${'═'.repeat(100)}\n${n}. ${c.titulo}\n   ${c.explica}`);
  let e = estadoInicial();
  let problemas = 0;
  for (const p of c.passos) {
    if (p.acao.tipo === 'cadastrar') {
      e = aplicar(e, p.acao).estado;
      continue;
    }
    const antes = linhas(e);
    const r = aplicar(e, p.acao);
    e = r.estado;
    const inesperado = !!r.recusa !== !!p.esperaRecusa;
    if (inesperado) problemas++;
    console.log(`\n▶ ${p.faz}`);
    console.log(r.recusa ? `  ✗ RECUSADO: ${r.recusa}` : '  ✓ feito');
    if (inesperado) console.log(`  ‼ INESPERADO: o cenário esperava ${p.esperaRecusa ? 'recusa' : 'sucesso'}`);
    if (!r.recusa) imprimir(antes, linhas(e));
  }
  return problemas;
}

function tabelas() {
  console.log('Transições de Post (ciclo; "oculto" é um eixo à parte):');
  for (const [de, para] of Object.entries(TRANSICOES_POST)) console.log(`  ${de.padEnd(10)} → ${para.join(', ') || '(final)'}`);
  console.log('\nTransições de Pedido:');
  for (const [de, para] of Object.entries(TRANSICOES_PEDIDO)) console.log(`  ${de.padEnd(23)} → ${para.join(', ') || '(final)'}`);
}

const arg = process.argv[2];
tabelas();
if (arg !== 'tabela') {
  const escolhidos = arg ? [[Number(arg), CENARIOS[Number(arg) - 1]] as const] : CENARIOS.map((c, i) => [i + 1, c] as const);
  let total = 0;
  for (const [n, c] of escolhidos) total += rodar(c, n);
  console.log(`\n${'═'.repeat(100)}\n${total === 0 ? 'Todos os passos se comportaram como esperado.' : `‼ ${total} passo(s) inesperado(s).`}`);
}
