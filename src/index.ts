#!/usr/bin/env node

import { runCli } from "./cli/index.js";

async function main() {
  try {
    await runCli();
    process.exit(0);
  } catch (error: any) {
    console.error(`❌ ${error.message || "An unexpected error occurred."}`);
    process.exit(1);
  }
}

main();
