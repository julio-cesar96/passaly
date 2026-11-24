import { type ReactNode, useEffect, useRef } from 'react';
import { ComIcone } from './ui/field.js';

let primeiraTela = true;

/**
 * Casca de toda tela: título da aba, `<main>` e `<h1>`. Trocar de tela num SPA não move o foco nem
 * avisa o leitor de tela, e nenhum primitivo faz isso; por isso o foco vai ao título, menos na
 * primeira carga, que o navegador já anuncia, e na tela que põe o foco num campo.
 */
export function Tela({
  titulo,
  children,
  focarTitulo = true,
}: {
  titulo: string;
  children: ReactNode;
  focarTitulo?: boolean;
}) {
  const h1 = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    document.title = `${titulo} · Passaly`;
    if (!primeiraTela && focarTitulo) h1.current?.focus();
    primeiraTela = false;
  }, [titulo, focarTitulo]);

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-4">
      <h1 ref={h1} tabIndex={-1} className="text-2xl font-semibold outline-none">
        {titulo}
      </h1>
      {children}
    </main>
  );
}

/** Erro que não é de um campo. O `alert` faz o leitor de tela falar sem mover o foco; nenhum primitivo cobre. */
export function AvisoDeErro({ children }: { children: ReactNode }) {
  return (
    // Vazio, sai do fluxo para não deixar vão, mas continua na árvore de acessibilidade.
    <div role="alert" className="text-destructive empty:absolute">
      {children && <ComIcone>{children}</ComIcone>}
    </div>
  );
}

export const SEM_CONEXAO = 'Não deu certo agora. Confira a internet e tente de novo em instantes.';
