// PROTÓTIPO DESCARTÁVEL. Monta as colunas (paleta × tema), as 3 telas e a tabela de contraste.
// Estado na URL (#tela=…&estado=…&col=A.claro,B.escuro) para recarregar e compartilhar.
/* global PALETAS, PARES, razao, MINIMO */

const CHAVES = Object.keys(PALETAS);
const TEMAS = ['claro', 'escuro', 'sistema'];
const TELAS = { codigo: 'Código por SMS', lista: 'Lista de Posts', landing: 'Landing', todas: 'As 3' };
const ESTADOS = { normal: 'Normal', foco: 'Com foco', erro: 'Com erro' };
const midiaEscura = window.matchMedia('(prefers-color-scheme: dark)');

// Ajustes feitos à mão nos seletores de cor (só em memória).
const editados = {}; // editados[A][claro][token] = '#…'

let estado = lerHash();

function lerHash() {
  const p = new URLSearchParams(location.hash.slice(1));
  const col = (p.get('col') || 'A.claro,B.claro,C.claro')
    .split(',')
    .map((s) => s.split('.'))
    .filter(([k, t]) => PALETAS[k] && TEMAS.includes(t))
    .map(([paleta, tema]) => ({ paleta, tema }));
  return {
    tela: TELAS[p.get('tela')] ? p.get('tela') : 'todas',
    campo: ESTADOS[p.get('estado')] ? p.get('estado') : 'normal',
    colunas: col.length ? col : [{ paleta: 'A', tema: 'claro' }],
  };
}

function gravarHash() {
  const col = estado.colunas.map((c) => `${c.paleta}.${c.tema}`).join(',');
  const h = `#tela=${estado.tela}&estado=${estado.campo}&col=${col}`;
  try {
    history.replaceState(null, '', h);
  } catch {
    location.hash = h;
  }
}

const temaReal = (t) => (t === 'sistema' ? (midiaEscura.matches ? 'escuro' : 'claro') : t);

function tokens(paleta, tema) {
  return { ...PALETAS[paleta][tema], ...(editados[paleta]?.[tema] || {}) };
}

function conferir(paleta, tema) {
  const t = tokens(paleta, tema);
  return PARES.map((par) => {
    const r = razao(t[par.frente], t[par.fundo]);
    return { ...par, r, min: MINIMO[par.tipo], ok: r >= MINIMO[par.tipo], cf: t[par.frente], cb: t[par.fundo] };
  });
}

const fmt = (n) => n.toFixed(2).replace('.', ',');
const estiloTokens = (t) => Object.entries(t).map(([k, v]) => `--${k}:${v}`).join(';');

// ---------- Ícones (traço simples no estilo do lucide, desenhados à mão) ----------
const ic = {
  voltar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
  mais: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  pino: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  calendario: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  alerta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.5"/></svg>',
  servidor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  proibido: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></svg>',
  celular: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18h2"/></svg>',
};

// Bloco no lugar da foto do pacote: contorno de um pacote com o tamanho escrito.
const pacote = (tam) =>
  `<span class="t-foto" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"><path d="M14 10h36l4 8v36a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V18z"/><path d="M10 18h44"/><path d="M22 18v6M42 18v6"/><text x="32" y="45" text-anchor="middle" font-size="16" font-weight="700" fill="currentColor" stroke="none" font-family="system-ui">${tam}</text></svg></span>`;

const POSTS = [
  { tam: 'M', qtd: 32, bairro: 'Jardim Guanabara', validade: 'mar/2028', modo: 'Doação' },
  { tam: 'M', qtd: 18, bairro: 'Cacuia', validade: 'ago/2027', modo: 'Doação ou troca' },
  { tam: 'M', qtd: 46, bairro: 'Portuguesa', validade: 'jan/2028', modo: 'Troca' },
  { tam: 'M', qtd: 24, bairro: 'Moneró', validade: 'nov/2027', modo: 'Doação' },
];
const BAIRROS = [
  'Bancários', 'Cacuia', 'Cocotá', 'Freguesia', 'Galeão', 'Jardim Carioca', 'Jardim Guanabara',
  'Moneró', 'Pitangueiras', 'Portuguesa', 'Praia da Bandeira', 'Ribeira', 'Tauá', 'Zumbi',
];

