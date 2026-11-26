// Entrada de produção.
import { criarPassaly } from './casos-de-uso/passaly.js';
import { lerConfig } from './config.js';
import { conectar } from './db/cliente.js';
import { relogioDoSistema } from './relogio.js';
import { subirServidor } from './servidor.js';
import type { Verificador } from './sms/verificador.js';

/** Até a Twilio Verify chegar (#26) não há verificador de produção, e o servidor não sobe. */
function criarVerificador(): Verificador {
  throw new Error('Sem verificador de produção: a Twilio Verify chega na #26');
}

const config = lerConfig();
const verificador = criarVerificador();
const { db } = conectar(config.databaseUrl);
const { telefoneDoFundador } = config;
const passaly = criarPassaly({ db, relogio: relogioDoSistema, verificador, telefoneDoFundador });

subirServidor(passaly, { ...config, servirSpa: true });
