import fs from "node:fs";
import path from "node:path";
import { writeSchema } from "./permify.client.js";

export async function initPermifySchema() {
  const schema = fs.readFileSync(
    path.resolve("src/permify/schema.perm"),
    "utf-8"
  );

  await writeSchema(schema);
}