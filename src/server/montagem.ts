import { criarPassaly } from './casos-de-uso/passaly.js';
import type { Db } from './db/cliente.js';
import { relogioDoSistema } from './relogio.js';
import { SmsFalso } from './sms/sms-falso.js';

/** Monta o Passaly com as dependências reais. */
export function montarPassalyDeProducao(db: Db) {
  // Ainda não há caso de uso que envie SMS. O adaptador da Twilio Verify substitui o falso no #26.
  return criarPassaly({ db, relogio: relogioDoSistema, verificador: new SmsFalso() });
}
