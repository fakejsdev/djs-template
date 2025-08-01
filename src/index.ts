async function main() {
  try {
    console.log("Starting CLI...");
  } catch (error: any) {
    console.error(
      `\x1b[1m❌ ${error.message || "An unexpected error occurred."}\x1b[0m`
    );
    process.exit(1);
  }
}

main();