const cardPost = (p, tag = 'a') =>
  `<${tag} class="t-card"${tag === 'a' ? ' href="#" data-nao-navega' : ''}>
    ${pacote(p.tam)}
    <div class="t-card-corpo">
      <h3>Fralda tamanho ${p.tam}</h3>
      <div>${p.qtd} unidades</div>
      <div class="t-meta">${ic.pino}${p.bairro}</div>
      <div class="t-meta">${ic.calendario}Validade ${p.validade}</div>
      <div class="t-declarado">O Anunciante declarou: pacote fechado e essa validade</div>
      <span class="t-selo">${p.modo}</span>
    </div>
  </${tag}>`;

const logo = '<a class="t-logo" href="#" data-nao-navega><span class="marca" aria-hidden="true">P</span>Passaly</a>';

// ---------- As 3 telas ----------
function telaCodigo(id, campo) {
  const erro = campo === 'erro';
  return `<div class="t-barra">
      <a class="t-btn t-btn-fantasma" href="#" data-nao-navega style="padding-left:.25rem">${ic.voltar}Voltar</a>
      <span></span>
    </div>
    <form class="t-pad t-pilha" data-nao-envia>
      <h1>Digite o código</h1>
      <p class="t-apoio">Mandamos um SMS com 6 números para (21) 9••••-••42.</p>
      <div>
        <label class="t-campo-rot" for="${id}-otp">Código do SMS</label>
        <input id="${id}-otp" class="t-campo${campo === 'foco' ? ' foco-simulado' : ''}" type="text" inputmode="numeric"
          autocomplete="one-time-code" maxlength="6" placeholder="••••••" value="${erro ? '482913' : ''}"
          ${erro ? `aria-invalid="true" aria-describedby="${id}-erro"` : ''}>
        ${erro ? `<p class="t-erro" id="${id}-erro">${ic.alerta}<span>Código errado. Confira o SMS ou peça outro.</span></p>` : ''}
      </div>
      <button class="t-btn t-btn-primario t-btn-largo" type="submit">Entrar</button>
      <button class="t-btn" type="button" disabled>Pedir outro código em 0:42</button>
      <p><a class="t-link" href="#" data-nao-navega>Trocar número</a></p>
    </form>`;
}

function telaLista(id) {
  const chips = ['RN', 'P', 'M', 'G', 'XG', 'XXG']
    .map((t) => `<button type="button" class="t-chip" aria-pressed="${t === 'M'}">${t}</button>`)
    .join('');
  return `<div class="t-barra">${logo}
      <a class="t-btn t-btn-primario" href="#" data-nao-navega>${ic.mais}Publicar</a>
    </div>
    <div class="t-filtros">
      <h1>Fraldas na Ilha</h1>
      <fieldset><legend>Tamanho</legend><div class="t-chips" data-chips>${chips}</div></fieldset>
      <div><label for="${id}-bairro">Bairro</label>
        <select id="${id}-bairro" class="t-select"><option>Todos os bairros</option>${BAIRROS.map((b) => `<option>${b}</option>`).join('')}</select>
      </div>
    </div>
    <p class="t-contagem t-apoio" role="status">4 Posts de fralda M</p>
    <ul class="t-lista">${POSTS.map((p) => `<li>${cardPost(p)}</li>`).join('')}</ul>`;
}

function telaLanding(id) {
  return `<div class="t-barra">${logo}<a class="t-btn t-btn-fantasma" href="#" data-nao-navega>Entrar</a></div>
    <div class="t-hero">
      <h1>Doe e troque fralda com pais da Ilha do Governador</h1>
      <p class="t-apoio">Sobrou pacote fechado? Publique com uma foto e combine a entrega num ponto público do bairro.</p>
    </div>
    <div class="t-botoes">
      <a class="t-btn t-btn-primario t-btn-largo" href="#" data-nao-navega>${ic.celular}Entrar com o celular</a>
      <a class="t-btn t-btn-contorno t-btn-largo" href="#${id}-como" data-rola="${id}-como">Como funciona</a>
    </div>
    <div class="t-exemplo">
      <p class="t-apoio t-pequeno">Um Post no Passaly (exemplo)</p>
      ${cardPost(POSTS[0], 'div')}
    </div>
    <ul class="t-faixa" aria-label="Compromissos do Passaly">
      <li><span class="ic">${ic.servidor}</span>Dados guardados no Brasil</li>
      <li><span class="ic">${ic.camera}</span>Foto só do pacote, nunca de pessoas</li>
      <li><span class="ic">${ic.proibido}</span>Sem revenda</li>
      <li><span class="ic">${ic.celular}</span>Só precisa do celular</li>
    </ul>
    <section class="t-passos" id="${id}-como" aria-labelledby="${id}-como-t">
      <h2 id="${id}-como-t">Como funciona</h2>
      <ol>
        <li><span class="t-passo-num" aria-hidden="true">1</span><div><h3>Publique com a foto do pacote</h3><p class="t-apoio">Informe tamanho, quantidade e validade. A foto mostra só o pacote.</p></div></li>
        <li><span class="t-passo-num" aria-hidden="true">2</span><div><h3>Alguém pede</h3><p class="t-apoio">Você recebe o Pedido e decide se aceita.</p></div></li>
        <li><span class="t-passo-num" aria-hidden="true">3</span><div><h3>Vocês combinam num ponto público da Ilha</h3><p class="t-apoio">Ninguém precisa passar o endereço.</p></div></li>
      </ol>
    </section>
    <footer class="t-rodape">
      <a href="#" data-nao-navega>Termos de uso</a>
      <a href="#" data-nao-navega>Privacidade</a>
      <a href="#" data-nao-navega>Contato do titular dos dados</a>
    </footer>`;
}

