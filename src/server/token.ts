import { createHash, randomBytes } from 'node:crypto';

/** Token opaco que só o navegador guarda. */
export function criarToken(): string {
  return randomBytes(32).toString('base64url');
}

/** O que vai para o banco. SHA-256 basta: o token já tem 256 bits aleatórios. */
export function hashDoToken(token: string): string {
  return createHash('sha256').update(token).digest('base64url');
}
