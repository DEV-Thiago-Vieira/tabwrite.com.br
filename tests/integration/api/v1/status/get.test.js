test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();
  expect(responseBody.database.name).toBeDefined();
  expect(responseBody.database.version).toBeDefined();
  expect(responseBody.database.max_connections).toBeDefined();
  expect(responseBody.database.used_connections).toBeDefined();

  const parsedDate = new Date(responseBody.updated_at).toISOString();

  expect(responseBody.updated_at).toEqual(parsedDate);
  expect(Number(responseBody.database.max_connections)).toBe(100);
});
