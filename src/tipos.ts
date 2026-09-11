export type ClasseFotoMotorista = 'dentro_cabine' | 'fora_cabine';

export interface ResultadoClassificacao {
  classe: ClasseFotoMotorista;
  /** Confiança do modelo na classe retornada, de 0 a 1. */
  confianca: number;
}
