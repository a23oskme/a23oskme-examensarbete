// Import node-postgres (pg) which alows Node to communicate with postgresql
import pg from "pg";
// Use Pool-class from pb-libary (Pool handles reuse of DB-connections)
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;