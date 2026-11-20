import { describe, expect, it } from 'vitest';
import { SmsFalso } from '../sms/sms-falso.js';
import { usarBancoDeTestes } from '../testes/banco.js';
import { RelogioControlavel } from '../testes/relogio-controlavel.js';
import { criarPassaly } from './passaly.js';

const db = usarBancoDeTestes();

function montar() {
  const relogio = new RelogioControlavel(new Date('2026-12-01T10:00:00-03:00'));
  const passaly = criarPassaly({ db, relogio, verificador: new SmsFalso() });
  return { relogio, passaly };
}

describe('o relógio avançou (ADR 0011)', () => {
  it('antes do primeiro tique, não há última execução', async () => {
    const { passaly } = montar();

    expect(await passaly.estadoDoTique()).toEqual({ ultimaExecucao: null, execucoes: 0 });
  });

  it('registra a execução no instante do relógio', async () => {
    const { relogio, passaly } = montar();

    await passaly.relogioAvancou();
    relogio.avancar({ minutos: 15 });
    await passaly.relogioAvancou();

    expect(await passaly.estadoDoTique()).toEqual({
      ultimaExecucao: new Date('2026-12-01T10:15:00-03:00'),
      execucoes: 2,
    });
  });

  it('chamar duas vezes no mesmo instante não muda nada (idempotente)', async () => {
    const { passaly } = montar();

    await passaly.relogioAvancou();
    const depoisDoPrimeiro = await passaly.estadoDoTique();
    await passaly.relogioAvancou();

    expect(await passaly.estadoDoTique()).toEqual(depoisDoPrimeiro);
    expect(depoisDoPrimeiro).toEqual({
      ultimaExecucao: new Date('2026-12-01T10:00:00-03:00'),
      execucoes: 1,
    });
  });
});