// ---------- Painéis do protótipo ----------
function tabelaContraste(linhas) {
  const rotTipo = { texto: 'texto', grande: 'texto grande', ui: 'borda/estado/foco' };
  const corpo = linhas
    .map((l) => {
      const amostra =
        l.tipo === 'ui'
          ? `<span class="amostra ui" style="background:${l.cb};--frente:${l.cf}" aria-hidden="true"></span>`
          : `<span class="amostra" style="background:${l.cb};color:${l.cf};${l.tipo === 'grande' ? 'font-size:1.25rem' : ''}" aria-hidden="true">Aa</span>`;
      return `<tr class="${l.ok ? '' : 'falha'}">
        <td>${amostra}</td>
        <td class="par"><code>${l.frente}</code> sobre <code>${l.fundo}</code><br>${l.uso} <span class="sr-only">(${rotTipo[l.tipo]})</span></td>
        <td class="num">${fmt(l.r)}:1<br><small>mín. ${fmt(l.min)}</small></td>
        <td>${l.ok ? '<span class="ok">passa</span>' : '<strong>FALHA</strong>'}</td>
      </tr>`;
    })
    .join('');
  return `<table class="contraste"><thead><tr><th><span class="sr-only">Amostra</span></th><th>Par e uso</th><th class="num">Razão</th><th>WCAG</th></tr></thead><tbody>${corpo}</tbody></table>`;
}

function painelTokens(i, paleta, tema) {
  const t = tokens(paleta, tema);
  const ed = editados[paleta]?.[tema] || {};
  const linhas = Object.entries(t)
    .map(
      ([k, v]) => `<label class="${ed[k] ? 'editado' : ''}">
        <input type="color" value="${v.toLowerCase()}" data-token="${k}" data-col="${i}">
        <code>--${k}</code><code>${v.toUpperCase()}${ed[k] ? ' *' : ''}</code></label>`,
    )
    .join('');
  return `<div class="tokens">${linhas}</div>
    <p><button type="button" data-restaura="${i}">Desfazer ajustes desta paleta</button></p>
    <label for="css-${i}">CSS dos dois temas (para o guia)</label>
    <textarea id="css-${i}" class="css-saida" readonly>${cssDaPaleta(paleta)}</textarea>`;
}

function cssDaPaleta(paleta) {
  const bloco = (t, recuo) =>
    Object.entries(t)
      .map(([k, v]) => `${recuo}--${k}: ${v.toUpperCase()};`)
      .join('\n');
  return `/* Paleta ${paleta} (${PALETAS[paleta].nome}) */\n:root {\n${bloco(tokens(paleta, 'claro'), '  ')}\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n${bloco(tokens(paleta, 'escuro'), '    ')}\n  }\n}\n`;
}

function telas(i, paleta, tema) {
  const id = `c${i}`;
  const lista = estado.tela === 'todas' ? ['codigo', 'lista', 'landing'] : [estado.tela];
  const fazer = { codigo: () => telaCodigo(`${id}a`, estado.campo), lista: () => telaLista(`${id}b`), landing: () => telaLanding(`${id}c`) };
  const estilo = estiloTokens(tokens(paleta, tema));
  return lista
    .map(
      (n) => `<p class="rotulo-tela">${TELAS[n]}</p>
      <div class="tela" data-tela-col="${i}" style="${estilo};color-scheme:${tema === 'escuro' ? 'dark' : 'light'}">${fazer[n]()}</div>`,
    )
    .join('');
}

