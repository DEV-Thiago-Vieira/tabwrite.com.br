import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });
  console.log("Credenciais do postgres:", {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });
  try {
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await client.end();
  }
}

async function status() {
  const versionRow = await query("SHOW server_version;");
  const versionValue = versionRow.rows[0].server_version;

  const maxConnectionsRow = await query("SHOW max_connections;");
  const maxConnectionsValue = Number(maxConnectionsRow.rows[0].max_connections);

  const databaseName = process.env.POSTGRES_DB;
  const usedConnectionsRow = await query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const usedConnectionsValue = usedConnectionsRow.rows[0].count;

  console.log(usedConnectionsValue);

  return {
    name: "PostgreSQL",
    version: versionValue,
    max_connections: maxConnectionsValue,
    used_connections: usedConnectionsValue,
  };
}

export default {
  query: query,
  status: status,
};
