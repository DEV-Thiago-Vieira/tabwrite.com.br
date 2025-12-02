import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });
  await client.connect();
  const result = await client.query(queryObject);
  await client.end();
  return result;
}

async function status() {
  const versionRow = await query("SHOW server_version;");
  const versionValue = versionRow.rows[0].server_version;
  const maxConnectionsRow = await query("SHOW max_connections;");
  const maxConnectionsValue = Number(maxConnectionsRow.rows[0].max_connections);
  const usedConnectionsRow = await query(
    "SELECT COUNT(*) FROM pg_stat_activity;",
  );
  const usedConnectionsValue = Number(usedConnectionsRow.rows[0].count);

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
