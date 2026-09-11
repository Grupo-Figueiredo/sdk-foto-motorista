# @grupo-figueiredo/sdk-foto-motorista

SDK React Native que classifica uma selfie do motorista como **dentro** ou
**fora** da cabine do caminhão, usando um modelo MobileNetV3 (TFLite,
quantizado int8) embarcado no próprio pacote. Todo o pré-processamento,
carregamento do modelo e interpretação da saída quantizada ficam
escondidos atrás de uma única função.

Modelo treinado em [modelo-foto-motorista](../modelo-foto-motorista)
(ver esse repositório para dataset, treino e métricas de acurácia).

## Instalação

```bash
npm install @grupo-figueiredo/sdk-foto-motorista react-native-fast-tflite react-native-nitro-modules
cd ios && pod install
```

`react-native-fast-tflite` (v3+, baseado em Nitro Modules) e
`react-native-nitro-modules` são peer dependencies — o app precisa
instalá-las e linkar (autolink cobre o iOS/Android nativo).

### Configuração obrigatória do Metro

O modelo `.tflite` é carregado como asset (igual a uma imagem). Adicione a
extensão no `metro.config.js` do app:

```js
module.exports = {
  resolver: {
    assetExts: [...defaultAssetExts, 'tflite'],
  },
};
```

Sem isso, o `require('modelo_foto_motorista.tflite')` interno do SDK não
resolve.

## Uso

```ts
import { classificarFotoMotorista } from '@grupo-figueiredo/sdk-foto-motorista';

const resultado = await classificarFotoMotorista(uriDaFoto);
// { classe: 'dentro_cabine' | 'fora_cabine', confianca: number (0-1) }

if (resultado.classe === 'fora_cabine' && resultado.confianca > 0.8) {
  // ...
}
```

`uriDaFoto` é a URI local da foto já capturada pelo app (retorno da
câmera, de um image picker, etc.) — o SDK não abre câmera nem gerencia
captura, só classifica uma foto existente.

## Como funciona internamente

1. Carrega o `.tflite` uma vez (lazy, cacheado) via `react-native-fast-tflite`.
2. Redimensiona a foto para 224×224 (`@bam.tech/react-native-image-resizer`, modo
   `stretch` — sem preservar aspect ratio, igual ao resize usado no
   treino em Python) e decodifica os pixels crus em RGB (`jpeg-js`), sem
   nenhuma normalização adicional.
3. Roda `model.run([...])`.
4. `react-native-fast-tflite` **não dequantiza automaticamente** — o SDK
   aplica manualmente `(bruto - zeroPoint) * scale` usando os parâmetros
   de quantização do tensor de saída (embutidos em `src/constantes.ts`,
   extraídos do próprio `.tflite` no momento da conversão).

Esses detalhes (ordem das classes, quantização, tamanho de entrada) estão
documentados aqui justamente para não vazarem pra quem consome o SDK.

## Atualizando o modelo

Quando o modelo for retreinado:

1. Copie o novo `modelos/modelo_foto_motorista.tflite` (do repo de treino)
   para `assets/` aqui.
2. Reextraia os parâmetros de quantização da saída e atualize
   `src/constantes.ts` (o comentário no próprio arquivo tem o comando).
3. Suba a versão do pacote (`npm version minor` ou `patch`) e publique.

## Build / publicação

```bash
npm run build      # compila src/ -> lib/
npm publish        # publica no registry configurado em package.json
```

## Próximos passos

- Criar um app de exemplo (`example/`) pra testar o SDK isoladamente
- CI de build/typecheck antes de publicar
