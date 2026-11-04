export interface Cupcake {
  id: string;
  name: string;
  description: string;
  /** Caminho dentro de /public */
  image: string;
  alt: string;
  /** Dimensões reais do arquivo (definem a proporção) */
  width: number;
  height: number;
  /** Fração da altura da imagem ocupada pelo cupcake (0–1). Iguala o tamanho visual entre imagens. */
  visibleHeight: number;
  /** Fração vazia da imagem abaixo do cupcake (posiciona a sombra no chão) */
  foot: number;
  /** Largura da sombra como fração da largura da imagem */
  shadowWidth: number;
  /** Cor de fundo da página quando este cupcake está ativo (não é mais usada: a seção não tem fundo próprio) */
  tone: string;
  /** Detalhes mostrados no cartão */
  base: string;
  topping: string;
  note: string;
}

/**
 * Para adicionar um cupcake: coloque a imagem (PNG com fundo transparente)
 * em /public/cupcakes e acrescente um item aqui. O anel se ajusta sozinho.
 */
export const CUPCAKES: readonly Cupcake[] = [
  {
    id: 'rosa',
    name: 'Cupcake rosa',
    description:
      'Massa de baunilha com glacê cremoso rosa e uma framboesa fresca no topo. Leve, macio e com um toque ácido no final.',
    image: '/cupcakes/pink.png',
    alt: 'Cupcake de baunilha com glacê rosa e uma framboesa no topo',
    width: 1297,
    height: 1300,
    visibleHeight: 0.69,
    foot: 0.157,
    shadowWidth: 0.6,
    tone: '#3a2a12',
    base: 'Massa de baunilha',
    topping: 'Framboesa fresca',
    note: 'Leve, macio e levemente ácido',
  },
  {
    id: 'azul',
    name: 'Cupcake azul',
    description:
      'Massa de chocolate coberta com glacê azul batido na hora e confeitos perolados. Doce na medida e bonito de qualquer ângulo.',
    image: '/cupcakes/blue.png',
    alt: 'Cupcake de chocolate com glacê azul e confeitos perolados',
    width: 328,
    height: 328,
    visibleHeight: 0.8,
    foot: 0.1,
    shadowWidth: 0.64,
    tone: '#2b2416',
    base: 'Massa de chocolate',
    topping: 'Confeitos perolados',
    note: 'Glacê azul batido na hora',
  },
  {
    id: 'marrom',
    name: 'Cupcake marrom',
    description:
      'Massa de chocolate com chantilly, fios de calda de chocolate e uma cereja vermelha para fechar.',
    image: '/cupcakes/brown.png',
    alt: 'Cupcake de chocolate com chantilly, calda de chocolate e cereja',
    width: 350,
    height: 352,
    visibleHeight: 0.82,
    foot: 0.045,
    shadowWidth: 0.62,
    tone: '#40290f',
    base: 'Massa de chocolate',
    topping: 'Cereja e calda',
    note: 'Chantilly com fios de chocolate',
  },
  {
    id: 'branco',
    name: 'Cupcake branco',
    description:
      'Baunilha com cobertura de chantilly e granulado colorido. O clássico de festa de aniversário.',
    image: '/cupcakes/white.png',
    alt: 'Cupcake de baunilha com chantilly e granulado colorido',
    width: 446,
    height: 448,
    visibleHeight: 0.72,
    foot: 0.125,
    shadowWidth: 0.54,
    tone: '#33281a',
    base: 'Baunilha',
    topping: 'Granulado colorido',
    note: 'O clássico de festa de aniversário',
  },
];
