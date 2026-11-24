import type { DocumentoLegal } from '../compartilhado/textos.js';
import { Tela } from './tela.js';

export function PaginaLegal({ documento }: { documento: DocumentoLegal }) {
  return (
    <Tela titulo={documento.titulo}>
      <p className="rounded-lg bg-secondary p-3 text-secondary-foreground">
        Rascunho. Este texto ainda vai mudar. Versão {documento.versao}.
      </p>
      {documento.secoes.map((secao) => (
        <section key={secao.titulo} className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">{secao.titulo}</h2>
          {secao.paragrafos.map((paragrafo) => (
            <p key={paragrafo}>{paragrafo}</p>
          ))}
        </section>
      ))}
    </Tela>
  );
}
