// PROTÓTIPO DESCARTÁVEL. Não é base do app. Ver README.md.
//
// Pergunta: quais são os estados de Post e de Pedido, e quais transições são
// permitidas entre eles?
//
// Módulo puro: (estado, ação) => estado. Sem banco, sem I/O.
// As tabelas TRANSICOES_POST e TRANSICOES_PEDIDO são a resposta; toda mudança
// de estado passa por elas (um movimento fora da tabela é BUG do modelo).
// Regras marcadas [Dn] vêm das decisões do fundador em 2026-11-11 (ver README).

export type Hora = number; // horas desde o início da simulação

export const PONTOS_DE_ENCONTRO = ['Ponto 1', 'Ponto 2', 'Ponto 3'];
/** Horários fixos, já como hora da simulação. */
export const HORARIOS: Hora[] = [24, 30, 48];

export const PRAZO_REVISAO_HORAS = 24; // Denúncia
export const PRAZO_CONFIRMACAO_HORAS = 24; // [D4] contado a partir do horário combinado

export type MotivoDenuncia = 'pacote-aberto-ou-vencido' | 'suspeita-de-revenda' | 'nao-compareceu';

export type Usuario = {
  id: string;
  banido: boolean;
  entregasConcluidas: number; // [D15] antes "trocas concluídas"; conta Doação e Troca
  desistenciasAposAceite: number; // [D3] só registro, visível ao fundador
  avisos: string[]; // avisos do sistema (não é chat)
};

// ---------- Post ----------
// Dois eixos independentes: ciclo (vida do item) e oculto (moderação).
export type CicloPost = 'ativo' | 'reservado' | 'entregue' | 'retirado' | 'vencido' | 'removido';

export const TRANSICOES_POST: Record<CicloPost, CicloPost[]> = {
  ativo: ['reservado', 'retirado', 'vencido', 'removido'],
  reservado: ['ativo', 'entregue', 'vencido', 'removido'],
  entregue: ['removido'], // Denúncia depois da entrega [D12]
  vencido: ['removido'],
  retirado: [],
  removido: [],
};

export type Post = {
  id: string;
  anunciante: string;
  modalidade: 'doacao' | 'troca' | 'doacao-ou-troca';
  validadeEm: Hora;
  ciclo: CicloPost;
  reservadoPara?: string; // Pedido que reservou o item (como Post principal ou como Contrapartida)
  oculto: boolean;
  alertas: string[];
};

// ---------- Pedido ----------
export type EstadoPedido =
  | 'pendente' // "quero", aguardando o Anunciante (vários podem esperar na fila) [D2]
  | 'aceito' // Anunciante aceitou; ponto e horário em negociação
  | 'combinado' // ponto e horário fechados
  | 'aguardando-confirmacao' // um lado confirmou a entrega
  | 'em-revisao' // "não compareceu" contra o Anunciante, ou versões conflitantes; fundador decide
  | 'concluido'
  | 'recusado'
  | 'cancelado' // desistência, falta do interessado, ou decisão da revisão
  | 'encerrado'; // o sistema fechou (item foi para outro, Post saiu, validade, banimento)

export const TRANSICOES_PEDIDO: Record<EstadoPedido, EstadoPedido[]> = {
  pendente: ['aceito', 'recusado', 'cancelado', 'encerrado'],
  aceito: ['combinado', 'cancelado', 'encerrado'],
  combinado: ['aguardando-confirmacao', 'em-revisao', 'cancelado', 'encerrado'],
  'aguardando-confirmacao': ['concluido', 'em-revisao', 'cancelado', 'encerrado'],
  'em-revisao': ['concluido', 'cancelado'],
  concluido: [],
  recusado: [],
  cancelado: [],
  encerrado: [],
};

const EM_ANDAMENTO: EstadoPedido[] = ['aceito', 'combinado', 'aguardando-confirmacao'];
const TERMINAL: EstadoPedido[] = ['concluido', 'recusado', 'cancelado', 'encerrado'];

export type Lado = 'anunciante' | 'interessado';

