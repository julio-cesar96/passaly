import { CSPProvider } from '@base-ui/react/csp-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  redirect,
} from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { POLITICA_DE_PRIVACIDADE, TERMOS_DE_USO } from '../compartilhado/textos.js';
import { PaginaLegal } from './documento-legal.js';
import { Entrar } from './entrar/entrar.js';
import { Inicio } from './inicio.js';
import { consultaDaSessao } from './sessao.js';
import { AvisoDeErro, SEM_CONEXAO, Tela } from './tela.js';
import { Button } from './ui/button.js';

// Sem rede, a ação falha e avisa. O padrão pausa até voltar a conexão, e o botão fica preso.
const queryClient = new QueryClient({
  defaultOptions: { queries: { networkMode: 'always' }, mutations: { networkMode: 'always' } },
});
const rotaRaiz = createRootRoute({ errorComponent: FalhaAoCarregar });

const sessao = () => queryClient.ensureQueryData(consultaDaSessao);

const rotaInicio = createRoute({
  getParentRoute: () => rotaRaiz,
  path: '/',
  // Sem sessão, só a entrada: a landing vem em outro ticket.
  beforeLoad: async () => {
    if ((await sessao()).estado !== 'sessao') throw redirect({ to: '/entrar' });
  },
  component: Inicio,
});
const rotaEntrar = createRoute({
  getParentRoute: () => rotaRaiz,
  path: '/entrar',
  beforeLoad: async () => {
    if ((await sessao()).estado === 'sessao') throw redirect({ to: '/' });
  },
  component: Entrar,
});
const rotaTermos = createRoute({
  getParentRoute: () => rotaRaiz,
  path: '/termos',
  component: () => <PaginaLegal documento={TERMOS_DE_USO} />,
});
const rotaPrivacidade = createRoute({
  getParentRoute: () => rotaRaiz,
  path: '/privacidade',
  component: () => <PaginaLegal documento={POLITICA_DE_PRIVACIDADE} />,
});
const router = createRouter({
  routeTree: rotaRaiz.addChildren([rotaInicio, rotaEntrar, rotaTermos, rotaPrivacidade]),
});

function FalhaAoCarregar() {
  return (
    <Tela titulo="Passaly">
      <AvisoDeErro>{SEM_CONEXAO}</AvisoDeErro>
      <Button onClick={() => location.reload()}>Recarregar a página</Button>
    </Tela>
  );
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const elemento = document.getElementById('app');
if (!elemento) throw new Error('Elemento #app não encontrado');

createRoot(elemento).render(
  <StrictMode>
    {/* Sem <style> em runtime: o CSP bloqueia (ADR 0013). Regras em ui/estilos-injetados.css. */}
    <CSPProvider disableStyleElements>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </CSPProvider>
  </StrictMode>,
);
