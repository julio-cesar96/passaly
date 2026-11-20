import { randomInt } from 'node:crypto';
import type { Verificador } from './verificador.js';

export type SmsEnviado = { telefone: string; codigo: string };

/**
 * Dublê de borda (spec #2, ADR 0010): registra o que seria enviado, sem fornecedor real.
 * Cada código vale para uma conferência aprovada; um código novo substitui o anterior.
 */
export class SmsFalso implements Verificador {
  readonly enviados: SmsEnviado[] = [];
  readonly #pendentes = new Map<string, string>();

  async enviarCodigo(telefone: string): Promise<void> {
    const codigo = String(randomInt(0, 1_000_000)).padStart(6, '0');
    this.enviados.push({ telefone, codigo });
    this.#pendentes.set(telefone, codigo);
  }

  async conferirCodigo(telefone: string, codigo: string): Promise<'aprovado' | 'recusado'> {
    if (this.#pendentes.get(telefone) !== codigo) return 'recusado';
    this.#pendentes.delete(telefone);
    return 'aprovado';
  }
}
