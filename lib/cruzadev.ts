import { getDailySeed } from "./words";
import { mulberry32, seededShuffle } from "./utils";

export type Direction = "across" | "down";

export type WordClue = { word: string; clue: string };

export type WordPool = {
  category: string;
  words: WordClue[];
};

const TARGET_WORD_COUNT = 25;
const CANVAS_SIZE = 25;

export const CRUZADEV_POOLS: WordPool[] = [
  {
    category: "Desenvolvimento",
    words: [
      { word: "ARRAY", clue: "Sequência de elementos em posições contíguas de memória" },
      { word: "STACK", clue: "Estrutura LIFO usada em chamadas de função" },
      { word: "QUEUE", clue: "Estrutura FIFO usada em filas de mensagens" },
      { word: "CACHE", clue: "Armazenamento temporário para reduzir latência" },
      { word: "CLASS", clue: "Molde que define atributos e métodos de um objeto" },
      { word: "SCOPE", clue: "Região do código onde uma variável é visível" },
      { word: "REGEX", clue: "Padrão usado para buscar ou validar texto" },
      { word: "PROXY", clue: "Intermediário entre cliente e servidor" },
      { word: "TOKEN", clue: "Menor unidade de texto processada por um parser ou LLM" },
      { word: "SHELL", clue: "Interpretador de linha de comando" },
      { word: "DEBUG", clue: "Processo de encontrar e corrigir erros no código" },
      { word: "ASYNC", clue: "Operação que não bloqueia a thread principal" },
      { word: "ERROR", clue: "Mensagem que indica falha durante a execução" },
      { word: "INDEX", clue: "Posição de um elemento em uma coleção" },
      { word: "LOGIN", clue: "Ato de autenticar-se em um sistema" },
      { word: "INPUT", clue: "Dado fornecido para um programa processar" },
      { word: "ROUTE", clue: "Caminho que mapeia uma URL a um handler" },
      { word: "MERGE", clue: "Unir alterações de branches diferentes no Git" },
      { word: "BUILD", clue: "Processo que compila e empacota uma aplicação" },
      { word: "PATCH", clue: "Pequena correção aplicada a um software" },
      { word: "THREAD", clue: "Menor unidade de execução dentro de um processo" },
      { word: "STRING", clue: "Tipo de dado que representa texto" },
      { word: "BRANCH", clue: "Linha de desenvolvimento paralela em um repositório" },
      { word: "COMMIT", clue: "Registro de uma alteração no controle de versão" },
      { word: "SOCKET", clue: "Endpoint de comunicação bidirecional em rede" },
      { word: "COOKIE", clue: "Dado armazenado no navegador para manter estado" },
      { word: "SCHEMA", clue: "Definição formal da estrutura de dados" },
      { word: "KERNEL", clue: "Núcleo do sistema operacional" },
      { word: "BINARY", clue: "Sistema numérico de base 2" },
      { word: "ENGINE", clue: "Motor de software que executa uma tarefa central" },
      { word: "DRIVER", clue: "Software que permite o SO controlar um dispositivo" },
      { word: "EXPORT", clue: "Disponibilizar um valor para outros módulos usarem" },
      { word: "IMPORT", clue: "Trazer um módulo externo para o código atual" },
      { word: "MEMORY", clue: "Espaço usado para armazenar dados durante a execução" },
      { word: "STREAM", clue: "Fluxo contínuo de dados processado aos poucos" },
      { word: "CLIENT", clue: "Aplicação que consome um serviço remoto" },
      { word: "SERVER", clue: "Aplicação que atende requisições de clientes" },
      { word: "BUFFER", clue: "Área temporária de memória para dados em trânsito" },
      { word: "HANDLE", clue: "Referência usada para manipular um recurso" },
      { word: "OBJECT", clue: "Instância que agrupa dados e comportamento" },
    ],
  },
  {
    category: "Inteligência Artificial",
    words: [
      { word: "MODEL", clue: "Representação matemática treinada para prever ou classificar" },
      { word: "TOKEN", clue: "Menor unidade de texto processada por um LLM" },
      { word: "EPOCH", clue: "Uma passada completa pelo dataset durante o treino" },
      { word: "AGENT", clue: "Sistema que percebe o ambiente e age para atingir objetivos" },
      { word: "BIAS", clue: "Termo somado a uma combinação linear em uma rede neural" },
      { word: "LAYER", clue: "Camada de neurônios em uma rede neural" },
      { word: "VECTOR", clue: "Lista ordenada de números que representa um dado" },
      { word: "TENSOR", clue: "Estrutura de dados multidimensional usada em deep learning" },
      { word: "WEIGHT", clue: "Parâmetro ajustado durante o treinamento de um modelo" },
      { word: "PROMPT", clue: "Entrada de texto fornecida a um modelo generativo" },
      { word: "DATASET", clue: "Conjunto de dados usado para treinar ou avaliar um modelo" },
      { word: "FEATURE", clue: "Variável de entrada usada para treinar um modelo" },
      { word: "OUTPUT", clue: "Resultado produzido por um modelo" },
      { word: "LABEL", clue: "Rótulo correto associado a um exemplo de treino" },
      { word: "TRAIN", clue: "Ajustar os parâmetros de um modelo usando dados" },
      { word: "INFER", clue: "Usar um modelo já treinado para gerar previsões" },
      { word: "ROBOT", clue: "Máquina capaz de executar tarefas de forma autônoma" },
      { word: "VOICE", clue: "Modalidade de entrada usada em assistentes de fala" },
      { word: "IMAGE", clue: "Tipo de dado processado por modelos de visão computacional" },
      { word: "AUDIO", clue: "Tipo de dado sonoro usado em reconhecimento de fala" },
      { word: "LOGIC", clue: "Base formal usada em sistemas de raciocínio simbólico" },
      { word: "SEARCH", clue: "Estratégia usada por agentes para explorar soluções" },
      { word: "POLICY", clue: "Estratégia que define as ações de um agente" },
      { word: "REWARD", clue: "Sinal de feedback usado em aprendizado por reforço" },
      { word: "ACTION", clue: "Escolha feita por um agente em um determinado estado" },
      { word: "STATE", clue: "Situação atual do ambiente percebida por um agente" },
      { word: "NEURAL", clue: "Tipo de rede inspirada no cérebro biológico" },
      { word: "FILTER", clue: "Camada que extrai padrões em uma rede convolucional" },
      { word: "SAMPLE", clue: "Um único exemplo retirado de um conjunto de dados" },
      { word: "ENCODE", clue: "Transformar um dado em uma representação numérica" },
      { word: "DECODE", clue: "Converter uma representação numérica de volta em dado original" },
      { word: "LATENT", clue: "Espaço interno onde um modelo representa conceitos comprimidos" },
      { word: "PIXEL", clue: "Menor unidade de uma imagem digital" },
      { word: "CORPUS", clue: "Grande coleção de textos usada para treinar modelos de linguagem" },
      { word: "TUNING", clue: "Ajuste fino dos parâmetros de um modelo" },
      { word: "BATCH", clue: "Lote de exemplos processados juntos durante o treino" },
      { word: "SIGMOID", clue: "Função de ativação com formato em S" },
      { word: "CHATBOT", clue: "Programa que conversa com usuários em linguagem natural" },
    ],
  },
  {
    category: "Ciência de Dados",
    words: [
      { word: "TABLE", clue: "Estrutura relacional organizada em linhas e colunas" },
      { word: "QUERY", clue: "Consulta feita a um banco de dados" },
      { word: "DATUM", clue: "Singular de 'dados': uma única observação" },
      { word: "CUBES", clue: "Estruturas multidimensionais usadas em OLAP" },
      { word: "MATRIX", clue: "Estrutura bidimensional de números usada em álgebra linear" },
      { word: "OUTLIER", clue: "Valor que se distancia significativamente do padrão dos dados" },
      { word: "CLUSTER", clue: "Agrupamento de pontos similares em algoritmos não supervisionados" },
      { word: "FEATURE", clue: "Variável de entrada usada para treinar um modelo" },
      { word: "MEAN", clue: "Soma dos valores dividida pela quantidade de observações" },
      { word: "MEDIAN", clue: "Valor central de um conjunto de dados ordenado" },
      { word: "RANGE", clue: "Diferença entre o maior e o menor valor de um conjunto" },
      { word: "SAMPLE", clue: "Subconjunto de dados retirado de uma população" },
      { word: "COLUMN", clue: "Campo vertical de uma tabela de dados" },
      { word: "MERGE", clue: "Combinar duas tabelas com base em uma chave comum" },
      { word: "PIVOT", clue: "Operação que reorganiza dados em uma tabela dinâmica" },
      { word: "FILTER", clue: "Operação que seleciona linhas segundo uma condição" },
      { word: "GROUP", clue: "Agrupar linhas para aplicar uma agregação" },
      { word: "SERIES", clue: "Estrutura unidimensional rotulada em pandas" },
      { word: "FRAME", clue: "Abreviação comum para DataFrame" },
      { word: "PANDAS", clue: "Biblioteca Python para manipulação de dados tabulares" },
      { word: "NUMPY", clue: "Biblioteca Python para computação numérica com arrays" },
      { word: "SCALAR", clue: "Valor numérico único, sem dimensão" },
      { word: "NORMAL", clue: "Distribuição estatística em formato de sino" },
      { word: "TREND", clue: "Direção geral de uma série temporal ao longo do tempo" },
      { word: "CHART", clue: "Representação visual de dados" },
      { word: "GRAPH", clue: "Conjunto de nós e arestas usado para modelar relações" },
      { word: "PLOT", clue: "Gráfico gerado a partir de dados" },
      { word: "AXIS", clue: "Eixo de referência em um gráfico" },
      { word: "LABEL", clue: "Rótulo que identifica uma categoria ou eixo" },
      { word: "SCALE", clue: "Ajuste do intervalo de valores de uma variável" },
      { word: "BINS", clue: "Intervalos usados para agrupar valores em um histograma" },
      { word: "CORPUS", clue: "Grande coleção de textos usada em análise de linguagem" },
      { word: "TOKEN", clue: "Unidade mínima resultante da tokenização de texto" },
      { word: "MODEL", clue: "Representação treinada para prever a partir de dados" },
      { word: "INDEX", clue: "Rótulo que identifica cada linha de uma tabela" },
      { word: "VECTOR", clue: "Lista ordenada de números que representa um dado" },
    ],
  },
];

