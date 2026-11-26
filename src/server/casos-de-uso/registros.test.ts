import { describe, expect, it } from 'vitest';
import { usarBancoDeTestes } from '../testes/banco.js';
import {
  AVISO,
  montarCenario,
  OUTRO_TELEFONE,
  TELEFONE,
  TELEFONE_DO_FUNDADOR,
} from '../testes/cenario.js';

const db = usarBancoDeTestes();

describe('log de acesso (spec #2)', () => {
  it('grava IP, porta e data/hora no cadastro e em cada login, sem telefone', async () => {
    const { relogio, passaly, cadastrar, pedirCodigo, codigoRecebido } = montarCenario(db);
    const fundador = await cadastrar(TELEFONE_DO_FUNDADOR);
    const conta = (await passaly.consultarSessao(await cadastrar()))?.conta;
    if (!conta) throw new Error('sem conta');

    relogio.avancar({ horas: 2 });
    await pedirCodigo();
    await passaly.conferirCodigo({
      telefone: TELEFONE,
      codigo: codigoRecebido(),
      origem: { ip: '2001:db8::5', porta: 40000 },
    });

    expect(await passaly.acessosDaConta({ sessaoDoFundador: fundador, contaId: conta.id })).toEqual(
      {
        ok: true,
        acessos: [
          {
            tipo: 'cadastro',
            ip: '203.0.113.7',
            porta: 51234,
            em: new Date('2026-12-01T10:00:00-03:00'),
          },
          {
            tipo: 'login',
            ip: '2001:db8::5',
            porta: 40000,
            em: new Date('2026-12-01T12:00:00-03:00'),
          },
        ],
      },
    );
  });

  it('código recusado e uso da sessão não geram acesso', async () => {
    const { passaly, cadastrar, pedirCodigo, conferir } = montarCenario(db);
    const fundador = await cadastrar(TELEFONE_DO_FUNDADOR);
    const id = (await passaly.consultarSessao(fundador))?.conta.id ?? '';
    await pedirCodigo(TELEFONE_DO_FUNDADOR);
    await conferir('12ab', TELEFONE_DO_FUNDADOR);

    const resultado = await passaly.acessosDaConta({ sessaoDoFundador: fundador, contaId: id });

    expect(resultado.ok && resultado.acessos).toHaveLength(1);
  });

  it('só o fundador consulta', async () => {
    const { passaly, cadastrar } = montarCenario(db);
    const usuario = await cadastrar();
    const id = (await passaly.consultarSessao(usuario))?.conta.id ?? '';

    for (const sessaoDoFundador of [usuario, 'inventado']) {
      expect(await passaly.acessosDaConta({ sessaoDoFundador, contaId: id })).toEqual({
        ok: false,
        motivo: 'sem-permissao',
      });
    }
  });
});

describe('prova de pedido de código (Twilio)', () => {
  it('cada pedido grava telefone, instante e versão do aviso, com ou sem conta', async () => {
    const { relogio, passaly, cadastrar, pedirCodigo } = montarCenario(db);
    const fundador = await cadastrar(TELEFONE_DO_FUNDADOR);
    await pedirCodigo(OUTRO_TELEFONE);
    relogio.avancar({ minutos: 1 });
    await pedirCodigo(OUTRO_TELEFONE);

    expect(
      await passaly.provasDePedido({ sessaoDoFundador: fundador, telefone: OUTRO_TELEFONE }),
    ).toEqual({
      ok: true,
      provas: [
        {
          telefone: OUTRO_TELEFONE,
          pedidoEm: new Date('2026-12-01T10:00:00-03:00'),
          avisoVersao: AVISO,
        },
        {
          telefone: OUTRO_TELEFONE,
          pedidoEm: new Date('2026-12-01T10:01:00-03:00'),
          avisoVersao: AVISO,
        },
      ],
    });
  });

  it('pedido recusado não vira prova', async () => {
    const { passaly, cadastrar } = montarCenario(db);
    const fundador = await cadastrar(TELEFONE_DO_FUNDADOR);
    await passaly.solicitarCodigo({ telefone: TELEFONE, avisoVersao: 'outra' });

    expect(
      await passaly.provasDePedido({ sessaoDoFundador: fundador, telefone: TELEFONE }),
    ).toEqual({ ok: true, provas: [] });
  });

  it('só o fundador consulta', async () => {
    const { passaly, cadastrar } = montarCenario(db);
    const usuario = await cadastrar();

    expect(await passaly.provasDePedido({ sessaoDoFundador: usuario, telefone: TELEFONE })).toEqual(
      { ok: false, motivo: 'sem-permissao' },
    );
  });
});
