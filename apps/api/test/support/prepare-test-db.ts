import { Client } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to prepare the test database.");
}

const targetUrl = new URL(connectionString);
const databaseName = targetUrl.pathname.slice(1);
const maintenanceUrl = new URL(connectionString);
maintenanceUrl.pathname = "/postgres";

const schema = targetUrl.searchParams.get("schema") ?? "public";
const escapedSchema = schema.replaceAll("\"", "\"\"");
const escapedDatabaseName = databaseName.replaceAll("\"", "\"\"");
const maintenanceClient = new Client({
  connectionString: maintenanceUrl.toString(),
});
const targetClient = new Client({ connectionString });

async function main() {
  await maintenanceClient.connect();
  const existingDatabase = await maintenanceClient.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [databaseName],
  );

  if (existingDatabase.rowCount === 0) {
    await maintenanceClient.query(`CREATE DATABASE "${escapedDatabaseName}"`);
  }

  await maintenanceClient.end();

  await targetClient.connect();
  await targetClient.query(`CREATE SCHEMA IF NOT EXISTS "${escapedSchema}"`);
  await targetClient.end();
}

main().catch(async (error: unknown) => {
  await maintenanceClient.end().catch(() => undefined);
  await targetClient.end().catch(() => undefined);
  throw error;
});
