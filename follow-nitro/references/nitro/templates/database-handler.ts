import { defineHandler } from "nitro";
import { useDatabase } from "nitro/database";

export default defineHandler(async (event) => {
  const db = useDatabase();
  
  // Create table if not exists
  await db.exec`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT
    )
  `;
  
  // Insert user
  await db.sql`
    INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com')
  `;
  
  // Query users
  const users = await db.sql`SELECT * FROM users`;
  
  return { users };
});
