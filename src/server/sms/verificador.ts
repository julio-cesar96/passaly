/**
 * Interface do verificador de telefone (ADR 0010). Em produção, adaptador da Twilio Verify (#26);
 * nos testes, o SMS falso. Os limites de envio moram no caso de uso "solicitar código", nunca aqui.
 * O telefone chega em E.164 (ex.: +5521...).
 */
export interface Verificador {
  enviarCodigo(telefone: string): Promise<void>;
  conferirCodigo(telefone: string, codigo: string): Promise<'aprovado' | 'recusado'>;
}