function coluna(c, i) {
  const tema = temaReal(c.tema);
  const linhas = conferir(c.paleta, tema);
  const falhas = linhas.filter((l) => !l.ok).length;
  const opPal = CHAVES.map((k) => `<option value="${k}"${k === c.paleta ? ' selected' : ''}>${k}: ${PALETAS[k].nome}</option>`).join('');
  const opTema = TEMAS.map(
    (t) => `<option value="${t}"${t === c.tema ? ' selected' : ''}>${t === 'sistema' ? `Sistema (agora ${temaReal('sistema')})` : t[0].toUpperCase() + t.slice(1)}</option>`,
  ).join('');
  return `<section class="coluna" aria-label="Coluna ${i + 1}: paleta ${c.paleta}, tema ${tema}">
    <div class="coluna-ctrl chrome">
      <label>Paleta<select data-col="${i}" data-campo="paleta">${opPal}</select></label>
      <label>Tema<select data-col="${i}" data-campo="tema">${opTema}</select></label>
      ${estado.colunas.length > 1 ? `<button type="button" data-remove="${i}" aria-label="Remover coluna ${i + 1}" style="align-self:end">×</button>` : ''}
    </div>
    <h2>${c.paleta}. ${PALETAS[c.paleta].nome}, tema ${tema}</h2>
    <p class="ideia">${PALETAS[c.paleta].ideia}</p>
    <div>${telas(i, c.paleta, tema)}</div>
    <details class="painel chrome" open data-painel="contraste-${i}">
      <summary>Contraste: <span class="${falhas ? 'ruim' : 'ok'}" style="margin-left:.375rem">${falhas ? `${falhas} falha(m)` : `${linhas.length}/${linhas.length} passam`}</span></summary>
      ${tabelaContraste(linhas)}
    </details>
    <details class="painel chrome" data-painel="tokens-${i}">
      <summary>Tokens (editáveis)</summary>
      ${painelTokens(i, c.paleta, tema)}
    </details>
  </section>`;
}

function resumo() {
  const cab = '<tr><th>Paleta</th><th>Claro</th><th>Escuro</th></tr>';
  const lin = CHAVES.map((k) => {
    const cel = (t) => {
      const f = conferir(k, t).filter((l) => !l.ok).length;
      return `<td><button type="button" data-carrega="${k}.${t}">${f ? `<span class="ruim">${f} falha(m)</span>` : `<span class="ok">${PARES.length}/${PARES.length} passam</span>`}</button></td>`;
    };
    return `<tr><th>${k}. ${PALETAS[k].nome}</th>${cel('claro')}${cel('escuro')}</tr>`;
  }).join('');
  return `<table class="resumo"><caption class="sr-only">Resumo do contraste</caption>${cab}${lin}</table>`;
}

function botoes(nome, opcoes, atual) {
  return Object.entries(opcoes)
    .map(([k, v]) => `<button type="button" data-${nome}="${k}" aria-pressed="${k === atual}">${v}</button>`)
    .join('');
}

// ---------- Render ----------
const abertos = new Set(['contraste-0', 'contraste-1', 'contraste-2', 'contraste-3']);

function render() {
  document.getElementById('ctrl-tela').innerHTML = botoes('tela', TELAS, estado.tela);
  document.getElementById('ctrl-campo').innerHTML = botoes('estado', ESTADOS, estado.campo);
  document.getElementById('resumo').innerHTML = resumo();
  document.getElementById('colunas').innerHTML =
    estado.colunas.map(coluna).join('') +
    (estado.colunas.length < 4 ? '<button type="button" class="add-coluna chrome" data-add>+ Coluna</button>' : '');
  for (const d of document.querySelectorAll('details[data-painel]')) d.open = abertos.has(d.dataset.painel);
  const p = estado.colunas[0].paleta;
  document.getElementById('barra-rotulo').textContent = `Paleta ${p}: ${PALETAS[p].nome}`;
  gravarHash();
}

function girar(passo) {
  const n = CHAVES.length;
  for (const c of estado.colunas) c.paleta = CHAVES[(CHAVES.indexOf(c.paleta) + passo + n) % n];
  render();
}