export type Pedido = {
  id: string;
  postId: string;
  interessado: string;
  contrapartida?: string; // [D15] Post do interessado oferecido em Troca
  estado: EstadoPedido;
  congelado: boolean; // [D6] Post envolvido está em revisão
  proposta?: { ponto: string; horario: Hora; por: Lado };
  combinacao?: { ponto: string; horario: Hora };
  confirmouEntrega: Lado[];
  disseNaoCompareceu: Lado[];
  motivoFim?: string;
  alertas: string[];
};

// ---------- Denúncia ----------
export type DecisaoRevisao = {
  post?: 'restaurar' | 'remover'; // obrigatório quando a Denúncia ocultou o Post
  pedido?: 'concluir' | 'cancelar'; // obrigatório quando há Pedido em revisão
  banir?: string; // o fundador confirma todo banimento
};

export type Denuncia = {
  id: string;
  postId: string;
  pedidoId?: string;
  contra: string; // [D1] pessoa denunciada
  por: string;
  motivo: MotivoDenuncia;
  ocultouPost: boolean;
  criadaEm: Hora;
  atrasada: boolean;
  decisao?: DecisaoRevisao;
};

export type Estado = {
  agora: Hora;
  usuarios: Record<string, Usuario>;
  posts: Record<string, Post>;
  pedidos: Record<string, Pedido>;
  denuncias: Record<string, Denuncia>;
};

export function estadoInicial(): Estado {
  return { agora: 0, usuarios: {}, posts: {}, pedidos: {}, denuncias: {} };
}

// ---------- Ações ----------
export type Acao =
  | { tipo: 'cadastrar'; usuario: string }
  | { tipo: 'publicarPost'; post: string; por: string; modalidade: Post['modalidade']; validadeEm: Hora }
  | { tipo: 'alertaIA'; post: string; texto: string }
  | { tipo: 'retirarPost'; post: string; por: string }
  | { tipo: 'fazerPedido'; pedido: string; post: string; por: string; contrapartida?: string }
  | { tipo: 'cancelarPedido'; pedido: string; por: string }
  | { tipo: 'aceitarPedido'; pedido: string; por: string }
  | { tipo: 'recusarPedido'; pedido: string; por: string }
  | { tipo: 'proporPontoEHorario'; pedido: string; por: string; ponto: string; horario: Hora }
  | { tipo: 'aceitarPontoEHorario'; pedido: string; por: string }
  | { tipo: 'desistir'; pedido: string; por: string }
  | { tipo: 'confirmarEntrega'; pedido: string; por: string }
  | { tipo: 'declararNaoCompareceu'; pedido: string; por: string; denuncia: string }
  | { tipo: 'denunciar'; denuncia: string; post: string; por: string; motivo: Exclude<MotivoDenuncia, 'nao-compareceu'> }
  | { tipo: 'revisarDenuncia'; denuncia: string; decisao: DecisaoRevisao }
  | { tipo: 'passarTempo'; horas: number };

class Recusa extends Error {}
function recusar(msg: string): never {
  throw new Recusa(msg);
}

export function aplicar(estado: Estado, acao: Acao): { estado: Estado; recusa?: string } {
  const e = structuredClone(estado);
  try {
    executar(e, acao);
    return { estado: e };
  } catch (err) {
    if (err instanceof Recusa) return { estado, recusa: err.message };
    throw err;
  }
}

// ---------- Auxiliares ----------
function moverPost(p: Post, para: CicloPost) {
  if (p.ciclo === para) return;
  if (!TRANSICOES_POST[p.ciclo].includes(para)) {
    throw new Error(`BUG no modelo: Post ${p.id} ${p.ciclo} → ${para} não está na tabela`);
  }
  p.ciclo = para;
  if (para !== 'reservado' && para !== 'entregue') p.reservadoPara = undefined;
}

function moverPedido(d: Pedido, para: EstadoPedido, motivo?: string) {
  if (!TRANSICOES_PEDIDO[d.estado].includes(para)) {
    throw new Error(`BUG no modelo: Pedido ${d.id} ${d.estado} → ${para} não está na tabela`);
  }
  d.estado = para;
  if (motivo) d.motivoFim = motivo;
  if (TERMINAL.includes(para)) d.congelado = false;
}

function alertar(lista: string[], texto: string) {
  if (!lista.includes(texto)) lista.push(texto);
}

function avisar(e: Estado, usuario: string, texto: string) {
  const u = e.usuarios[usuario];
  if (!u.banido) alertar(u.avisos, texto);
}

