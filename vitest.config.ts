import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    globalSetup: ['src/server/testes/preparar-banco.ts'],
    // Os testes dividem um Postgres real; rodar um arquivo por vez evita que um apague o banco do outro.
    fileParallelism: false,
  },
});
