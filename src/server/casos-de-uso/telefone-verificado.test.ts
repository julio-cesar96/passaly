import { describe, expect, it } from 'vitest';
import { usarBancoDeTestes } from '../testes/banco.js';
import { codigoErrado, montarCenario, OUTRO_TELEFONE, TELEFONE } from '../testes/cenario.js';

const db = usarBancoDeTestes();

describe('solicitar código', () => {
  it('manda um SMS que contém só o código', async () => {
    const { sms, pedirCodigo } = montarCenario(db);

    expect(await pedirCodigo()).toEqual({ ok: true });

    expect(sms.enviados).toHaveLength(1);
    expect(sms.enviados[0]?.telefone).toBe(TELEFONE);
    expect(sms.enviados[0]?.texto).toMatch(/^Passaly: seu código é \d{6}$/);
  });
});

describe('conferir código', () => {
  it('código certo de quem não tem conta libera o cadastro, sem sessão', async () => {
    const { pedirCodigo, conferir } = montarCenario(db);
    await pedirCodigo();

    expect(await conferir()).toMatchObject({ ok: true, tipo: 'cadastro' });
  });

  it('código errado é recusado com motivo', async () => {
    const { pedirCodigo, codigoRecebido, conferir } = montarCenario(db);
    await pedirCodigo();

    expect(await conferir(codigoErrado(codigoRecebido()))).toEqual({
      ok: false,
      motivo: 'codigo-recusado',
    });
  });

  it('código de um telefone não serve para outro', async () => {
    const { pedirCodigo, codigoRecebido, conferir } = montarCenario(db);
    await pedirCodigo(TELEFONE);
    await pedirCodigo(OUTRO_TELEFONE);
    const doOutro = codigoRecebido(OUTRO_TELEFONE);

    expect(await conferir(doOutro, TELEFONE)).toMatchObject({ ok: false });
  });

  it('telefone que não pediu código é recusado com o mesmo motivo', async () => {
    const { conferir } = montarCenario(db);

    expect(await conferir('123456')).toEqual({ ok: false, motivo: 'codigo-recusado' });
  });

  it('telefone fora do E.164 é recusado com o mesmo motivo', async () => {
    const { conferir } = montarCenario(db);

    expect(await conferir('123456', 'x\u0000')).toEqual({ ok: false, motivo: 'codigo-recusado' });
  });

  it('código usado duas vezes é recusado na segunda', async () => {
    const { pedirCodigo, codigoRecebido, conferir } = montarCenario(db);
    await pedirCodigo();
    const codigo = codigoRecebido();
    await conferir(codigo);

    expect(await conferir(codigo)).toEqual({ ok: false, motivo: 'codigo-recusado' });
  });

  it('vale até o fim dos 10 minutos e depois vence', async () => {
    const { relogio, pedirCodigo, codigoRecebido, conferir } = montarCenario(db);
    await pedirCodigo(TELEFONE);
    await pedirCodigo(OUTRO_TELEFONE);

    relogio.avancar({ minutos: 9 });
    expect(await conferir(codigoRecebido(TELEFONE), TELEFONE)).toMatchObject({ ok: true });
    relogio.avancar({ minutos: 1 });
    expect(await conferir(codigoRecebido(OUTRO_TELEFONE), OUTRO_TELEFONE)).toEqual({
      ok: false,
      motivo: 'codigo-recusado',
    });
  });

  it('reenvio dentro dos 10 minutos manda o mesmo código, sem esticar o prazo', async () => {
    const { relogio, sms, pedirCodigo, codigoRecebido, conferir } = montarCenario(db);
    await pedirCodigo();
    const primeiro = codigoRecebido();
    relogio.avancar({ minutos: 6 });
    await pedirCodigo();

    expect(sms.enviados).toHaveLength(2);
    expect(codigoRecebido()).toBe(primeiro);
    relogio.avancar({ minutos: 4 });
    expect(await conferir(primeiro)).toMatchObject({ ok: false });
  });

  it('código novo depois de vencido volta a valer', async () => {
    const { relogio, pedirCodigo, conferir } = montarCenario(db);
    await pedirCodigo();
    relogio.avancar({ minutos: 10 });
    await pedirCodigo();

    relogio.avancar({ minutos: 9 });
    expect(await conferir()).toMatchObject({ ok: true });
  });
});

