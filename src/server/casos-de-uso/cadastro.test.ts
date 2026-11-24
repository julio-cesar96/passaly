import { describe, expect, it } from 'vitest';
import { usarBancoDeTestes } from '../testes/banco.js';
import { cadastroValido, montarCenario, OUTRO_TELEFONE, TELEFONE } from '../testes/cenario.js';

const db = usarBancoDeTestes();

describe('cadastro', () => {
  it('com Telefone verificado e todos os campos, cria a conta e abre a sessão', async () => {
    const { passaly, verificarSemConta } = montarCenario(db);
    const token = await verificarSemConta();

    const resultado = await passaly.cadastrar(cadastroValido(token));

    if (!resultado.ok) throw new Error(resultado.motivo);
    expect(await passaly.consultarSessao(resultado.token)).toMatchObject({
      conta: { apelido: 'Ana da Ilha', bairro: 'Cocotá', papel: 'usuario' },
    });
  });

  it('grava a versão aceita dos termos, da política e da autodeclaração', async () => {
    const { passaly, cadastrar } = montarCenario(db);
    const sessao = await passaly.consultarSessao(await cadastrar());

    const aceitoEm = new Date('2026-12-01T10:00:00-03:00');
    expect(sessao?.conta.aceites).toEqual([
      { documento: 'autodeclaracao', versao: '2026-11-24', aceitoEm },
      { documento: 'politica', versao: 'rascunho-2026-11-24', aceitoEm },
      { documento: 'termos', versao: 'rascunho-2026-11-24', aceitoEm },
    ]);
  });

  it('sem telefone verificado é recusado', async () => {
    const { passaly } = montarCenario(db);

    expect(await passaly.cadastrar(cadastroValido('inventado'))).toEqual({
      ok: false,
      motivo: 'telefone-nao-verificado',
    });
  });

  it('só pedir o código não permite cadastro', async () => {
    const { passaly, pedirCodigo, conferir } = montarCenario(db);
    await pedirCodigo();
    const recusa = await conferir('12ab');

    expect(recusa).not.toHaveProperty('token');
    expect(await passaly.cadastrar(cadastroValido(''))).toMatchObject({
      motivo: 'telefone-nao-verificado',
    });
  });

  it('"verificado sem conta" vale até o fim dos 30 minutos e depois vence', async () => {
    const { relogio, passaly, verificarSemConta } = montarCenario(db);
    const a = await verificarSemConta(TELEFONE);
    const b = await verificarSemConta(OUTRO_TELEFONE);

    relogio.avancar({ minutos: 29 });
    expect(await passaly.cadastrar(cadastroValido(a))).toMatchObject({ ok: true });
    relogio.avancar({ minutos: 1 });
    expect(await passaly.cadastrar(cadastroValido(b))).toEqual({
      ok: false,
      motivo: 'telefone-nao-verificado',
    });
  });

  it('"verificado sem conta" não é conta nem sessão', async () => {
    const { passaly, verificarSemConta, pedirCodigo, conferir } = montarCenario(db);
    const token = await verificarSemConta();

    expect(await passaly.consultarSessao(token)).toBeNull();
    await pedirCodigo();
    expect(await conferir()).toMatchObject({ ok: true, tipo: 'cadastro' });
  });

  it('o estado "verificado sem conta" serve uma vez só', async () => {
    const { passaly, verificarSemConta } = montarCenario(db);
    const token = await verificarSemConta();
    await passaly.cadastrar(cadastroValido(token));

    expect(await passaly.cadastrar(cadastroValido(token))).toEqual({
      ok: false,
      motivo: 'telefone-nao-verificado',
    });
  });

  it('dois cadastros simultâneos do mesmo número criam uma conta só', async () => {
    const { passaly, verificarSemConta } = montarCenario(db);
    const tokens = [await verificarSemConta(), await verificarSemConta()];

    const resultados = await Promise.all(
      tokens.map((token, i) =>
        passaly.cadastrar({ ...cadastroValido(token), apelido: `Pessoa ${i}` }),
      ),
    );

    expect(resultados.filter((r) => r.ok)).toHaveLength(1);
    expect(resultados.find((r) => !r.ok)).toEqual({ ok: false, motivo: 'conta-ja-existe' });
  });

  it('o mesmo cadastro enviado duas vezes ao mesmo tempo cria uma conta só', async () => {
    const { passaly, verificarSemConta } = montarCenario(db);
    const token = await verificarSemConta();

    const resultados = await Promise.all([
      passaly.cadastrar(cadastroValido(token)),
      passaly.cadastrar(cadastroValido(token)),
    ]);

    expect(resultados.filter((r) => r.ok)).toHaveLength(1);
  });

  it('campos recusados não gastam o telefone verificado', async () => {
    const { passaly, verificarSemConta } = montarCenario(db);
    const token = await verificarSemConta();
    await passaly.cadastrar({ ...cadastroValido(token), bairro: 'Leblon' });

    expect(await passaly.cadastrar(cadastroValido(token))).toMatchObject({ ok: true });
  });
});

