// scripts/migrate.js
const { execSync } = require("child_process");

const name = process.argv[2];
if (!name) {
  console.error("Please provide a migration name!");
  process.exit(1);
}

const command = `npx typeorm-ts-node-commonjs migration:generate ./src/migrations/${name} -d ./src/config/data-source.ts`;

console.log("Running migration command: ", command);
execSync(command, { stdio: "inherit" });
