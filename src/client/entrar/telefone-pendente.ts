const CHAVE = 'telefone-pendente';
const VALIDADE_MS = 10 * 60_000;

/**
 * Telefone entre "Receber código" e o código conferido. Fica na aba porque o Android pode descartá-la
 * quando a pessoa abre o SMS. Some ao confirmar, ao trocar o celular e quando o código vence.
 */
export const telefonePendente = {
  ler(): string | null {
    try {
      const [telefone, gravadoEm] = JSON.parse(sessionStorage.getItem(CHAVE) ?? '[]');
      if (telefone && Date.now() - gravadoEm < VALIDADE_MS) return telefone;
    } catch {
      // Sem storage (bloqueado ou corrompido) a pessoa só pede outro código.
    }
    this.apagar();
    return null;
  },
  gravar(telefone: string): void {
    try {
      sessionStorage.setItem(CHAVE, JSON.stringify([telefone, Date.now()]));
    } catch {}
  },
  apagar(): void {
    try {
      sessionStorage.removeItem(CHAVE);
    } catch {}
  },
};
