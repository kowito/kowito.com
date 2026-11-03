import { type Abi, type AbiFunction, type AbiParameter, isAddress, isHex, parseAbi } from "viem";

/** Accepts a JSON ABI, a `{ abi: [...] }` artifact, or human-readable signatures (one per line). */
export function parseAbiText(text: string): AbiFunction[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  let abi: Abi;
  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    const json = JSON.parse(trimmed);
    abi = (Array.isArray(json) ? json : json.abi) as Abi;
    if (!Array.isArray(abi)) throw new Error("JSON does not contain an ABI array");
  } else {
    const lines = trimmed
      .split("\n")
      .map((l) => l.trim().replace(/;$/, ""))
      .filter(Boolean)
      .map((l) => (l.startsWith("function ") ? l : `function ${l}`));
    abi = parseAbi(lines);
  }
  return abi.filter((item): item is AbiFunction => item.type === "function");
}

export function functionSignature(fn: AbiFunction): string {
  return `${fn.name}(${fn.inputs.map((i) => `${i.type}${i.name ? ` ${i.name}` : ""}`).join(", ")})`;
}

/**
 * Converts a form value into what viem's encoder expects for `param`.
 * Scalars are typed as text; arrays and tuples are entered as JSON.
 */
export function coerceInput(param: AbiParameter, raw: unknown): unknown {
  const label = param.name || param.type;
  const arrayMatch = param.type.match(/^(.*)\[(\d*)\]$/);
  if (arrayMatch) {
    const items = typeof raw === "string" ? JSON.parse(raw || "[]") : raw;
    if (!Array.isArray(items)) throw new Error(`${label}: expected a JSON array`);
    if (arrayMatch[2] && items.length !== Number(arrayMatch[2])) {
      throw new Error(`${label}: expected exactly ${arrayMatch[2]} items`);
    }
    const inner = { ...param, type: arrayMatch[1] } as AbiParameter;
    return items.map((item) => coerceInput(inner, item));
  }

  if (param.type === "tuple") {
    const components = (param as { components: readonly AbiParameter[] }).components;
    const value = typeof raw === "string" ? JSON.parse(raw || "null") : raw;
    if (Array.isArray(value)) return components.map((c, i) => coerceInput(c, value[i]));
    if (value && typeof value === "object") {
      return Object.fromEntries(
        components.map((c, i) => [c.name ?? i, coerceInput(c, (value as Record<string, unknown>)[c.name ?? i])]),
      );
    }
    throw new Error(`${label}: expected a JSON array or object`);
  }

  const text = typeof raw === "string" ? raw.trim() : String(raw ?? "");
  if (param.type === "address") {
    if (!isAddress(text, { strict: false })) throw new Error(`${label}: invalid address`);
    return text;
  }
  if (param.type === "bool") {
    if (text !== "true" && text !== "false") throw new Error(`${label}: enter true or false`);
    return text === "true";
  }
  if (/^u?int\d*$/.test(param.type)) {
    try {
      return BigInt(text);
    } catch {
      throw new Error(`${label}: invalid integer`);
    }
  }
  if (param.type.startsWith("bytes")) {
    if (!isHex(text)) throw new Error(`${label}: expected 0x-prefixed hex`);
    return text;
  }
  return text;
}

export function placeholderFor(param: AbiParameter): string {
  if (param.type.endsWith("]")) return '["…"] (JSON)';
  if (param.type === "tuple") return "[…] or {…} (JSON)";
  if (param.type === "address") return "0x…";
  if (param.type === "bool") return "true / false";
  if (param.type.startsWith("bytes")) return "0x…";
  if (/^u?int/.test(param.type)) return "integer in base units";
  return param.type;
}
