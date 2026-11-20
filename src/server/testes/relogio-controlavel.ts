import type { Relogio } from '../relogio.js';

/** Dublê de borda (spec #2): o teste decide que horas são e faz o tempo passar. */
export class RelogioControlavel implements Relogio {
  #agora: Date;

  constructor(inicio: Date) {
    this.#agora = new Date(inicio);
  }

  agora(): Date {
    return new Date(this.#agora);
  }

  avancar({ horas = 0, minutos = 0 }: { horas?: number; minutos?: number }): void {
    this.#agora = new Date(this.#agora.getTime() + (horas * 60 + minutos) * 60_000);
  }
}
