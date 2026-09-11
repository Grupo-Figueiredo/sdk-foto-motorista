import { obterModelo } from './modelo';
import { prepararEntrada } from './preprocessamento';
import { SAIDA_QUANT_SCALE, SAIDA_QUANT_ZERO_POINT } from './constantes';
import type { ResultadoClassificacao } from './tipos';

export type { ClasseFotoMotorista, ResultadoClassificacao } from './tipos';

/**
 * Classifica uma foto do motorista como "dentro_cabine" ou "fora_cabine".
 *
 * @param uriImagem URI local da foto já capturada pelo app (ex: retorno
 *   da câmera ou de um image picker).
 */
export async function classificarFotoMotorista(uriImagem: string): Promise<ResultadoClassificacao> {
  const modelo = await obterModelo();
  const pixels = await prepararEntrada(uriImagem);

  const bufferEntrada = pixels.buffer.slice(
    pixels.byteOffset,
    pixels.byteOffset + pixels.byteLength,
  ) as ArrayBuffer;

  const [saidaBuffer] = await modelo.run([bufferEntrada]);
  const saida = new Uint8Array(saidaBuffer as ArrayBuffer);
  const bruto = saida[0] as number;

  const probabilidadeForaCabine = (bruto - SAIDA_QUANT_ZERO_POINT) * SAIDA_QUANT_SCALE;

  const classe = probabilidadeForaCabine >= 0.5 ? 'fora_cabine' : 'dentro_cabine';
  const confianca = classe === 'fora_cabine' ? probabilidadeForaCabine : 1 - probabilidadeForaCabine;

  return { classe, confianca };
}
