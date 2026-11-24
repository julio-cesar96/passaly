import type { Context } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';

type Nome = 'sessao' | 'cadastro';

/** Cookies do Passaly: httpOnly, SameSite=Lax e, em produção, Secure com o prefixo `__Host-`. */
export function criarCookies(producao: boolean) {
  const nomeReal = (nome: Nome) => (producao ? `__Host-${nome}` : nome);
  const atributos = { path: '/', httpOnly: true, secure: producao, sameSite: 'Lax' } as const;

  return {
    ler: (c: Context, nome: Nome) => getCookie(c, nomeReal(nome)),
    gravar(c: Context, nome: Nome, token: string, expiraEm: Date): void {
      const maxAge = Math.max(0, Math.floor((expiraEm.getTime() - Date.now()) / 1000));
      setCookie(c, nomeReal(nome), token, { ...atributos, maxAge });
    },
    apagar(c: Context, nome: Nome): void {
      deleteCookie(c, nomeReal(nome), atributos);
    },
  };
}
