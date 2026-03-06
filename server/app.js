// Load variables from .env
import "dotenv/config";
// Import express (webbserver framework)
import express from "express";
// Import node-postgres (pg) which alows Node to communicate with postgresql
import pg from "pg";

// Use Pool-class from pb-libary (Pool handles reuse of DB-connections)
const { Pool } = pg;

// Create express app
const app = express();
// Set which port the server should listen to (from .env)
const port = process.env.PORT;

// Serve frontend from server/public
app.use(express.static("public"));

// Skapa en DB-pool (återanvänds mellan requests)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Used for debugging, leaving it here for now
//console.log("DATABASE_URL =", process.env.DATABASE_URL);

// Starts the server and listen to the port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});