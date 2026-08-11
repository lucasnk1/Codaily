import { getDailySeed } from "./words";

export type BugSnippet = {
  id: string;
  title: string;
  language: string;
  category: "Dev" | "Data Science" | "IA";
  code: string[];
  buggyLine: number;
  explanation: string;
  fixedLine: string;
};

export const BUG_BANK: BugSnippet[] = [
  {
    id: "off-by-one",
    title: "Soma de uma lista",
    language: "python",
    category: "Dev",
    code: [
      "def soma_lista(nums):",
      "    total = 0",
      "    for i in range(1, len(nums)):",
      "        total += nums[i]",
      "    return total",
    ],
    buggyLine: 2,
    explanation:
      "O range começa em 1 em vez de 0, então o primeiro elemento da lista (índice 0) nunca é somado — um clássico erro off-by-one.",
    fixedLine: "    for i in range(0, len(nums)):",
  },
  {
    id: "mutable-default",
    title: "Argumento padrão mutável",
    language: "python",
    category: "Dev",
    code: [
      "def adicionar_item(item, lista=[]):",
      "    lista.append(item)",
      "    return lista",
      "",
      "adicionar_item('a')",
      "adicionar_item('b')",
    ],
    buggyLine: 0,
    explanation:
      "Listas como valor padrão são criadas uma única vez e compartilhadas entre chamadas, acumulando itens de execuções anteriores.",
    fixedLine: "def adicionar_item(item, lista=None):",
  },
  {
    id: "async-forget-await",
    title: "Chamada assíncrona sem await",
    language: "javascript",
    category: "Dev",
    code: [
      "async function getUser(id) {",
      "  const response = fetch(`/api/users/${id}`);",
      "  const data = await response.json();",
      "  return data;",
      "}",
    ],
    buggyLine: 1,
    explanation:
      "Falta o await em fetch(), então response é uma Promise, não o Response — chamar .json() nela falha em tempo de execução.",
    fixedLine: "  const response = await fetch(`/api/users/${id}`);",
  },
  {
    id: "leaky-relu-grad",
    title: "Atualização de pesos no treino",
    language: "python",
    category: "IA",
    code: [
      "for epoch in range(epochs):",
      "    preds = model(x)",
      "    loss = loss_fn(preds, y)",
      "    loss.backward()",
      "    optimizer.step()",
    ],
    buggyLine: 4,
    explanation:
      "Falta optimizer.zero_grad() antes do backward — sem isso, os gradientes se acumulam entre épocas em vez de serem recalculados do zero.",
    fixedLine: "    optimizer.zero_grad()\n    optimizer.step()",
  },
  {
    id: "train-test-leak",
    title: "Normalização de dados",
    language: "python",
    category: "Data Science",
    code: [
      "X_train, X_test = train_test_split(X)",
      "scaler = StandardScaler()",
      "X_train = scaler.fit_transform(X_train)",
      "X_test = scaler.fit_transform(X_test)",
    ],
    buggyLine: 3,
    explanation:
      "Usar fit_transform no conjunto de teste recalcula média e desvio padrão a partir dele, causando vazamento de dados (data leakage). O correto é usar apenas transform.",
    fixedLine: "X_test = scaler.transform(X_test)",
  },
  {
    id: "sql-injection",
    title: "Consulta ao banco de dados",
    language: "python",
    category: "Dev",
    code: [
      "def get_user(username):",
      "    query = f\"SELECT * FROM users WHERE name = '{username}'\"",
      "    return db.execute(query)",
    ],
    buggyLine: 1,
    explanation:
      "Interpolar a entrada do usuário diretamente na query abre brecha para SQL Injection. O correto é usar parâmetros vinculados (parameterized queries).",
    fixedLine: '    query = "SELECT * FROM users WHERE name = %s"',
  },
];

export function getSnippetOfTheDay(date = new Date()): BugSnippet {
  const seed = getDailySeed(date);
  const idx = Math.abs(seed) % BUG_BANK.length;
  return BUG_BANK[idx];
}
