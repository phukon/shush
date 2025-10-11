type SuppressionRule = string | RegExp;

// storing a ref to the original function to restore later
const originalWarning: typeof process.emitWarning = process.emitWarning;
let supressionRules: SuppressionRule[] = [];

function isWarningSuppressed(message: string): boolean {
  if (!message || supressionRules.length === 0) return false;

  const messageLower = message.toLowerCase();

  for (const rule of supressionRules) {
    if (typeof rule === "string") {
      // checking simple string inclusion (case insensitive)
      if (messageLower.includes(rule.toLowerCase())) return true;
    } else if (rule instanceof RegExp) {
      if (rule.test(message)) return true;
    }
  }

  return false;
}

/**
 * Installs the warning interceptor and sets the supression rules
 * @param rules An array of strings or regular expressions to match against warning messages
 */
export function suppressWarnings(rules: SuppressionRule[] = []): void {
  if (Array.isArray(rules)) {
    supressionRules = rules.filter(
      (rule): rule is SuppressionRule =>
        typeof rule === "string" || rule instanceof RegExp,
    );
  } else supressionRules = [];

  // only override if we haven't already

  if (process.emitWarning === originalWarning) {
    process.emitWarning = function (
      warning: unknown,
      ...rest: unknown[]
    ): void {
      let warningMessage: string | undefined;

      if (typeof warning === "string") warningMessage = warning;
      else if (warning instanceof Error) warningMessage = warning.message;
      else if (warning && typeof (warning as any).toString === "function")
        warningMessage = warning.toString();

      // if we can't determine a string message. pass it through
      if (!warningMessage)
        return originalWarning.apply(process, [warning, ...rest] as any);

      if (isWarningSuppressed(warningMessage)) return; // supressed here

      // not supressed
      return originalWarning.apply(process, [warning, ...rest] as any);
    };
  }
}

export function restoreWarnings(): void {
  process.emitWarning = originalWarning;
  supressionRules = [];
}

export default {
  suppressWarnings,
  restoreWarnings,
};