function usuarioAtivo(e: Estado, id: string): Usuario {
  const u = e.usuarios[id] ?? recusar(`usuário ${id} não existe`);
  if (u.banido) recusar(`${id} está banido(a)`);
  return u;
}

const post = (e: Estado, id: string): Post => e.posts[id] ?? recusar(`Post ${id} não existe`);
const pedido = (e: Estado, id: string): Pedido => e.pedidos[id] ?? recusar(`Pedido ${id} não existe`);
const anuncianteDe = (e: Estado, d: Pedido) => e.posts[d.postId].anunciante;

function ladoDe(e: Estado, d: Pedido, usuario: string): Lado {
  if (anuncianteDe(e, d) === usuario) return 'anunciante';
  if (d.interessado === usuario) return 'interessado';
  return recusar(`${usuario} não participa do Pedido ${d.id}`);
}

const pessoaDoLado = (e: Estado, d: Pedido, lado: Lado) => (lado === 'anunciante' ? anuncianteDe(e, d) : d.interessado);
const outroLado = (l: Lado): Lado => (l === 'anunciante' ? 'interessado' : 'anunciante');

/** Posts que o Pedido movimenta: o principal e, em Troca, a Contrapartida. */
function postsDoPedido(e: Estado, d: Pedido): Post[] {
  return [e.posts[d.postId], ...(d.contrapartida ? [e.posts[d.contrapartida]] : [])];
}

/** Pedidos que envolvem o Post, como principal ou como Contrapartida. */
function pedidosQueUsam(e: Estado, postId: string): Pedido[] {
  return Object.values(e.pedidos).filter((d) => d.postId === postId || d.contrapartida === postId);
}

function avisarParticipantes(e: Estado, d: Pedido, texto: string) {
  avisar(e, anuncianteDe(e, d), texto);
  avisar(e, d.interessado, texto);
}

/** Solta os Posts que este Pedido reservou. */
function liberar(e: Estado, d: Pedido) {
  for (const p of postsDoPedido(e, d)) {
    if (p.ciclo === 'reservado' && p.reservadoPara === d.id) moverPost(p, 'ativo');
  }
}

/** Fecha o Pedido pelo sistema, solta os Posts e avisa. [D11] */
function encerrar(e: Estado, d: Pedido, motivo: string) {
  const estavaEmAndamento = EM_ANDAMENTO.includes(d.estado);
  moverPedido(d, 'encerrado', motivo);
  liberar(e, d);
  if (estavaEmAndamento) avisarParticipantes(e, d, `Pedido ${d.id} encerrado (${motivo}): a entrega não vai poder ser feita`);
  else avisar(e, d.interessado, `Pedido ${d.id} encerrado: ${motivo}`);
}

function congelar(e: Estado, postId: string) {
  for (const d of pedidosQueUsam(e, postId)) {
    if (EM_ANDAMENTO.includes(d.estado) && !d.congelado) {
      d.congelado = true;
      avisarParticipantes(e, d, `entrega do Pedido ${d.id} suspensa: um Post envolvido está em revisão`);
    }
  }
}

function descongelar(e: Estado, postId: string) {
  for (const d of pedidosQueUsam(e, postId)) {
    if (!d.congelado) continue;
    if (postsDoPedido(e, d).some((p) => p.oculto)) continue; // a Contrapartida ainda pode estar em revisão
    d.congelado = false;
    avisarParticipantes(e, d, `entrega do Pedido ${d.id} retomada`);
  }
}

function ocultar(e: Estado, p: Post) {
  p.oculto = true;
  congelar(e, p.id);
}

/** Mostra o Post de novo se nenhuma Denúncia aberta e dentro do prazo ainda o segura. */
function talvezMostrar(e: Estado, p: Post) {
  const segurando = Object.values(e.denuncias).some((x) => x.postId === p.id && x.ocultouPost && !x.decisao && !x.atrasada);
  if (segurando || p.ciclo === 'removido') return false;
  p.oculto = false;
  descongelar(e, p.id);
  return true;
}

function concluir(e: Estado, d: Pedido, motivo?: string) {
  moverPedido(d, 'concluido', motivo);
  e.usuarios[anuncianteDe(e, d)].entregasConcluidas++;
  e.usuarios[d.interessado].entregasConcluidas++;
  for (const p of postsDoPedido(e, d)) {
    moverPost(p, 'entregue');
    for (const outro of pedidosQueUsam(e, p.id)) {
      if (outro.estado === 'pendente') encerrar(e, outro, 'o item já foi entregue');
    }
  }
}