type Cell = string | null;

type RawPlacement = {
  word: string;
  clue: string;
  row: number;
  col: number;
  direction: Direction;
};

export function getEntryCells(entry: {
  row: number;
  col: number;
  direction: Direction;
  word: string;
}): [number, number][] {
  return cellsOf(entry.word, entry.row, entry.col, entry.direction);
}

function cellsOf(word: string, row: number, col: number, direction: Direction): [number, number][] {
  return Array.from({ length: word.length }, (_, i) =>
    direction === "down" ? [row + i, col] : [row, col + i]
  );
}

function generateCrossword(pool: WordClue[], targetCount: number, seed: number) {
  const rand = mulberry32(seed);
  const words = seededShuffle(
    pool.map((w) => ({ word: w.word.toUpperCase(), clue: w.clue })),
    rand
  );

  let anchorIdx = 0;
  words.forEach((w, i) => {
    if (w.word.length > words[anchorIdx].word.length) anchorIdx = i;
  });
  const [anchor] = words.splice(anchorIdx, 1);

  const grid: Cell[][] = Array.from({ length: CANVAS_SIZE }, () => Array(CANVAS_SIZE).fill(null));
  const cellDirs = new Map<string, Set<Direction>>();
  const placed: RawPlacement[] = [];

  const key = (r: number, c: number) => `${r}-${c}`;
  const inBounds = (r: number, c: number) => r >= 0 && r < CANVAS_SIZE && c >= 0 && c < CANVAS_SIZE;

  function markDir(r: number, c: number, dir: Direction) {
    const k = key(r, c);
    if (!cellDirs.has(k)) cellDirs.set(k, new Set());
    cellDirs.get(k)!.add(dir);
  }

  function canPlace(word: string, row: number, col: number, dir: Direction): boolean {
    const cells = cellsOf(word, row, col, dir);
    if (!cells.every(([r, c]) => inBounds(r, c))) return false;

    const [br, bc] = dir === "down" ? [row - 1, col] : [row, col - 1];
    const [ar, ac] = dir === "down" ? [row + cells.length, col] : [row, col + cells.length];
    if (inBounds(br, bc) && grid[br][bc]) return false;
    if (inBounds(ar, ac) && grid[ar][ac]) return false;

    for (let i = 0; i < cells.length; i++) {
      const [r, c] = cells[i];
      const existing = grid[r][c];
      if (existing) {
        if (existing !== word[i]) return false;
        if (cellDirs.get(key(r, c))?.has(dir)) return false;
      } else {
        const [pr1, pc1] = dir === "across" ? [r - 1, c] : [r, c - 1];
        const [pr2, pc2] = dir === "across" ? [r + 1, c] : [r, c + 1];
        if (inBounds(pr1, pc1) && grid[pr1][pc1]) return false;
        if (inBounds(pr2, pc2) && grid[pr2][pc2]) return false;
      }
    }
    return true;
  }

  const bbox = { minR: CANVAS_SIZE, maxR: 0, minC: CANVAS_SIZE, maxC: 0 };

  function growBBox(cells: [number, number][]) {
    cells.forEach(([r, c]) => {
      bbox.minR = Math.min(bbox.minR, r);
      bbox.maxR = Math.max(bbox.maxR, r);
      bbox.minC = Math.min(bbox.minC, c);
      bbox.maxC = Math.max(bbox.maxC, c);
    });
  }

  function bboxExpansion(cells: [number, number][]): number {
    let minR = bbox.minR;
    let maxR = bbox.maxR;
    let minC = bbox.minC;
    let maxC = bbox.maxC;
    cells.forEach(([r, c]) => {
      minR = Math.min(minR, r);
      maxR = Math.max(maxR, r);
      minC = Math.min(minC, c);
      maxC = Math.max(maxC, c);
    });
    const before = Math.max(0, bbox.maxR - bbox.minR + 1) * Math.max(0, bbox.maxC - bbox.minC + 1);
    const after = (maxR - minR + 1) * (maxC - minC + 1);
    return after - before;
  }

  const centroid = { sumR: 0, sumC: 0, count: 0 };

  function centroidDistance(cells: [number, number][]): number {
    if (centroid.count === 0) return 0;
    const cr = centroid.sumR / centroid.count;
    const cc = centroid.sumC / centroid.count;
    const total = cells.reduce((acc, [r, c]) => acc + Math.abs(r - cr) + Math.abs(c - cc), 0);
    return total / cells.length;
  }

  function commit(word: string, clue: string, row: number, col: number, dir: Direction) {
    const cells = cellsOf(word, row, col, dir);
    cells.forEach(([r, c], i) => {
      grid[r][c] = word[i];
      markDir(r, c, dir);
      centroid.sumR += r;
      centroid.sumC += c;
      centroid.count += 1;
    });
    growBBox(cells);
    placed.push({ word, clue, row, col, direction: dir });
  }

  const startRow = Math.floor(CANVAS_SIZE / 2);
  const startCol = Math.floor((CANVAS_SIZE - anchor.word.length) / 2);
  commit(anchor.word, anchor.clue, startRow, startCol, "across");

  function tryPlace(candidate: WordClue): boolean {
    const tries: { row: number; col: number; dir: Direction }[] = [];
    for (let r = 0; r < CANVAS_SIZE; r++) {
      for (let c = 0; c < CANVAS_SIZE; c++) {
        const letter = grid[r][c];
        if (!letter) continue;
        const dirsHere = cellDirs.get(key(r, c)) ?? new Set<Direction>();

        for (let i = 0; i < candidate.word.length; i++) {
          if (candidate.word[i] !== letter) continue;
          const availableDirs: Direction[] = (["across", "down"] as Direction[]).filter(
            (d) => !dirsHere.has(d)
          );
          for (const dir of availableDirs) {
            const row = dir === "down" ? r - i : r;
            const col = dir === "across" ? c - i : c;
            tries.push({ row, col, dir });
          }
        }
      }
    }

    const shuffledTries = seededShuffle(tries, rand);
    let best: { row: number; col: number; dir: Direction; score: number } | null = null;

    for (const t of shuffledTries) {
      if (!canPlace(candidate.word, t.row, t.col, t.dir)) continue;
      const cells = cellsOf(candidate.word, t.row, t.col, t.dir);
      const overlapCount = cells.filter(([r, c]) => grid[r][c] !== null).length;
      const expansion = bboxExpansion(cells);
      const distance = centroidDistance(cells);
      const score = overlapCount * 1000 - expansion * 8 - distance * 50;
      if (!best || score > best.score) {
        best = { ...t, score };
      }
    }

    if (!best) return false;
    commit(candidate.word, candidate.clue, best.row, best.col, best.dir);
    return true;
  }

  // Multiple passes: a word with no valid intersection yet may gain one once
  // more letters land on the grid from words placed later in the queue.
  let remaining = words;
  let progress = true;
  while (placed.length < targetCount && remaining.length > 0 && progress) {
    progress = false;
    const stillRemaining: typeof remaining = [];

    for (const candidate of remaining) {
      if (placed.length >= targetCount) {
        stillRemaining.push(candidate);
        continue;
      }
      if (tryPlace(candidate)) {
        progress = true;
      } else {
        stillRemaining.push(candidate);
      }
    }

    remaining = stillRemaining;
  }

  let minR = CANVAS_SIZE;
  let maxR = 0;
  let minC = CANVAS_SIZE;
  let maxC = 0;
  placed.forEach((p) => {
    cellsOf(p.word, p.row, p.col, p.direction).forEach(([r, c]) => {
      minR = Math.min(minR, r);
      maxR = Math.max(maxR, r);
      minC = Math.min(minC, c);
      maxC = Math.max(maxC, c);
    });
  });

  const rows = maxR - minR + 1;
  const cols = maxC - minC + 1;
  const trimmed = placed.map((p) => ({ ...p, row: p.row - minR, col: p.col - minC }));

  return { rows, cols, placed: trimmed };
}

