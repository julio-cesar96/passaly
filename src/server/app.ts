import { type Context, Hono } from 'hono';
import { bodyLimit } from 'hono/body-limit';
import { HTTPException } from 'hono/http-exception';
import { validator } from 'hono/validator';
import type { Origem } from './casos-de-uso/identidade.js';
import type { Passaly } from './casos-de-uso/passaly.js';
import { criarCookies } from './cookies.js';
import { barrarCsrf } from './csrf.js';
import { log } from './log.js';

type Opcoes = { producao: boolean; lerOrigem: (c: Context) => Origem };

type Json = Record<string, unknown>;
const objeto = (valor: unknown): Json =>
  typeof valor === 'object' && valor !== null ? (valor as Json) : {};
/** O que não for texto vira texto vazio, que o caso de uso recusa. */
const texto = (valor: unknown): string => (typeof valor === 'string' ? valor : '');
const textoOuNulo = (valor: unknown): string | null => texto(valor) || null;

/** API: adaptador fino sobre a interface de casos de uso (ADR 0008). */
export function criarApi(passaly: Passaly, { producao, lerOrigem }: Opcoes) {
  const cookies = criarCookies(producao);

  /** A sessão do navegador. Renova o cookie quando o prazo foi renovado e apaga o que não vale mais. */
  async function sessaoAtual(c: Context) {
    const token = cookies.ler(c, 'sessao');
    if (!token) return null;
    const sessao = await passaly.consultarSessao(token);
    if (!sessao) cookies.apagar(c, 'sessao');
    else if (sessao.renovadaAte) cookies.gravar(c, 'sessao', token, sessao.renovadaAte);
    return sessao;
  }

  return new Hono()
    .basePath('/api')
    .use(async (c, next) => {
      const inicio = performance.now();
      await next();
      c.header('Cache-Control', 'no-store');
      // Só método, caminho sem query string e status: nada de dado pessoal no log.
      log.info('requisição', {
        metodo: c.req.method,
        caminho: c.req.path,
        status: c.res.status,
        ms: Math.round(performance.now() - inicio),
      });
    })
    .use(barrarCsrf)
    .use(bodyLimit({ maxSize: 8 * 1024 }))
    .onError((erro, c) => {
      if (erro instanceof HTTPException) return c.json({ erro: 'Pedido inválido' }, erro.status);
      log.error('erro na API', { caminho: c.req.path, erro });
      return c.json({ erro: 'Erro interno' }, 500);
    })
    .get('/tique', async (c) => {
      if (!(await sessaoAtual(c))) return c.json({ erro: 'Entre para continuar' }, 401);
      const { ultimaExecucao } = await passaly.estadoDoTique();
      return c.json({ ultimaExecucao: ultimaExecucao?.toISOString() ?? null }, 200);
    })
    .post(
      '/codigo',
      validator('json', (corpo) => {
        const { telefone, avisoVersao } = objeto(corpo);
        return { telefone: texto(telefone), avisoVersao: texto(avisoVersao) };
      }),
      async (c) => {
        const resultado = await passaly.solicitarCodigo(c.req.valid('json'));
        return resultado.ok ? c.json(resultado, 200) : c.json(resultado, 422);
      },
    )
    .post(
      '/codigo/conferir',
      validator('json', (corpo) => {
        const { telefone, codigo } = objeto(corpo);
        return { telefone: texto(telefone), codigo: texto(codigo) };
      }),
      async (c) => {
        const resultado = await passaly.conferirCodigo({
          ...c.req.valid('json'),
          origem: lerOrigem(c),
          sessaoAnterior: cookies.ler(c, 'sessao'),
        });
        if (!resultado.ok) return c.json(resultado, 422);
        // O token só vai no cookie httpOnly, nunca no corpo.
        if (resultado.tipo === 'sessao') cookies.apagar(c, 'cadastro');
        cookies.gravar(c, resultado.tipo, resultado.token, resultado.expiraEm);
        return c.json({ ok: true as const, tipo: resultado.tipo }, 200);
      },
    )
    .post(
      '/cadastro',
      validator('json', (corpo) => {
        const { apelido, bairro, aceites } = objeto(corpo);
        const { termos, politica, autodeclaracao } = objeto(aceites);
        return {
          apelido: texto(apelido),
          bairro: texto(bairro),
          aceites: {
            termos: textoOuNulo(termos),
            politica: textoOuNulo(politica),
            autodeclaracao: textoOuNulo(autodeclaracao),
          },
        };
      }),
      async (c) => {
        const resultado = await passaly.cadastrar({
          ...c.req.valid('json'),
          token: cookies.ler(c, 'cadastro') ?? '',
          origem: lerOrigem(c),
          sessaoAnterior: cookies.ler(c, 'sessao'),
        });
        if (!resultado.ok) return c.json(resultado, 422);
        cookies.apagar(c, 'cadastro');
        cookies.gravar(c, 'sessao', resultado.token, resultado.expiraEm);
        return c.json({ ok: true as const }, 200);
      },
    )
    .get('/sessao', async (c) => {
      const sessao = await sessaoAtual(c);
      if (sessao) {
        const { apelido, bairro, papel } = sessao.conta;
        return c.json({ estado: 'sessao' as const, conta: { apelido, bairro, papel } });
      }
      const cadastro = cookies.ler(c, 'cadastro');
      const pendente = cadastro ? await passaly.cadastroPendente(cadastro) : false;
      return c.json({ estado: pendente ? ('cadastro' as const) : ('anonimo' as const) });
    })
    .delete('/sessao', async (c) => {
      const token = cookies.ler(c, 'sessao');
      if (token) await passaly.sair(token);
      const cadastro = cookies.ler(c, 'cadastro');
      if (cadastro) await passaly.desistirDoCadastro(cadastro);
      cookies.apagar(c, 'sessao');
      cookies.apagar(c, 'cadastro');
      return c.body(null, 204);
    });
}

export type Api = ReturnType<typeof criarApi>;
