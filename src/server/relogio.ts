/** Fonte do "agora" do Passaly. Em produção é o relógio do sistema; nos testes, o relógio controlável. */
export interface Relogio {
  agora(): Date;
}

export const relogioDoSistema: Relogio = { agora: () => new Date() };