export type CellInfo = {
  letter: string;
  isBlack: boolean;
  number: number | null;
};

export type BuiltEntry = RawPlacement & { number: number; length: number };

export type BuiltCrossword = {
  rows: number;
  cols: number;
  grid: CellInfo[][];
  entries: BuiltEntry[];
  category: string;
};

export function getCruzadevPuzzle(date = new Date()): BuiltCrossword {
  const seed = getDailySeed(date);
  const poolIdx = Math.abs(seed) % CRUZADEV_POOLS.length;
  const pool = CRUZADEV_POOLS[poolIdx];

  const { rows, cols, placed } = generateCrossword(pool.words, TARGET_WORD_COUNT, seed);

  const isBlack = (grid: Cell[][], r: number, c: number) =>
    r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === null;

  const letterGrid: Cell[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  placed.forEach((p) => {
    cellsOf(p.word, p.row, p.col, p.direction).forEach(([r, c], i) => {
      letterGrid[r][c] = p.word[i];
    });
  });

  const grid: CellInfo[][] = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({
      letter: letterGrid[r][c] ?? "",
      isBlack: letterGrid[r][c] === null,
      number: null as number | null,
    }))
  );

  let num = 1;
  const numbered = new Map<string, number>();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (isBlack(letterGrid, r, c)) continue;
      const startsAcross = isBlack(letterGrid, r, c - 1) && !isBlack(letterGrid, r, c + 1);
      const startsDown = isBlack(letterGrid, r - 1, c) && !isBlack(letterGrid, r + 1, c);
      if (startsAcross || startsDown) {
        grid[r][c].number = num;
        numbered.set(`${r}-${c}`, num);
        num++;
      }
    }
  }

  const entries: BuiltEntry[] = placed
    .map((p) => ({
      ...p,
      number: numbered.get(`${p.row}-${p.col}`) ?? 0,
      length: p.word.length,
    }))
    .sort((a, b) => a.number - b.number);

  return { rows, cols, grid, entries, category: pool.category };
}
