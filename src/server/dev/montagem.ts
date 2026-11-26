// Só para desenvolvimento: esta pasta fica fora do build (tsconfig.build.json).
import { criarPassaly } from '../casos-de-uso/passaly.js';
import type { Config } from '../config.js';
import type { Db } from '../db/cliente.js';
import { relogioDoSistema } from '../relogio.js';
import { SmsFalso } from '../sms/sms-falso.js';

/** Relógio real e SMS falso. Com NODE_ENV=production, o SMS falso lança erro e nada sobe. */
export function montarPassalyLocal(db: Db, { telefoneDoFundador }: Config) {
  const sms = new SmsFalso(relogioDoSistema);
  const passaly = criarPassaly({
    db,
    relogio: relogioDoSistema,
    verificador: sms,
    telefoneDoFundador,
  });
  return { passaly, sms };
}
