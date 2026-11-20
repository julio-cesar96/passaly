// Aplica as migrações versionadas de drizzle/: `pnpm db:migrate`.
import { lerConfig } from '../config.js';
import { log } from '../log.js';
import { aplicarMigracoes } from './migracoes.js';

await aplicarMigracoes(lerConfig().databaseUrl);
log.info('migrações aplicadas');
