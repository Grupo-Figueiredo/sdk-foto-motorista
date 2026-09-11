import { loadTensorflowModel, type TensorflowModel } from 'react-native-fast-tflite';

let modeloPromise: Promise<TensorflowModel> | null = null;

/**
 * Carrega o modelo uma única vez (lazy) e reutiliza a mesma instância nas
 * chamadas seguintes.
 */
export function obterModelo(): Promise<TensorflowModel> {
  if (!modeloPromise) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    modeloPromise = loadTensorflowModel(require('../assets/modelo_foto_motorista.tflite'), []);
  }
  return modeloPromise;
}
