import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const dbStatus = await database.status();
  response.status(200).json({
    updated_at: updatedAt,
    database: dbStatus,
  });
  console.log(dbStatus);
}

export default status;
