import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const MIGRATIONS_DIR = path.join(process.cwd(), "prisma/migrations");
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set");
  process.exit(1);
}

function run(cmd) {
  console.log(`→ ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
}

console.log("🚀 Starting database initialization…");

/**
 * Ensure migration_meta table exists
 */
run(`
psql "${DATABASE_URL}" <<'SQL'
CREATE TABLE IF NOT EXISTS migration_meta (
  key text PRIMARY KEY,
  value text,
  created_at timestamptz DEFAULT now()
);
SQL
`);

/**
 * Run-once guard
 */
const alreadyRan = execSync(`
psql "${DATABASE_URL}" -t -c "
SELECT 1 FROM migration_meta WHERE key = 'initial_bootstrap';
"
`, { encoding: "utf8" }).trim();

if (alreadyRan) {
  console.log("✅ Database already initialized. Skipping.");
  process.exit(0);
}

/**
 * Run SQL migrations
 */
const migrationFiles = fs
  .readdirSync(MIGRATIONS_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()
  .map((dir) => path.join(MIGRATIONS_DIR, dir, "migration.sql"))
  .filter((filePath) => fs.existsSync(filePath));

for (const filePath of migrationFiles) {
  const label = path.relative(process.cwd(), filePath);
  console.log(`📄 Running migration: ${label}`);
  run(`psql "${DATABASE_URL}" -f "${filePath}"`);
}

/**
 * Mark init complete
 */
run(`
psql "${DATABASE_URL}" -c "
INSERT INTO migration_meta (key, value)
VALUES ('initial_bootstrap', 'done')
ON CONFLICT DO NOTHING;
"
`);

console.log("🎉 Database migrations completed.");
