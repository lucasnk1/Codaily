import { mulberry32, seededShuffle } from "./utils";

export type WordEntry = {
  word: string;
  category: "Dev" | "Data Science" | "IA";
  explanation: string;
};

// Banco de palavras de 5 letras (normalizadas, sem acentos, maiúsculas)
export const WORD_BANK: WordEntry[] = [
  {
    word: "MODEL",
    category: "IA",
    explanation:
      "Um model (modelo) é a representação matemática treinada para mapear entradas em saídas — pesos e arquitetura aprendidos a partir de dados.",
  },
  {
    word: "CACHE",
    category: "Dev",
    explanation:
      "Cache é uma camada de armazenamento temporário que guarda dados de acesso frequente para reduzir latência e evitar recomputação cara.",
  },
  {
    word: "ARRAY",
    category: "Dev",
    explanation:
      "Array é uma estrutura de dados que armazena elementos em posições contíguas de memória, permitindo acesso por índice em tempo O(1).",
  },
  {
    word: "TOKEN",
    category: "IA",
    explanation:
      "Token é a menor unidade de texto (palavra, subpalavra ou caractere) que um LLM processa após a etapa de tokenização.",
  },
  {
    word: "STACK",
    category: "Dev",
    explanation:
      "Stack (pilha) é uma estrutura LIFO — o último elemento inserido é o primeiro a ser removido. Usada em chamadas de função e undo/redo.",
  },
  {
    word: "QUEUE",
    category: "Dev",
    explanation:
      "Queue (fila) é uma estrutura FIFO — o primeiro elemento inserido é o primeiro a ser removido. Base de filas de mensagens e schedulers.",
  },
  {
    word: "REGEX",
    category: "Dev",
    explanation:
      "Regex (expressão regular) é uma sequência de caracteres que define um padrão de busca usado para validar, extrair ou substituir texto.",
  },
  {
    word: "GRADS",
    category: "IA",
    explanation:
      "Gradients (gradientes) indicam a direção de maior crescimento de uma função de perda; usados no backpropagation para ajustar pesos.",
  },
  {
    word: "PANDA",
    category: "Data Science",
    explanation:
      "Referência à biblioteca pandas, usada em Python para manipulação e análise de dados tabulares via DataFrames.",
  },
  {
    word: "MATRX",
    category: "Data Science",
    explanation:
      "Matrix (matriz) é uma estrutura bidimensional de números usada em álgebra linear, base de operações em tensores e redes neurais.",
  },
  {
    word: "SHELL",
    category: "Dev",
    explanation:
      "Shell é o interpretador de linha de comando que recebe instruções do usuário e as repassa ao sistema operacional.",
  },
  {
    word: "CLASS",
    category: "Dev",
    explanation:
      "Class (classe) é um molde de programação orientada a objetos que define atributos e métodos para criar instâncias (objetos).",
  },
  {
    word: "PROXY",
    category: "Dev",
    explanation:
      "Proxy é um intermediário entre cliente e servidor que encaminha requisições, podendo cachear, filtrar ou balancear carga.",
  },
  {
    word: "EPOCH",
    category: "IA",
    explanation:
      "Epoch é uma passada completa do algoritmo de treinamento por todo o conjunto de dados durante o treino de um modelo.",
  },
  {
    word: "SCOPE",
    category: "Dev",
    explanation:
      "Scope (escopo) define a região do código onde uma variável é visível e acessível durante a execução do programa.",
  },
];

function dayIndex(seed: number, length: number) {
  return Math.abs(seed) % length;
}

export function getDailySeed(date = new Date()): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  return y * 10000 + m * 100 + d;
}

export function getWordOfTheDay(date = new Date()): WordEntry {
  const seed = getDailySeed(date);
  const idx = dayIndex(seed, WORD_BANK.length);
  return WORD_BANK[idx];
}

export function getWordsOfTheDay(count: number, date = new Date()): WordEntry[] {
  if (count === 1) return [getWordOfTheDay(date)];

  const soloWord = getWordOfTheDay(date);
  const pool = WORD_BANK.filter((w) => w.word !== soloWord.word);

  const seed = getDailySeed(date);
  const rand = mulberry32(seed + count * 7919);
  const shuffled = seededShuffle(pool, rand);
  return shuffled.slice(0, count);
}
