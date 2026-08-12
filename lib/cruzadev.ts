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
      { word: "API", clue: "Sigla: interface que conecta dois sistemas" },
      { word: "SQL", clue: "Sigla: linguagem para consultar bancos de dados" },
      { word: "CSS", clue: "Sigla: linguagem que estiliza páginas da web" },
      { word: "GIT", clue: "Ferramenta mais usada para controle de versão" },
      { word: "TAG", clue: "Marcador usado em uma etiqueta de HTML" },
      { word: "KEY", clue: "Chave que identifica um valor" },
      { word: "BUG", clue: "Erro no código" },
      { word: "LOG", clue: "Registro de eventos de um sistema" },
      { word: "APP", clue: "Forma curta de dizer aplicativo" },
      { word: "WEB", clue: "Rede mundial de páginas ligadas por links" },
      { word: "CODE", clue: "Conjunto de instruções escrito por um programador" },
      { word: "NULL", clue: "Valor que representa a ausência de dado" },
      { word: "LOOP", clue: "Estrutura que repete um trecho de código" },
      { word: "HASH", clue: "Código curto gerado a partir de um dado" },
      { word: "JSON", clue: "Formato de texto muito usado para trocar dados" },
      { word: "ARRAY", clue: "Lista de itens guardados em sequência" },
      { word: "CLASS", clue: "Molde usado para criar objetos" },
      { word: "STACK", clue: "Pilha: o último que entra é o primeiro que sai" },
      { word: "QUEUE", clue: "Fila: o primeiro que entra é o primeiro que sai" },
      { word: "DEBUG", clue: "Ato de caçar e corrigir erros no código" },
      { word: "TOKEN", clue: "Pedacinho de texto processado por um programa" },
      { word: "CACHE", clue: "Guarda temporária para acessar algo mais rápido" },
      { word: "PROXY", clue: "Intermediário entre cliente e servidor" },
      { word: "BRANCH", clue: "Linha paralela de desenvolvimento no Git" },
      { word: "COMMIT", clue: "Ato de salvar uma alteração no Git" },
      { word: "DOCKER", clue: "Ferramenta famosa para empacotar apps em containers" },
      { word: "SERVER", clue: "Máquina que responde aos pedidos de um cliente" },
      { word: "CLIENT", clue: "Quem faz o pedido a um servidor" },
      { word: "ROUTER", clue: "Componente que direciona uma URL para a tela certa" },
      { word: "SCHEMA", clue: "Estrutura que define o formato dos dados" },
      { word: "BACKEND", clue: "Parte de um sistema que roda no servidor" },
      { word: "ROUTING", clue: "Ato de direcionar uma URL para sua página" },
      { word: "HASHING", clue: "Processo de gerar um código curto a partir de um dado" },
      { word: "CACHING", clue: "Prática de guardar dados para acesso mais rápido" },
      { word: "FRONTEND", clue: "Parte de um sistema que o usuário vê na tela" },
      { word: "DATABASE", clue: "Lugar onde os dados de um sistema ficam guardados" },
      { word: "FUNCTION", clue: "Bloco de código reutilizável com um nome" },
      { word: "VARIABLE", clue: "Espaço com nome que guarda um valor" },
    ],
  },
  {
    category: "Inteligência Artificial",
    words: [
      { word: "BOT", clue: "Programa que age sozinho, como um robô de chat" },
      { word: "GPU", clue: "Peça do computador usada para acelerar treinos" },
      { word: "NLP", clue: "Sigla: área que ensina o computador a entender texto" },
      { word: "BIAS", clue: "Tendência que desvia o resultado de um modelo" },
      { word: "DATA", clue: "Conjunto de informações usado para treinar um modelo" },
      { word: "CHAT", clue: "Conversa entre uma pessoa e um assistente virtual" },
      { word: "AGENT", clue: "Programa que decide sozinho o que fazer" },
      { word: "MODEL", clue: "Programa treinado para prever ou classificar algo" },
      { word: "LAYER", clue: "Camada de uma rede neural" },
      { word: "EPOCH", clue: "Uma volta completa pelos dados durante o treino" },
      { word: "TOKEN", clue: "Pedacinho de texto que um chatbot processa" },
      { word: "LABEL", clue: "Resposta certa usada para ensinar um modelo" },
      { word: "ROBOT", clue: "Máquina que faz tarefas sozinha" },
      { word: "VOICE", clue: "O que um assistente de voz reconhece" },
      { word: "IMAGE", clue: "O que uma IA de visão computacional analisa" },
      { word: "INFER", clue: "Usar um modelo pronto para prever algo novo" },
      { word: "PROMPT", clue: "Texto que você digita para pedir algo a uma IA" },
      { word: "VECTOR", clue: "Lista de números que representa um dado" },
      { word: "TENSOR", clue: "Estrutura de números usada em redes neurais" },
      { word: "WEIGHT", clue: "Número ajustado durante o treino de um modelo" },
      { word: "TUNING", clue: "Ajuste fino de um modelo já treinado" },
      { word: "DATASET", clue: "Coleção de dados usada para treinar uma IA" },
      { word: "CHATBOT", clue: "Programa que conversa com pessoas por texto" },
      { word: "TRAINING", clue: "Processo de ensinar um modelo com dados" },
      { word: "SEARCH", clue: "Ação de procurar a melhor solução" },
      { word: "POLICY", clue: "Estratégia que define as ações de um agente" },
      { word: "REWARD", clue: "Recompensa dada a um agente por uma boa ação" },
      { word: "ACTION", clue: "Escolha feita por um agente" },
      { word: "STATE", clue: "Situação atual do ambiente" },
      { word: "NEURAL", clue: "Tipo de rede inspirada no cérebro" },
      { word: "FILTER", clue: "Camada que procura padrões em uma imagem" },
      { word: "PIXEL", clue: "Menor ponto de uma imagem digital" },
      { word: "CORPUS", clue: "Grande coleção de textos usada para treinar uma IA" },
      { word: "BATCH", clue: "Lote de exemplos usado de uma vez no treino" },
      { word: "OUTPUT", clue: "Resultado que um modelo entrega" },
      { word: "TRAIN", clue: "Ensinar um modelo usando dados" },
    ],
  },
  {
    category: "Ciência de Dados",
    words: [
      { word: "SQL", clue: "Sigla: linguagem para consultar bancos de dados" },
      { word: "KEY", clue: "Chave que identifica uma linha de uma tabela" },
      { word: "ROW", clue: "Linha de uma tabela" },
      { word: "AVG", clue: "Abreviação comum para média" },
      { word: "SUM", clue: "Resultado de somar vários valores" },
      { word: "MEAN", clue: "Média de um conjunto de números" },
      { word: "MODE", clue: "Valor que mais se repete em um conjunto" },
      { word: "DATA", clue: "Conjunto de informações organizadas para análise" },
      { word: "PLOT", clue: "Gráfico feito a partir de dados" },
      { word: "CHART", clue: "Representação visual de dados" },
      { word: "QUERY", clue: "Pergunta feita a um banco de dados" },
      { word: "TABLE", clue: "Dados organizados em linhas e colunas" },
      { word: "INDEX", clue: "Número que indica a posição de um item" },
      { word: "SCALE", clue: "Ajuste no intervalo de uma variável" },
      { word: "MEDIAN", clue: "Valor do meio quando os dados estão em ordem" },
      { word: "COLUMN", clue: "Campo vertical de uma tabela" },
      { word: "SAMPLE", clue: "Pedaço de uma população usado numa pesquisa" },
      { word: "FILTER", clue: "Operação que seleciona linhas por uma condição" },
      { word: "CLUSTER", clue: "Grupo de pontos parecidos numa análise" },
      { word: "OUTLIER", clue: "Valor bem diferente do resto dos dados" },
      { word: "FEATURE", clue: "Coluna usada como entrada de um modelo" },
      { word: "VARIANCE", clue: "Medida de quanto os dados se espalham" },
      { word: "RANGE", clue: "Diferença entre o maior e o menor valor" },
      { word: "GROUP", clue: "Juntar linhas parecidas para somar ou contar" },
      { word: "MERGE", clue: "Juntar duas tabelas usando uma chave comum" },
      { word: "FRAME", clue: "Forma curta de dizer DataFrame" },
      { word: "GRAPH", clue: "Desenho feito de nós e conexões" },
      { word: "TREND", clue: "Direção que os dados seguem ao longo do tempo" },
      { word: "AXIS", clue: "Eixo de um gráfico" },
      { word: "BINS", clue: "Faixas usadas para agrupar valores num histograma" },
      { word: "PANDAS", clue: "Biblioteca Python famosa para tabelas de dados" },
      { word: "NUMPY", clue: "Biblioteca Python famosa para contas com números" },
      { word: "SCALAR", clue: "Um único número, sem direção" },
      { word: "NORMAL", clue: "Distribuição em formato de sino" },
      { word: "TOKEN", clue: "Pedacinho de texto separado para análise" },
      { word: "MODEL", clue: "Programa treinado a partir de dados" },
      { word: "VECTOR", clue: "Lista de números que representa algo" },
      { word: "PIVOT", clue: "Virar linhas em colunas numa tabela" },
      { word: "SERIES", clue: "Sequência de valores ao longo do tempo" },
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
