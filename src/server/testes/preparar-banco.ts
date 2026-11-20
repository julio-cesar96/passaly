import { aplicarMigracoes } from '../db/migracoes.js';
import { urlDoBancoDeTestes } from './banco.js';

export default async function prepararBanco(): Promise<void> {
  await aplicarMigracoes(urlDoBancoDeTestes());
}
