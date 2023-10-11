import { createHash } from "crypto";
import { stringify } from "superjson";

export default function hash(data: unknown) {
  return createHash("sha256").update(stringify(data)).digest("hex");
}