function banir(e: Estado, id: string) {
  const usuario = e.usuarios[id] ?? recusar(`usuário ${id} não existe`);
  usuario.banido = true;
  for (const d of Object.values(e.pedidos)) {
    const envolve = d.interessado === id || anuncianteDe(e, d) === id || (d.contrapartida && e.posts[d.contrapartida].anunciante === id);
    if (!envolve || TERMINAL.includes(d.estado)) continue;
    if (d.estado === 'em-revisao') {
      alertar(d.alertas, `${id} foi banido(a) com este Pedido em revisão`);
      continue;
    }
    encerrar(e, d, `${id} foi banido(a)`);
  }
  for (const p of Object.values(e.posts)) {
    if (p.anunciante === id && (p.ciclo === 'ativo' || p.ciclo === 'reservado')) moverPost(p, 'removido');
  }
}

// ---------- Relógio ----------
function verificarValidade(e: Estado) {
  for (const p of Object.values(e.posts)) {
    if (!(p.ciclo === 'ativo' || p.ciclo === 'reservado') || p.validadeEm > e.agora) continue;
    const pedidos = pedidosQueUsam(e, p.id);
    // Se alguém já disse que entregou, ou há revisão, o item pode já ter saído: não vence. [D9]
    if (pedidos.some((d) => d.estado === 'aguardando-confirmacao' || d.estado === 'em-revisao')) {
      alertar(p.alertas, 'validade venceu com entrega já confirmada por um lado ou em revisão');
      continue;
    }
    for (const d of pedidos) {
      if (d.estado === 'pendente' || d.estado === 'aceito' || d.estado === 'combinado') encerrar(e, d, `validade do ${p.id} venceu`);
    }
    moverPost(p, 'vencido');
  }
}

function verificarDenunciasAtrasadas(e: Estado) {
  for (const den of Object.values(e.denuncias)) {
    if (den.decisao || den.atrasada || e.agora - den.criadaEm <= PRAZO_REVISAO_HORAS) continue;
    den.atrasada = true;
    // [D7] passou de 24 h sem revisão: o Post volta a aparecer; a Denúncia continua aberta.
    const p = e.posts[den.postId];
    if (den.ocultouPost && p.oculto && talvezMostrar(e, p)) alertar(p.alertas, 'voltou a aparecer: Denúncia sem revisão em 24 h');
  }
}

function verificarConfirmacoes(e: Estado) {
  for (const d of Object.values(e.pedidos)) {
    if (d.estado !== 'aguardando-confirmacao' || d.congelado || !d.combinacao) continue;
    if (e.agora < d.combinacao.horario + PRAZO_CONFIRMACAO_HORAS) continue;
    // [D4] não conclui sozinho: continua esperando e avisa quem falta confirmar.
    const falta = outroLado(d.confirmouEntrega[0]);
    alertar(d.alertas, `prazo de ${PRAZO_CONFIRMACAO_HORAS} h após o horário estourado`);
    avisar(e, pessoaDoLado(e, d, falta), `confirme a entrega do Pedido ${d.id}`);
  }
}

