import path from "node:path";
import { fileURLToPath } from "node:url";

/** Loads keys from a .env file in the project root, if there is one. Import this first. */
const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", ".env");
try {
  process.loadEnvFile(file);
} catch {
  // No .env file: use the real environment.
}