describe('limite de tentativas por código', () => {
  async function errar(cenario: ReturnType<typeof montarCenario>, vezes: number) {
    const errado = codigoErrado(cenario.codigoRecebido());
    for (let i = 0; i < vezes; i++) await cenario.conferir(errado);
  }

  it('na quinta tentativa o código certo ainda vale', async () => {
    const cenario = montarCenario(db);
    await cenario.pedirCodigo();
    await errar(cenario, 4);

    expect(await cenario.conferir()).toMatchObject({ ok: true });
  });

  it('depois de cinco tentativas, nem o código certo vale', async () => {
    const cenario = montarCenario(db);
    await cenario.pedirCodigo();
    await errar(cenario, 5);

    expect(await cenario.conferir()).toEqual({ ok: false, motivo: 'codigo-recusado' });
  });

  it('tentativas em paralelo não passam do limite', async () => {
    const cenario = montarCenario(db);
    await cenario.pedirCodigo();
    const certo = cenario.codigoRecebido();
    const errado = codigoErrado(certo);

    await Promise.all(Array.from({ length: 12 }, () => cenario.conferir(errado)));

    expect(await cenario.conferir(certo)).toMatchObject({ ok: false });
  });

  it('reenvio não devolve tentativas', async () => {
    const cenario = montarCenario(db);
    await cenario.pedirCodigo();
    await errar(cenario, 4);
    await cenario.pedirCodigo();
    await errar(cenario, 1);

    expect(await cenario.conferir()).toMatchObject({ ok: false });
  });

  it('esgotado, pedir outro manda esperar e não gasta SMS', async () => {
    const cenario = montarCenario(db);
    await cenario.pedirCodigo();
    cenario.relogio.avancar({ minutos: 3 });
    await errar(cenario, 5);

    expect(await cenario.pedirCodigo()).toEqual({ ok: false, motivo: 'aguarde', minutos: 7 });
    expect(cenario.sms.enviados).toHaveLength(1);
  });

  it('passados os 10 minutos, pede outro e entra', async () => {
    const cenario = montarCenario(db);
    await cenario.pedirCodigo();
    await errar(cenario, 5);
    cenario.relogio.avancar({ minutos: 10 });

    expect(await cenario.pedirCodigo()).toEqual({ ok: true });
    expect(await cenario.conferir()).toMatchObject({ ok: true });
  });

  it('código fora do formato é recusado sem gastar tentativa', async () => {
    const cenario = montarCenario(db);
    await cenario.pedirCodigo();
    for (let i = 0; i < 6; i++) await cenario.conferir('12ab');

    expect(await cenario.conferir()).toMatchObject({ ok: true });
  });
});

describe('fornecedor fora do ar', () => {
  it('reenvio que falha não invalida o código que já chegou', async () => {
    const { sms, pedirCodigo, conferir } = montarCenario(db);
    await pedirCodigo();
    sms.foraDoAr = true;
    await pedirCodigo();
    sms.foraDoAr = false;

    expect(await conferir()).toMatchObject({ ok: true });
  });

  it('conferência que falha não gasta tentativa', async () => {
    const { sms, pedirCodigo, conferir } = montarCenario(db);
    await pedirCodigo();
    sms.foraDoAr = true;
    for (let i = 0; i < 6; i++) await expect(conferir()).rejects.toThrow();
    sms.foraDoAr = false;

    expect(await conferir()).toMatchObject({ ok: true });
  });
});

describe('validação do pedido', () => {
  it.each(['21999999999', '+0521900000001', '+55 21 90000-0001', '+55', '', "+55219'; drop--"])(
    'recusa telefone fora do E.164 (%j) sem mandar SMS',
    async (telefone) => {
      const { sms, pedirCodigo } = montarCenario(db);

      expect(await pedirCodigo(telefone)).toEqual({ ok: false, motivo: 'telefone-invalido' });
      expect(sms.enviados).toHaveLength(0);
    },
  );

  it('recusa aviso de versão que não é a atual, sem mandar SMS', async () => {
    const { sms, passaly } = montarCenario(db);

    expect(
      await passaly.solicitarCodigo({ telefone: TELEFONE, avisoVersao: '2020-01-01' }),
    ).toEqual({ ok: false, motivo: 'aviso-desatualizado' });
    expect(sms.enviados).toHaveLength(0);
  });

  it('se o envio falha, avisa, e o pedido seguinte abre os 10 minutos inteiros', async () => {
    const { relogio, sms, pedirCodigo, conferir } = montarCenario(db);
    sms.foraDoAr = true;
    expect(await pedirCodigo()).toEqual({ ok: false, motivo: 'envio-falhou' });

    sms.foraDoAr = false;
    relogio.avancar({ minutos: 8 });
    await pedirCodigo();
    relogio.avancar({ minutos: 9 });

    expect(await conferir()).toMatchObject({ ok: true });
  });
});
