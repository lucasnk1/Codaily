export const SITE_URL = "https://codaily-phi.vercel.app/";

export function formatShareDate(date = new Date()): string {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

/** Wraps a game's result body in the standard "share this" message. */
export function buildShareMessage(gameLabel: string, resultBody: string, date = new Date()): string {
  return `Confira meu resultado no Codaily (${formatShareDate(date)})!\n\n${gameLabel}\n${resultBody}\n\n${SITE_URL}`;
}
