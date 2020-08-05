export function safeExec (regex: RegExp, s: string) {
  return safeResult(regex.test(s) ? regex.exec(s) : null);
}

function safeResult (result: string[] | null) {
  return {
    getOrElse (index: number, fallback: string) {
      return result ? result[index] : fallback;
    }
  };
}
