import { describe, expect, it } from 'vitest';
import { usarBancoDeTestes } from '../testes/banco.js';
import {
  codigoErrado,
  montarCenario,
  ORIGEM,
  TELEFONE,
  TELEFONE_DO_FUNDADOR,
} from '../testes/cenario.js';

const db = usarBancoDeTestes();
const DIA = 24;

type Cenario = ReturnType<typeof montarCenario>;

async function entrar({ pedirCodigo, conferir, codigoRecebido }: Cenario, telefone = TELEFONE) {
  await pedirCodigo(telefone);
  const conferencia = await conferir(codigoRecebido(telefone), telefone);
  if (!conferencia.ok || conferencia.tipo !== 'sessao') throw new Error('esperava sessão');
  return conferencia;
}

describe('sessão longa', () => {
  it('segue valendo no mesmo aparelho sem novo código', async () => {
    const { relogio, sms, passaly, cadastrar } = montarCenario(db);
    const token = await cadastrar();

    relogio.avancar({ horas: 179 * DIA });

    expect(await passaly.consultarSessao(token)).not.toBeNull();
    expect(sms.enviados).toHaveLength(1);
  });

  it('vence 180 dias depois do último uso', async () => {
    const { relogio, passaly, cadastrar } = montarCenario(db);
    const token = await cadastrar();

    relogio.avancar({ horas: 180 * DIA });

    expect(await passaly.consultarSessao(token)).toBeNull();
  });

  it('o uso renova os 180 dias', async () => {
    const { relogio, passaly, cadastrar } = montarCenario(db);
    const token = await cadastrar();

    relogio.avancar({ horas: 100 * DIA });
    const sessao = await passaly.consultarSessao(token);
    relogio.avancar({ horas: 100 * DIA });

    expect(sessao?.renovadaAte).toEqual(new Date('2027-09-07T10:00:00-03:00'));
    expect(await passaly.consultarSessao(token)).not.toBeNull();
  });

  it('não renova duas vezes no mesmo dia', async () => {
    const { relogio, passaly, cadastrar } = montarCenario(db);
    const token = await cadastrar();

    relogio.avancar({ horas: 23 });

    expect((await passaly.consultarSessao(token))?.renovadaAte).toBeNull();
  });

  it('sessão revogada não vale mais', async () => {
    const { passaly, cadastrar } = montarCenario(db);
    const token = await cadastrar();

    await passaly.sair(token);

    expect(await passaly.consultarSessao(token)).toBeNull();
  });

  it('token inventado não vale', async () => {
    const { passaly, cadastrar } = montarCenario(db);
    await cadastrar();

    expect(await passaly.consultarSessao('inventado')).toBeNull();
  });
});

describe('login', () => {
  it('conta existente em aparelho novo pede outro código e mantém a sessão antiga', async () => {
    const cenario = montarCenario(db);
    const antiga = await cenario.cadastrar();

    const nova = await entrar(cenario);

    expect(cenario.sms.enviados).toHaveLength(2);
    const sessao = await cenario.passaly.consultarSessao(nova.token);
    expect(sessao?.conta.apelido).toBe('Ana da Ilha');
    expect(await cenario.passaly.consultarSessao(antiga)).not.toBeNull();
  });

  it('entrar de novo no mesmo navegador revoga a sessão anterior dele', async () => {
    const { passaly, cadastrar, pedirCodigo, codigoRecebido } = montarCenario(db);
    const anterior = await cadastrar();
    await pedirCodigo();

    await passaly.conferirCodigo({
      telefone: TELEFONE,
      codigo: codigoRecebido(),
      origem: ORIGEM,
      sessaoAnterior: anterior,
    });

    expect(await passaly.consultarSessao(anterior)).toBeNull();
  });

  it('antes do código conferido, a resposta é igual com e sem conta', async () => {
    const { cadastrar, pedirCodigo, codigoRecebido, conferir } = montarCenario(db);
    await cadastrar(TELEFONE);
    const semConta = '+5521900000003';

    expect(await pedirCodigo(TELEFONE)).toEqual(await pedirCodigo(semConta));
    const recusaComConta = await conferir(codigoErrado(codigoRecebido(TELEFONE)), TELEFONE);
    const recusaSemConta = await conferir(codigoErrado(codigoRecebido(semConta)), semConta);
    expect(recusaComConta).toEqual({ ok: false, motivo: 'codigo-recusado' });
    expect(recusaSemConta).toEqual(recusaComConta);
  });
});

describe('papel de fundador', () => {
  it('só a conta configurada é fundador', async () => {
    const { passaly, cadastrar } = montarCenario(db);
    const fundador = await cadastrar(TELEFONE_DO_FUNDADOR);
    const outra = await cadastrar(TELEFONE);

    expect((await passaly.consultarSessao(fundador))?.conta.papel).toBe('fundador');
    expect((await passaly.consultarSessao(outra))?.conta.papel).toBe('usuario');
  });
});
