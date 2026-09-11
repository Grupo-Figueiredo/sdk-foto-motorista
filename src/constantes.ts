/**
 * Parâmetros de quantização do tensor de saída do modelo embarcado em
 * assets/modelo_foto_motorista.tflite (int8/uint8, 1 saída sigmoid =
 * probabilidade de "fora_cabine").
 *
 * react-native-fast-tflite não dequantiza automaticamente - o app recebe
 * o byte cru e é responsável por aplicar `(bruto - zeroPoint) * scale`.
 *
 * IMPORTANTE: se o .tflite em assets/ for substituído (retreino/nova
 * conversão), reextraia esses valores e atualize as constantes abaixo.
 * No repositório de treino (modelo-foto-motorista), rode:
 *
 *   uv run python -c "
 *   import tensorflow as tf
 *   i = tf.lite.Interpreter(model_path='modelos/modelo_foto_motorista.tflite')
 *   i.allocate_tensors()
 *   print(i.get_output_details()[0]['quantization'])
 *   "
 */
export const SAIDA_QUANT_SCALE = 0.00390625;
export const SAIDA_QUANT_ZERO_POINT = 0;

export const TAMANHO_ENTRADA = 224;