// ---------- Execução ----------
function executar(e: Estado, a: Acao) {
  switch (a.tipo) {
    case 'cadastrar': {
      if (e.usuarios[a.usuario]) recusar('usuário já existe');
      e.usuarios[a.usuario] = { id: a.usuario, banido: false, entregasConcluidas: 0, desistenciasAposAceite: 0, avisos: [] };
      return;
    }

    case 'publicarPost': {
      usuarioAtivo(e, a.por);
      if (e.posts[a.post]) recusar('Post já existe');
      // [D10] conferir a data digitada não é julgar conteúdo: não contraria o ADR 0002.
      if (a.validadeEm <= e.agora) recusar('a data de validade informada já passou');
      // ADR 0002: fora isso, publica na hora.
      e.posts[a.post] = { id: a.post, anunciante: a.por, modalidade: a.modalidade, validadeEm: a.validadeEm, ciclo: 'ativo', oculto: false, alertas: [] };
      return;
    }

    case 'alertaIA': {
      // ADR 0002: a IA só sinaliza. Não muda ciclo nem visibilidade.
      alertar(post(e, a.post).alertas, `IA: ${a.texto}`);
      return;
    }

    case 'retirarPost': {
      const p = post(e, a.post);
      usuarioAtivo(e, a.por);
      if (p.anunciante !== a.por) recusar('só o Anunciante retira o Post');
      // [D14] com Pedido em andamento, desiste antes.
      if (p.ciclo === 'reservado') recusar('há Pedido em andamento: desista dele antes de retirar o Post');
      if (p.ciclo !== 'ativo') recusar(`Post está ${p.ciclo}`);
      for (const d of pedidosQueUsam(e, p.id)) if (d.estado === 'pendente') encerrar(e, d, `${p.id} retirado pelo dono`);
      moverPost(p, 'retirado');
      return;
    }

    case 'fazerPedido': {
      usuarioAtivo(e, a.por);
      const p = post(e, a.post);
      if (e.pedidos[a.pedido]) recusar('Pedido já existe');
      if (p.anunciante === a.por) recusar('o Anunciante não pede o próprio Post');
      if (p.oculto) recusar('Post oculto por Denúncia');
      if (p.ciclo !== 'ativo' && p.ciclo !== 'reservado') recusar(`Post está ${p.ciclo}`);
      if (pedidosQueUsam(e, p.id).some((d) => d.postId === p.id && d.interessado === a.por && !TERMINAL.includes(d.estado))) {
        recusar('já existe um Pedido seu em aberto neste Post');
      }
      // [D15] Contrapartida: obrigatória em Troca, opcional em "doação ou troca", proibida em Doação.
      if (p.modalidade === 'troca' && !a.contrapartida) recusar('Post de Troca: escolha um Post seu como Contrapartida');
      if (p.modalidade === 'doacao' && a.contrapartida) recusar('Post de Doação não aceita Contrapartida');
      if (a.contrapartida) {
        const c = post(e, a.contrapartida);
        if (c.anunciante !== a.por) recusar('a Contrapartida precisa ser um Post seu');
        if (c.ciclo !== 'ativo' || c.oculto) recusar(`a Contrapartida ${c.id} não está disponível (${c.ciclo}${c.oculto ? ', oculta' : ''})`);
      }
      e.pedidos[a.pedido] = {
        id: a.pedido, postId: p.id, interessado: a.por, contrapartida: a.contrapartida, estado: 'pendente',
        congelado: false, confirmouEntrega: [], disseNaoCompareceu: [], alertas: [],
      };
      return;
    }

    case 'cancelarPedido': {
      const d = pedido(e, a.pedido);
      if (ladoDe(e, d, a.por) !== 'interessado') recusar('só o interessado cancela o próprio Pedido');
      if (d.estado !== 'pendente') recusar(`Pedido está ${d.estado}; depois do aceite é "desistir"`);
      moverPedido(d, 'cancelado', 'interessado cancelou antes do aceite');
      return;
    }

    case 'aceitarPedido':
    case 'recusarPedido': {
      const d = pedido(e, a.pedido);
      usuarioAtivo(e, a.por);
      if (ladoDe(e, d, a.por) !== 'anunciante') recusar('só o Anunciante aceita ou recusa');
      if (d.estado !== 'pendente') recusar(`Pedido está ${d.estado}`);
      if (a.tipo === 'recusarPedido') {
        moverPedido(d, 'recusado', 'Anunciante recusou');
        return;
      }
      for (const p of postsDoPedido(e, d)) {
        if (p.oculto) recusar(`${p.id} oculto por Denúncia; aguarde a revisão`);
        if (p.ciclo === 'reservado') recusar(`${p.id} já está reservado para o Pedido ${p.reservadoPara}`);
        if (p.ciclo !== 'ativo') recusar(`${p.id} está ${p.ciclo}`);
      }
      moverPedido(d, 'aceito');
      // [D2] os outros pendentes ficam na fila.
      for (const p of postsDoPedido(e, d)) {
        moverPost(p, 'reservado');
        p.reservadoPara = d.id;
      }
      return;
    }

    case 'proporPontoEHorario': {
      const d = pedido(e, a.pedido);
      const lado = ladoDe(e, d, a.por);
      usuarioAtivo(e, a.por);
      if (d.estado !== 'aceito') recusar(`Pedido está ${d.estado}`);
      if (d.congelado) recusar('Pedido congelado: Post em revisão');
      // [D13] o Anunciante propõe primeiro; depois, contrapropostas alternadas.
      if (!d.proposta && lado !== 'anunciante') recusar('quem propõe primeiro é o Anunciante');
      if (d.proposta && d.proposta.por === lado) recusar('aguarde a resposta do outro lado (contrapropostas alternam)');
      if (!PONTOS_DE_ENCONTRO.includes(a.ponto)) recusar(`"${a.ponto}" não está na lista de Pontos de encontro`);
      if (!HORARIOS.includes(a.horario)) recusar(`${a.horario} h não está na lista de horários`);
      if (a.horario <= e.agora) recusar('esse horário já passou');
      d.proposta = { ponto: a.ponto, horario: a.horario, por: lado };
      return;
    }

    case 'aceitarPontoEHorario': {
      const d = pedido(e, a.pedido);
      const lado = ladoDe(e, d, a.por);
      usuarioAtivo(e, a.por);
      if (d.estado !== 'aceito') recusar(`Pedido está ${d.estado}`);
      if (d.congelado) recusar('Pedido congelado: Post em revisão');
      if (!d.proposta) recusar('não há proposta de ponto e horário');
      if (d.proposta.por === lado) recusar('quem propôs não aceita a própria proposta');
      if (d.proposta.horario <= e.agora) recusar('o horário proposto já passou; faça uma contraproposta');
      d.combinacao = { ponto: d.proposta.ponto, horario: d.proposta.horario };
      moverPedido(d, 'combinado');
      return;
    }

    case 'desistir': {
      const d = pedido(e, a.pedido);
      const lado = ladoDe(e, d, a.por);
      if (d.estado !== 'aceito' && d.estado !== 'combinado') recusar(`não dá para desistir de um Pedido ${d.estado}`);
      moverPedido(d, 'cancelado', `${lado} desistiu depois do aceite`);
      e.usuarios[a.por].desistenciasAposAceite++;
      liberar(e, d);
      avisar(e, pessoaDoLado(e, d, outroLado(lado)), `o outro lado desistiu do Pedido ${d.id}`);
      return;
    }

    case 'confirmarEntrega': {
      const d = pedido(e, a.pedido);
      const lado = ladoDe(e, d, a.por);
      usuarioAtivo(e, a.por);
      if (d.congelado) recusar('Pedido congelado: Post em revisão');
      if (d.estado !== 'combinado' && d.estado !== 'aguardando-confirmacao') recusar(`Pedido está ${d.estado}`);
      // [D13] pode confirmar antes do horário: as pessoas podem chegar mais cedo.
      if (d.confirmouEntrega.includes(lado)) recusar('você já confirmou');
      d.confirmouEntrega.push(lado);
      if (d.confirmouEntrega.length === 2) concluir(e, d);
      else moverPedido(d, 'aguardando-confirmacao');
      return;
    }

    case 'declararNaoCompareceu': {
      const d = pedido(e, a.pedido);
      const lado = ladoDe(e, d, a.por);
      usuarioAtivo(e, a.por);
      if (d.estado !== 'combinado' && d.estado !== 'aguardando-confirmacao') recusar(`Pedido está ${d.estado}`);
      if (d.congelado) recusar('Pedido congelado: Post em revisão');
      // [D13] antes do horário, ninguém faltou ainda.
      if (e.agora < d.combinacao!.horario) recusar(`ainda não chegou o horário combinado (${d.combinacao!.horario} h)`);
      if (d.confirmouEntrega.includes(lado)) recusar('você já confirmou a entrega');
      if (e.denuncias[a.denuncia]) recusar('Denúncia já existe');

      const acusadoLado = outroLado(lado);
      const acusado = pessoaDoLado(e, d, acusadoLado);
      const conflito = d.confirmouEntrega.includes(acusadoLado);
      const p = e.posts[d.postId];
      d.disseNaoCompareceu.push(lado);
      // [D1] a Denúncia é contra a pessoa. Só oculta o Post quando a acusada é o Anunciante.
      const ocultouPost = acusadoLado === 'anunciante';
      e.denuncias[a.denuncia] = {
        id: a.denuncia, postId: p.id, pedidoId: d.id, contra: acusado, por: a.por, motivo: 'nao-compareceu',
        ocultouPost, criadaEm: e.agora, atrasada: false,
      };
      if (conflito) alertar(d.alertas, 'versões conflitantes: um lado diz que entregou, o outro que não houve encontro');

      if (acusadoLado === 'interessado' && !conflito) {
        // Interessado faltou: o Pedido acaba e o Post volta a ativo para o próximo da fila.
        moverPedido(d, 'cancelado', 'interessado não compareceu');
        liberar(e, d);
        avisar(e, acusado, `você foi denunciado(a) por não comparecer no Pedido ${d.id}`);
        return;
      }
      moverPedido(d, 'em-revisao');
      avisar(e, acusado, `você foi denunciado(a) por não comparecer no Pedido ${d.id}; o fundador vai revisar`);
      if (ocultouPost) ocultar(e, p);
      return;
    }

    case 'denunciar': {
      usuarioAtivo(e, a.por);
      const p = post(e, a.post);
      if (e.denuncias[a.denuncia]) recusar('Denúncia já existe');
      if (p.anunciante === a.por) recusar('o Anunciante não denuncia o próprio Post');
      if (p.ciclo === 'removido') recusar('Post já removido');
      if (Object.values(e.denuncias).some((x) => x.postId === p.id && x.por === a.por && !x.decisao)) {
        recusar('você já tem uma Denúncia aberta neste Post');
      }
      e.denuncias[a.denuncia] = {
        id: a.denuncia, postId: p.id, contra: p.anunciante, por: a.por, motivo: a.motivo,
        ocultouPost: true, criadaEm: e.agora, atrasada: false,
      };
      ocultar(e, p); // [D6] Pedidos em andamento congelam, com aviso
      return;
    }

    case 'revisarDenuncia': {
      const den = e.denuncias[a.denuncia] ?? recusar('Denúncia não existe');
      if (den.decisao) recusar('Denúncia já revisada');
      const p = e.posts[den.postId];
      const d = den.pedidoId ? e.pedidos[den.pedidoId] : undefined;
      if (den.ocultouPost && !a.decisao.post) recusar('esta Denúncia ocultou o Post: decida restaurar ou remover');
      if (d?.estado === 'em-revisao' && !a.decisao.pedido) recusar('há Pedido em revisão: decida também o Pedido');
      if (a.decisao.pedido && d?.estado !== 'em-revisao') recusar('não há Pedido em revisão nesta Denúncia');
      den.decisao = a.decisao;

      // [D5] em revisão, "concluir" soma no contador; "cancelar" não soma e não pune.
      if (d && a.decisao.pedido === 'concluir') concluir(e, d, 'concluído pelo fundador na revisão');
      if (d && a.decisao.pedido === 'cancelar') {
        moverPedido(d, 'cancelado', 'cancelado pelo fundador: a entrega não aconteceu');
        liberar(e, d);
      }

      if (a.decisao.post === 'remover') {
        // [D12] Denúncia procedente depois da entrega: o contador do dono do Post volta.
        if (p.ciclo === 'entregue') {
          e.usuarios[p.anunciante].entregasConcluidas--;
          alertar(p.alertas, `entrega desfeita no contador de ${p.anunciante}`);
        }
        for (const x of pedidosQueUsam(e, p.id)) {
          if (x.estado === 'em-revisao') alertar(x.alertas, 'Post removido com este Pedido ainda em revisão');
          else if (!TERMINAL.includes(x.estado)) encerrar(e, x, `${p.id} removido pelo fundador`);
        }
        if (TRANSICOES_POST[p.ciclo].includes('removido')) moverPost(p, 'removido');
      }
      if (a.decisao.post === 'restaurar') {
        // [D8] com outra Denúncia aberta, continua oculto.
        if (!talvezMostrar(e, p)) alertar(p.alertas, 'restaurado nesta Denúncia, mas segue oculto por outra Denúncia aberta');
      }

      if (a.decisao.banir) banir(e, a.decisao.banir);
      return;
    }

    case 'passarTempo': {
      e.agora += a.horas;
      verificarValidade(e);
      verificarDenunciasAtrasadas(e);
      verificarConfirmacoes(e);
      return;
    }
  }
}
