import { getDailySeed } from "./words";
import { mulberry32 } from "./utils";

export type CacaDevPuzzle = {
  words: { word: string; explanation: string }[];
  category: string;
};

export const CACADEV_PUZZLES: CacaDevPuzzle[] = [
  {
    category: "Estruturas de Dados",
    words: [
      { word: "STACK", explanation: "Pilha: estrutura LIFO usada em call stacks e undo/redo." },
      { word: "QUEUE", explanation: "Fila: estrutura FIFO usada em filas de mensagens e schedulers." },
      { word: "ARRAY", explanation: "Sequência de elementos em posições contíguas de memória." },
      { word: "HEAP", explanation: "Árvore usada para implementar filas de prioridade." },
      { word: "TREE", explanation: "Estrutura hierárquica de nós, base de índices e parsers." },
      { word: "GRAPH", explanation: "Conjunto de nós e arestas usado para modelar relações." },
      { word: "LINKED", explanation: "Lista cujos elementos apontam para o próximo nó." },
      { word: "TRIE", explanation: "Árvore usada para armazenar strings de forma eficiente." },
      { word: "INDEX", explanation: "Posição de um elemento dentro de uma coleção." },
      { word: "NODE", explanation: "Unidade básica que compõe listas, árvores e grafos." },
      { word: "SET", explanation: "Coleção que armazena apenas valores únicos." },
      { word: "HASH", explanation: "Valor gerado a partir de dados para indexação rápida." },
    ],
  },
  {
    category: "Inteligência Artificial",
    words: [
      { word: "MODEL", explanation: "Representação matemática treinada para mapear entradas em saídas." },
      { word: "TOKEN", explanation: "Menor unidade de texto processada por um LLM." },
      { word: "EPOCH", explanation: "Uma passada completa pelo dataset durante o treino." },
      { word: "PROMPT", explanation: "Entrada de texto fornecida a um modelo generativo." },
      { word: "BIAS", explanation: "Termo somado a uma combinação linear em uma rede neural." },
      { word: "AGENT", explanation: "Sistema que percebe o ambiente e age para atingir objetivos." },
      { word: "LAYER", explanation: "Camada de neurônios em uma rede neural." },
      { word: "VECTOR", explanation: "Lista ordenada de números que representa um dado." },
      { word: "TENSOR", explanation: "Estrutura multidimensional usada em deep learning." },
      { word: "WEIGHT", explanation: "Parâmetro ajustado durante o treinamento de um modelo." },
      { word: "LABEL", explanation: "Rótulo correto associado a um exemplo de treino." },
      { word: "INFER", explanation: "Usar um modelo treinado para gerar previsões." },
    ],
  },
  {
    category: "Ciência de Dados",
    words: [
      { word: "PANDAS", explanation: "Biblioteca Python para manipulação de dados tabulares." },
      { word: "OUTLIER", explanation: "Valor que se distancia significativamente do padrão dos dados." },
      { word: "MATRIX", explanation: "Estrutura bidimensional de números usada em álgebra linear." },
      { word: "CLUSTER", explanation: "Agrupamento de pontos similares em algoritmos não supervisionados." },
      { word: "FEATURE", explanation: "Variável de entrada usada para treinar um modelo." },
      { word: "MEAN", explanation: "Medida de tendência central: soma dos valores dividida pela quantidade." },
      { word: "MEDIAN", explanation: "Valor central de um conjunto de dados ordenado." },
      { word: "SAMPLE", explanation: "Subconjunto de dados retirado de uma população." },
      { word: "COLUMN", explanation: "Campo vertical de uma tabela de dados." },
      { word: "QUERY", explanation: "Consulta feita a um banco de dados." },
      { word: "CHART", explanation: "Representação visual de dados." },
      { word: "SCALE", explanation: "Ajuste do intervalo de valores de uma variável." },
    ],
  },
  {
    category: "Desenvolvimento Web",
    words: [
      { word: "CACHE", explanation: "Armazenamento temporário para reduzir latência de acesso." },
      { word: "ROUTER", explanation: "Componente que mapeia URLs para views ou handlers." },
      { word: "COOKIE", explanation: "Pequeno dado armazenado no navegador para manter estado." },
      { word: "SOCKET", explanation: "Endpoint de comunicação bidirecional entre cliente e servidor." },
      { word: "PROXY", explanation: "Intermediário que encaminha requisições entre cliente e servidor." },
      { word: "SCHEMA", explanation: "Definição formal da estrutura de dados de um sistema." },
      { word: "CLIENT", explanation: "Aplicação que consome um serviço remoto." },
      { word: "SERVER", explanation: "Aplicação que atende requisições de clientes." },
      { word: "BUFFER", explanation: "Área temporária de memória para dados em trânsito." },
      { word: "THREAD", explanation: "Menor unidade de execução dentro de um processo." },
      { word: "BRANCH", explanation: "Linha de desenvolvimento paralela em um repositório." },
      { word: "COMMIT", explanation: "Registro de uma alteração no controle de versão." },
    ],
  },
];

