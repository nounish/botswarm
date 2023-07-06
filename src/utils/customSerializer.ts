export function parse(string: string) {
  return JSON.parse(string, (key, value) => {
    if (typeof value === "string" && value.startsWith("BIGINT::")) {
      return BigInt(value.substring(8));
    }
    return value;
  });
}

export function stringify(object: Object) {
  return JSON.stringify(object, (key, value) =>
    typeof value === "bigint" ? `BIGINT::${value}` : value
  );
}
