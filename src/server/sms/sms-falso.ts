import { randomInt } from 'node:crypto';
import type { Relogio } from '../relogio.js';
import type { Verificador } from './verificador.js';

export type SmsEnviado = { telefone: string; texto: string };

const VALIDADE_MS = 10 * 60_000;

/**
 * Dublê de borda (spec #2, ADR 0010): registra o que seria enviado, sem fornecedor real.
 * Imita a Twilio Verify: o código vale 10 min e uma aprovação, e pedir de novo nesse prazo manda o
 * mesmo código (https://www.twilio.com/docs/verify/api/rate-limits-and-timeouts). Não limita
 * tentativas, para o limite do caso de uso ser provado sozinho.
 * Trava dupla: fica fora do build (tsconfig.build.json) e se recusa a nascer em produção.
 */
export class SmsFalso implements Verificador {
  readonly enviados: SmsEnviado[] = [];
  /** Para o cenário em que o fornecedor não responde. */
  foraDoAr = false;
  readonly #pendentes = new Map<string, { codigo: string; venceEm: number }>();
  readonly #relogio: Relogio;

  constructor(relogio: Relogio) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SMS falso não roda em produção (NODE_ENV=production)');
    }
    this.#relogio = relogio;
  }

  async enviarCodigo(telefone: string): Promise<void> {
    if (this.foraDoAr) throw new Error('fornecedor de SMS fora do ar');
    const pendente = this.#pendente(telefone) ?? {
      codigo: String(randomInt(0, 1_000_000)).padStart(6, '0'),
      venceEm: this.#relogio.agora().getTime() + VALIDADE_MS,
    };
    this.#pendentes.set(telefone, pendente);
    this.enviados.push({ telefone, texto: `Passaly: seu código é ${pendente.codigo}` });
  }

  async conferirCodigo(telefone: string, codigo: string): Promise<'aprovado' | 'recusado'> {
    if (this.#pendente(telefone)?.codigo !== codigo) return 'recusado';
    this.#pendentes.delete(telefone);
    return 'aprovado';
  }

  #pendente(telefone: string) {
    const pendente = this.#pendentes.get(telefone);
    return pendente && pendente.venceEm > this.#relogio.agora().getTime() ? pendente : undefined;
  }
}
