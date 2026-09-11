// O Metro resolve arquivos .tflite como asset (número do módulo), igual a
// uma imagem. O TypeScript não conhece essa extensão por padrão.
declare module '*.tflite' {
  const valor: number;
  export default valor;
}
