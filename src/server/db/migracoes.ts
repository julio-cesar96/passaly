import { fileURLToPath } from 'node:url';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { conectar } from './cliente.js';

const pastaDasMigracoes = fileURLToPath(new URL('../../../drizzle', import.meta.url));

export async function aplicarMigracoes(url: string): Promise<void> {
  const { db, fechar } = conectar(url);
  try {
    await migrate(db, { migrationsFolder: pastaDasMigracoes });
  } finally {
    await fechar();
  }
}
