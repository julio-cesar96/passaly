import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

const pastaDoServidor = fileURLToPath(new URL('./src/server/', import.meta.url));
const PACOTES_SO_DO_SERVIDOR =
  /\/node_modules\/(\.pnpm\/[^/]+\/node_modules\/)?(pg|pg-[^/]+|drizzle-orm|@hono\/node-server)\//;

/**
 * Fronteira cliente/servidor (ADR 0008): nada de banco ou segredo no navegador. O cliente só pode
 * importar *tipos* do servidor (`import type`, apagado na compilação); qualquer import de valor quebra.
 */
function soCodigoDoCliente(): Plugin {
  return {
    name: 'passaly:so-codigo-do-cliente',
    load(id) {
      if (id.startsWith(pastaDoServidor) || PACOTES_SO_DO_SERVIDOR.test(id)) {
        throw new Error(`O cliente importou código do servidor: ${id}. Use \`import type\`.`);
      }
      return null;
    },
  };
}

export default defineConfig({
  root: 'src/client',
  plugins: [soCodigoDoCliente(), react()],
  build: { outDir: '../../dist/client', emptyOutDir: true },
  server: { proxy: { '/api/': 'http://localhost:3000' } },
});