describe('telefone verificado', () => {
  it('a tela sabe se o cadastro ainda pode seguir', async () => {
    const { relogio, passaly, verificarSemConta } = montarCenario(db);
    const token = await verificarSemConta();

    expect(await passaly.cadastroPendente(token)).toBe(true);
    expect(await passaly.cadastroPendente('inventado')).toBe(false);
    relogio.avancar({ minutos: 30 });
    expect(await passaly.cadastroPendente(token)).toBe(false);
  });
});

describe('campos do cadastro', () => {
  async function recusa(campos: Record<string, unknown>) {
    const { passaly, verificarSemConta } = montarCenario(db);
    return passaly.cadastrar({ ...cadastroValido(await verificarSemConta()), ...campos });
  }
  const aceites = {
    termos: 'rascunho-2026-11-24',
    politica: 'rascunho-2026-11-24',
    autodeclaracao: '2026-11-24',
  };

  it.each([
    ['', 'tamanho'],
    [' A ', 'tamanho'],
    ['a'.repeat(31), 'tamanho'],
    ['ana@site.com', 'caracteres'],
    ['<b>Ana</b>', 'caracteres'],
    ['Ana 21900000001', 'digitos'],
  ])('recusa o apelido %j (%s)', async (apelido, motivo) => {
    expect(await recusa({ apelido })).toEqual({
      ok: false,
      motivo: 'campos-invalidos',
      campos: { apelido: motivo },
    });
  });

  it.each(['Zé', 'João Pedro', "Mãe d'Ilha 2024", 'Ana-Lu.'])('aceita o apelido %j', async (a) => {
    expect(await recusa({ apelido: a })).toMatchObject({ ok: true });
  });

  it('tira espaço sobrando do apelido', async () => {
    const { passaly, cadastrar } = montarCenario(db);
    const token = await cadastrar(TELEFONE, { apelido: '  Ana   da Ilha ' });

    expect((await passaly.consultarSessao(token))?.conta.apelido).toBe('Ana da Ilha');
  });

  it.each(['', 'Leblon', 'Cidade Universitária', 'cocotá'])(
    'recusa o bairro %j, fora da lista da Ilha',
    async (bairro) => {
      expect(await recusa({ bairro })).toEqual({
        ok: false,
        motivo: 'campos-invalidos',
        campos: { bairro: 'fora-da-lista' },
      });
    },
  );

  it.each(['termos', 'politica', 'autodeclaracao'] as const)('exige o aceite: %s', async (doc) => {
    expect(await recusa({ aceites: { ...aceites, [doc]: null } })).toEqual({
      ok: false,
      motivo: 'campos-invalidos',
      campos: { [doc]: 'falta' },
    });
  });

  it('recusa aceite de versão que não é a atual', async () => {
    expect(await recusa({ aceites: { ...aceites, termos: 'antiga' } })).toEqual({
      ok: false,
      motivo: 'textos-desatualizados',
    });
  });

  it('aponta todos os campos de uma vez', async () => {
    expect(
      await recusa({
        apelido: '',
        bairro: '',
        aceites: { termos: null, politica: null, autodeclaracao: null },
      }),
    ).toEqual({
      ok: false,
      motivo: 'campos-invalidos',
      campos: {
        apelido: 'tamanho',
        bairro: 'fora-da-lista',
        termos: 'falta',
        politica: 'falta',
        autodeclaracao: 'falta',
      },
    });
  });
});