export type PlacedWord = {
  word: string;
  cells: [number, number][];
};

export type CacaDevBoard = {
  size: number;
  grid: string[][];
  placements: PlacedWord[];
  category: string;
};

const DIRECTIONS: [number, number][] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
  [0, -1],
  [-1, 0],
  [-1, -1],
  [-1, 1],
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function getPuzzleOfTheDay(date = new Date()): CacaDevPuzzle {
  const seed = getDailySeed(date);
  const idx = Math.abs(seed) % CACADEV_PUZZLES.length;
  return CACADEV_PUZZLES[idx];
}

export function generateBoard(puzzle: CacaDevPuzzle, size = 10, date = new Date()): CacaDevBoard {
  const seed = getDailySeed(date);
  const rand = mulberry32(seed);
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(""));
  const placements: PlacedWord[] = [];

  const words = [...puzzle.words].sort((a, b) => b.word.length - a.word.length);

  for (const { word } of words) {
    let placed = false;
    for (let attempt = 0; attempt < 200 && !placed; attempt++) {
      const dir = DIRECTIONS[Math.floor(rand() * DIRECTIONS.length)];
      const row = Math.floor(rand() * size);
      const col = Math.floor(rand() * size);
      const endRow = row + dir[0] * (word.length - 1);
      const endCol = col + dir[1] * (word.length - 1);
      if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) continue;

      const cells: [number, number][] = [];
      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const r = row + dir[0] * i;
        const c = col + dir[1] * i;
        const existing = grid[r][c];
        if (existing !== "" && existing !== word[i]) {
          fits = false;
          break;
        }
        cells.push([r, c]);
      }
      if (!fits) continue;

      cells.forEach(([r, c], i) => {
        grid[r][c] = word[i];
      });
      placements.push({ word, cells });
      placed = true;
    }
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === "") {
        grid[r][c] = ALPHABET[Math.floor(rand() * ALPHABET.length)];
      }
    }
  }

  return { size, grid, placements, category: puzzle.category };
}

export function isStraightLine(
  start: [number, number],
  end: [number, number]
): [number, number] | null {
  const dr = end[0] - start[0];
  const dc = end[1] - start[1];
  if (dr === 0 && dc === 0) return [0, 0];
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;
  return [Math.sign(dr), Math.sign(dc)];
}

export function getPathCells(
  start: [number, number],
  end: [number, number]
): [number, number][] {
  const dir = isStraightLine(start, end);
  if (!dir) return [start];
  const [dr, dc] = dir;
  const length = Math.max(Math.abs(end[0] - start[0]), Math.abs(end[1] - start[1])) + 1;
  return Array.from({ length }, (_, i) => [start[0] + dr * i, start[1] + dc * i] as [number, number]);
}
