import { getDailySeed } from "./words";

export type Direction = "across" | "down";

export type CrosswordEntry = {
  row: number;
  col: number;
  direction: Direction;
  answer: string;
  clue: string;
};

export type CrosswordPuzzle = {
  size: number;
  blacks: [number, number][];
  entries: CrosswordEntry[];
  category: string;
};

// Cruz central: uma palavra horizontal na linha do meio cruzando com três
// palavras verticais nas colunas 0, 2 e 4. As colunas/linha do meio ficam
// abertas; o restante das células nas colunas 1 e 3 é bloqueado.
const CROSS_BLACKS: [number, number][] = [
  [0, 1],
  [0, 3],
  [1, 1],
  [1, 3],
  [3, 1],
  [3, 3],
  [4, 1],
  [4, 3],
];

export const CRUZADEV_PUZZLES: CrosswordPuzzle[] = [
  {
    category: "Inteligência Artificial",
    size: 5,
    blacks: CROSS_BLACKS,
    entries: [
      {
        row: 0,
        col: 0,
        direction: "down",
        answer: "ADMIN",
        clue: "Usuário com privilégios totais sobre um sistema",
      },
      {
        row: 0,
        col: 2,
        direction: "down",
        answer: "CODED",
        clue: "Particípio de programar: já foi ___",
      },
      {
        row: 0,
        col: 4,
        direction: "down",
        answer: "VALID",
        clue: "Diz-se de uma entrada que passou na verificação",
      },
      {
        row: 2,
        col: 0,
        direction: "across",
        answer: "MODEL",
        clue: "Representação matemática treinada para prever ou classificar",
      },
    ],
  },
  {
    category: "Desenvolvimento",
    size: 5,
    blacks: CROSS_BLACKS,
    entries: [
      {
        row: 0,
        col: 0,
        direction: "down",
        answer: "STACK",
        clue: "Estrutura LIFO usada em chamadas de função",
      },
      {
        row: 0,
        col: 2,
        direction: "down",
        answer: "ERROR",
        clue: "Mensagem que indica falha durante a execução",
      },
      {
        row: 0,
        col: 4,
        direction: "down",
        answer: "ASYNC",
        clue: "Operação que não bloqueia a thread principal",
      },
      {
        row: 2,
        col: 0,
        direction: "across",
        answer: "ARRAY",
        clue: "Sequência de elementos em posições contíguas de memória",
      },
    ],
  },
  {
    category: "Ciência de Dados",
    size: 5,
    blacks: CROSS_BLACKS,
    entries: [
      {
        row: 0,
        col: 0,
        direction: "down",
        answer: "DATUM",
        clue: "Singular de 'dados': uma única observação",
      },
      {
        row: 0,
        col: 2,
        direction: "down",
        answer: "CUBES",
        clue: "Estruturas multidimensionais usadas em OLAP",
      },
      {
        row: 0,
        col: 4,
        direction: "down",
        answer: "QUERY",
        clue: "Consulta feita a um banco de dados",
      },
      {
        row: 2,
        col: 0,
        direction: "across",
        answer: "TABLE",
        clue: "Estrutura relacional organizada em linhas e colunas",
      },
    ],
  },
];

export type CellInfo = {
  letter: string;
  isBlack: boolean;
  number: number | null;
};

export type BuiltEntry = CrosswordEntry & { number: number; length: number };

export type BuiltCrossword = {
  size: number;
  grid: CellInfo[][];
  entries: BuiltEntry[];
};

export function getEntryCells(entry: { row: number; col: number; direction: Direction; answer: string }) {
  return Array.from({ length: entry.answer.length }, (_, i) =>
    entry.direction === "down"
      ? ([entry.row + i, entry.col] as [number, number])
      : ([entry.row, entry.col + i] as [number, number])
  );
}

export function buildCrossword(puzzle: CrosswordPuzzle): BuiltCrossword {
  const { size, blacks, entries } = puzzle;
  const blackSet = new Set(blacks.map(([r, c]) => `${r}-${c}`));
  const isBlack = (r: number, c: number) =>
    r < 0 || r >= size || c < 0 || c >= size || blackSet.has(`${r}-${c}`);

  const grid: CellInfo[][] = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => ({ letter: "", isBlack: isBlack(r, c), number: null as number | null }))
  );

  entries.forEach((entry) => {
    getEntryCells(entry).forEach(([r, c], i) => {
      grid[r][c].letter = entry.answer[i];
    });
  });

  let num = 1;
  const numbered = new Map<string, number>();
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (isBlack(r, c)) continue;
      const startsAcross = isBlack(r, c - 1) && !isBlack(r, c + 1);
      const startsDown = isBlack(r - 1, c) && !isBlack(r + 1, c);
      if (startsAcross || startsDown) {
        grid[r][c].number = num;
        numbered.set(`${r}-${c}`, num);
        num++;
      }
    }
  }

  const builtEntries: BuiltEntry[] = entries.map((e) => ({
    ...e,
    number: numbered.get(`${e.row}-${e.col}`) ?? 0,
    length: e.answer.length,
  }));

  return { size, grid, entries: builtEntries };
}

export function getCruzadevPuzzle(date = new Date()): CrosswordPuzzle {
  const seed = getDailySeed(date);
  const idx = Math.abs(seed) % CRUZADEV_PUZZLES.length;
  return CRUZADEV_PUZZLES[idx];
}