// Atualiza só a parte visual de uma coluna, sem recriar os seletores de cor (mantém o foco).
function atualizarCor(i) {
  const c = estado.colunas[i];
  const tema = temaReal(c.tema);
  const est = estiloTokens(tokens(c.paleta, tema));
  for (const t of document.querySelectorAll(`[data-tela-col="${i}"]`)) t.setAttribute('style', `${est};color-scheme:${tema === 'escuro' ? 'dark' : 'light'}`);
  const col = document.querySelectorAll('.coluna')[i];
  const linhas = conferir(c.paleta, tema);
  const falhas = linhas.filter((l) => !l.ok).length;
  col.querySelector('[data-painel^="contraste"] table').outerHTML = tabelaContraste(linhas);
  col.querySelector('[data-painel^="contraste"] summary span').outerHTML =
    `<span class="${falhas ? 'ruim' : 'ok'}" style="margin-left:.375rem">${falhas ? `${falhas} falha(m)` : `${linhas.length}/${linhas.length} passam`}</span>`;
  col.querySelector('.css-saida').value = cssDaPaleta(c.paleta);
  document.getElementById('resumo').innerHTML = resumo();
}

// ---------- Eventos ----------
document.addEventListener('click', (e) => {
  const el = e.target.closest('button, a');
  if (!el) return;
  const d = el.dataset;
  if ('naoNavega' in d) e.preventDefault();
  if (d.rola) {
    e.preventDefault();
    document.getElementById(d.rola)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  if (el.classList.contains('t-chip')) {
    for (const b of el.parentElement.children) b.setAttribute('aria-pressed', String(b === el));
    const st = el.closest('.tela').querySelector('.t-contagem');
    if (st) st.textContent = el.textContent === 'M' ? '4 Posts de fralda M' : `Nenhum Post de fralda ${el.textContent} por enquanto`;
  }
  if (d.tela) { estado.tela = d.tela; render(); }
  if (d.estado) { estado.campo = d.estado; render(); }
  if (d.remove) { estado.colunas.splice(Number(d.remove), 1); render(); }
  if ('add' in d) { const u = estado.colunas.at(-1); estado.colunas.push({ ...u, tema: u.tema === 'claro' ? 'escuro' : 'claro' }); render(); }
  if (d.carrega) { const [paleta, tema] = d.carrega.split('.'); estado.colunas[0] = { paleta, tema }; render(); }
  if (d.restaura) { const c = estado.colunas[Number(d.restaura)]; delete editados[c.paleta]; render(); }
  if (d.atalho === 'claro' || d.atalho === 'escuro') { estado.colunas = CHAVES.map((paleta) => ({ paleta, tema: d.atalho })); render(); }
  if (d.atalho === 'par') { const p = estado.colunas[0].paleta; estado.colunas = [{ paleta: p, tema: 'claro' }, { paleta: p, tema: 'escuro' }]; render(); }
  if (d.atalho === 'tudo') { estado.colunas = CHAVES.flatMap((paleta) => [{ paleta, tema: 'claro' }, { paleta, tema: 'escuro' }]).slice(0, 6); render(); }
  if (d.gira) girar(Number(d.gira));
});

document.addEventListener('submit', (e) => e.preventDefault());

document.addEventListener('change', (e) => {
  const d = e.target.dataset;
  if (d.campo === 'paleta' || d.campo === 'tema') {
    estado.colunas[Number(d.col)][d.campo] = e.target.value;
    render();
  }
});

document.addEventListener('input', (e) => {
  const d = e.target.dataset;
  if (!d.token) return;
  const c = estado.colunas[Number(d.col)];
  const tema = temaReal(c.tema);
  editados[c.paleta] ??= {};
  editados[c.paleta][tema] ??= {};
  editados[c.paleta][tema][d.token] = e.target.value.toUpperCase();
  atualizarCor(Number(d.col));
});

document.addEventListener('toggle', (e) => {
  const p = e.target.dataset?.painel;
  if (!p) return;
  if (e.target.open) abertos.add(p);
  else abertos.delete(p);
}, true);

document.addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea, select, [contenteditable]')) return;
  if (e.key === 'ArrowLeft') girar(-1);
  if (e.key === 'ArrowRight') girar(1);
});

midiaEscura.addEventListener('change', render);
window.addEventListener('hashchange', () => { estado = lerHash(); render(); });

render();
