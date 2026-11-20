import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRootRoute, createRoute, createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Inicio } from './inicio.js';

const rotaRaiz = createRootRoute();
const rotaInicio = createRoute({ getParentRoute: () => rotaRaiz, path: '/', component: Inicio });
const router = createRouter({ routeTree: rotaRaiz.addChildren([rotaInicio]) });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();
const elemento = document.getElementById('app');
if (!elemento) throw new Error('Elemento #app não encontrado');

createRoot(elemento).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
