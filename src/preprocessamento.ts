import ImageResizer from '@bam.tech/react-native-image-resizer';
import { decode as decodeJpeg } from 'jpeg-js';

import { TAMANHO_ENTRADA } from './constantes';

/**
 * Redimensiona a foto para TAMANHO_ENTRADA x TAMANHO_ENTRADA (sem
 * preservar aspect ratio - "stretch", igual ao resize usado no treino
 * em Python) e devolve os pixels crus em RGB (uint8, sem normalização),
 * prontos para alimentar o modelo.
 */
export async function prepararEntrada(uriImagem: string): Promise<Uint8Array> {
  const redimensionada = await ImageResizer.createResizedImage(
    uriImagem,
    TAMANHO_ENTRADA,
    TAMANHO_ENTRADA,
    'JPEG',
    100,
    0,
    undefined,
    false,
    { mode: 'stretch' },
  );

  const resposta = await fetch(redimensionada.uri);
  const bytesJpeg = new Uint8Array(await resposta.arrayBuffer());

  const { data, width, height } = decodeJpeg(bytesJpeg, {
    useTArray: true,
    formatAsRGBA: false,
  });

  if (width !== TAMANHO_ENTRADA || height !== TAMANHO_ENTRADA) {
    throw new Error(
      `Redimensionamento retornou ${width}x${height}, esperado ${TAMANHO_ENTRADA}x${TAMANHO_ENTRADA}`,
    );
  }

  return data as Uint8Array;
}
